import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { FacialScan, FacialScanStatus } from '../domain/model/facial-scan.entity';
import { SkinProfile } from '../domain/model/skin-profile.entity';
import { SkinAnalysisApi } from '../infrastructure/skin-analysis-api';

/**
 * Holds skin analysis application state and coordinates
 * facial scan and skin profile application layer behavior.
 */
@Injectable({ providedIn: 'root' })
export class SkinAnalysisStore {
  private readonly facialScansSignal = signal<FacialScan[]>([]);
  private readonly currentScanSignal = signal<FacialScan | null>(null);
  private readonly skinProfileSignal = signal<SkinProfile | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  private readonly destroyRef = inject(DestroyRef);

  /**
   * Readonly signal for the list of all facial scans.
   */
  readonly facialScans = this.facialScansSignal.asReadonly();

  /**
   * Readonly signal for the currently active or last viewed facial scan.
   */
  readonly currentScan = this.currentScanSignal.asReadonly();

  /**
   * Readonly signal for the user's skin profile.
   */
  readonly skinProfile = this.skinProfileSignal.asReadonly();

  /**
   * Readonly signal indicating if data is loading.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Readonly signal for the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Computed signal for the most recent completed facial scan.
   * Returns null if no completed scan exists.
   */
  readonly latestCompletedScan = computed((): FacialScan | null => {
    const completedScans = this.facialScansSignal().filter((scan) => scan.isCompleted);
    if (completedScans.length === 0) return null;
    return completedScans.reduce((latest, scan) =>
      new Date(scan.scannedAt) > new Date(latest.scannedAt) ? scan : latest,
    );
  });

  /**
   * Computed signal for the total number of completed facial scans.
   */
  readonly completedScanCount = computed(
    () => this.facialScansSignal().filter((scan) => scan.isCompleted).length,
  );

  /**
   * Computed signal for the overall skin score improvement between
   * the first and most recent completed scan.
   * Returns 0 if fewer than two completed scans exist.
   * A positive value means improvement; negative means decline.
   */
  readonly overallScoreImprovement = computed((): number => {
    const completedScans = this.facialScansSignal()
      .filter((scan) => scan.isCompleted)
      .sort(
        (scanA, scanB) => new Date(scanA.scannedAt).getTime() - new Date(scanB.scannedAt).getTime(),
      );

    if (completedScans.length < 2) return 0;

    const firstScan = completedScans[0];
    const latestScan = completedScans[completedScans.length - 1];
    return Math.round((latestScan.overallScore - firstScan.overallScore) * 10) / 10;
  });

  /**
   * Computed signal for the current adherence rate as a percentage (0–100).
   * Adherence is calculated as the ratio of completed scans over the last 30 days
   * relative to the expected cadence of one scan per week (4 expected scans per month).
   * Capped at 100 to avoid exceeding the maximum.
   */
  readonly adherenceRate = computed((): number => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);

    const recentCompletedScans = this.facialScansSignal().filter((scan) => {
      if (!scan.isCompleted) return false;
      const scannedDate = new Date(scan.scannedAt);
      return scannedDate >= thirtyDaysAgo && scannedDate <= today;
    });

    const expectedScansPerMonth = 4;
    const rate = (recentCompletedScans.length / expectedScansPerMonth) * 100;
    return Math.min(Math.round(rate), 100);
  });

  /**
   * Computed signal for the current consecutive scan streak in days.
   * Counts how many of the last consecutive days (ending today) have at least one completed scan.
   * Resets to 0 when a day is missed.
   */
  readonly currentStreak = computed((): number => {
    const completedScans = this.facialScansSignal().filter((scan) => scan.isCompleted);
    if (completedScans.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkingDate = new Date(today);

    const scannedDates = new Set(
      completedScans.map((scan) => {
        const date = new Date(scan.scannedAt);
        date.setHours(0, 0, 0, 0);
        return date.toISOString().split('T')[0];
      }),
    );

    while (true) {
      const dateKey = checkingDate.toISOString().split('T')[0];
      if (!scannedDates.has(dateKey)) break;
      streak++;
      checkingDate.setDate(checkingDate.getDate() - 1);
    }

    return streak;
  });

  /**
   * Creates an instance of SkinAnalysisStore and loads initial data.
   * @param skinAnalysisApi - The API service for skin analysis data.
   */
  constructor(private skinAnalysisApi: SkinAnalysisApi) {
    this.loadFacialScans();
    this.loadSkinProfiles();
  }

  /**
   * Selects a facial scan by identifier and sets it as the current scan.
   * @param id - Facial scan identifier.
   * @returns Reactive selection for the requested facial scan.
   */
  getFacialScanById(id: number): Signal<FacialScan | undefined> {
    return computed(() =>
      id ? this.facialScansSignal().find((scan) => scan.id === id) : undefined,
    );
  }

  /**
   * Sets the currently active facial scan by reference.
   * @param scan - The facial scan to set as current.
   */
  selectCurrentScan(scan: FacialScan): void {
    this.currentScanSignal.set(scan);
  }

  /**
   * Clears the currently active facial scan selection.
   */
  clearCurrentScan(): void {
    this.currentScanSignal.set(null);
  }

  /**
   * Submits a new facial scan to the API and adds it to the local state.
   * The scan is initially created with IN_PROGRESS status.
   * @param facialScan - The facial scan to submit.
   */
  submitFacialScan(facialScan: FacialScan): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.skinAnalysisApi
      .createFacialScan(facialScan)
      .pipe(retry(2))
      .subscribe({
        next: (createdScan) => {
          this.facialScansSignal.update((scans) => [...scans, createdScan]);
          this.currentScanSignal.set(createdScan);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to submit facial scan'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Updates an existing facial scan in the API and reflects the change locally.
   * @param facialScan - The facial scan with updated values.
   */
  updateFacialScan(facialScan: FacialScan): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.skinAnalysisApi
      .updateFacialScan(facialScan)
      .pipe(retry(2))
      .subscribe({
        next: (updatedScan) => {
          this.facialScansSignal.update((scans) =>
            scans.map((existing) => (existing.id === updatedScan.id ? updatedScan : existing)),
          );
          this.currentScanSignal.set(updatedScan);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update facial scan'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Marks a facial scan as failed and updates it in the API.
   * @param facialScan - The facial scan to mark as failed.
   */
  markScanAsFailed(facialScan: FacialScan): void {
    facialScan.status = FacialScanStatus.Failed;
    this.updateFacialScan(facialScan);
  }

  /**
   * Updates an existing skin profile in the API and reflects the change locally.
   * @param skinProfile - The skin profile with updated values.
   */
  updateSkinProfile(skinProfile: SkinProfile): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.skinAnalysisApi
      .updateSkinProfile(skinProfile)
      .pipe(retry(2))
      .subscribe({
        next: (updatedProfile) => {
          this.skinProfileSignal.set(updatedProfile);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update skin profile'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Loads all facial scans from the API.
   */
  private loadFacialScans(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.skinAnalysisApi
      .getFacialScans()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (facialScans) => {
          this.facialScansSignal.set(facialScans);
          this.currentScanSignal.set(this.latestCompletedScan());
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load facial scans'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Loads all skin profiles from the API and sets the first one as active.
   * A user is expected to have a single skin profile at most.
   */
  private loadSkinProfiles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.skinAnalysisApi
      .getSkinProfiles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (skinProfiles) => {
          this.skinProfileSignal.set(skinProfiles.length > 0 ? skinProfiles[0] : null);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load skin profile'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Normalizes unknown errors into a display-friendly message.
   * @param error - Source error.
   * @param fallback - Default message when details are unavailable.
   * @returns Normalized message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}
