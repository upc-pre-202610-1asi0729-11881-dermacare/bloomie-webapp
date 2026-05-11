import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { Routine, RoutineStatus } from '../domain/model/routine.entity';
import { RoutineItem, RoutineStep } from '../domain/model/routine-item.entity';
import { DailyTracking, TrackingStatus } from '../domain/model/daily-tracking.entity';
import { RoutineManagementApi } from '../infrastructure/routine-management-api';

/**
 * Holds routine management application state and coordinates
 * routine, routine item, and daily tracking application layer behavior.
 */
@Injectable({ providedIn: 'root' })
export class RoutineManagementStore {
  private readonly routinesSignal = signal<Routine[]>([]);
  private readonly routineItemsSignal = signal<RoutineItem[]>([]);
  private readonly dailyTrackingsSignal = signal<DailyTracking[]>([]);
  private readonly selectedRoutineSignal = signal<Routine | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal for the list of routines.
   */
  readonly routines = this.routinesSignal.asReadonly();

  /**
   * Readonly signal for the list of routine items.
   */
  readonly routineItems = this.routineItemsSignal.asReadonly();

  /**
   * Readonly signal for the list of daily tracking records.
   */
  readonly dailyTrackings = this.dailyTrackingsSignal.asReadonly();

  /**
   * Readonly signal for the currently selected routine.
   */
  readonly selectedRoutine = this.selectedRoutineSignal.asReadonly();

  /**
   * Readonly signal indicating if data is loading.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Readonly signal for the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Computed signal for the active routine, if one exists.
   * A user should only have one active routine at a time.
   */
  readonly activeRoutine = computed(
    () => this.routinesSignal().find((routine) => routine.isActive) ?? null,
  );

  /**
   * Computed signal for the items belonging to the currently active routine,
   * sorted by their display order.
   */
  readonly activeRoutineItems = computed(() => {
    const active = this.activeRoutine();
    if (!active) return [];
    return this.routineItemsSignal()
      .filter((item) => item.routineId === active.id)
      .sort((itemA, itemB) => itemA.order - itemB.order);
  });

  /**
   * Computed signal for the number of completed days in the current week
   * for the active routine.
   * A week is defined as the last 7 days including today.
   */
  readonly completedDaysThisWeek = computed(() => {
    const active = this.activeRoutine();
    if (!active) return 0;
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    return this.dailyTrackingsSignal().filter((tracking) => {
      if (tracking.routineId !== active.id) return false;
      if (!tracking.isCompleted) return false;
      const trackingDate = new Date(tracking.date);
      return trackingDate >= weekStart && trackingDate <= today;
    }).length;
  });

  /**
   * Computed signal for the overall completion percentage of the active routine
   * based on the last 30 days of tracking records.
   * Returns a number between 0 and 100.
   */
  readonly completionPercentage = computed(() => {
    const active = this.activeRoutine();
    if (!active) return 0;
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);
    const trackingsInRange = this.dailyTrackingsSignal().filter((tracking) => {
      if (tracking.routineId !== active.id) return false;
      const trackingDate = new Date(tracking.date);
      return trackingDate >= thirtyDaysAgo && trackingDate <= today;
    });
    if (trackingsInRange.length === 0) return 0;
    const completedCount = trackingsInRange.filter((tracking) => tracking.isCompleted).length;
    return Math.round((completedCount / trackingsInRange.length) * 100);
  });

  /**
   * Computed signal for the list of completed day date strings
   * in the current week for the active routine.
   * Used to mark days as completed in the calendar UI.
   */
  readonly completedDays = computed((): string[] =>
    this.dailyTrackingsSignal()
      .filter((tracking) => {
        const active = this.activeRoutine();
        return active !== null && tracking.routineId === active.id && tracking.isCompleted;
      })
      .map((tracking) => tracking.date),
  );

  private readonly destroyRef = inject(DestroyRef);

  /**
   * Creates an instance of RoutineManagementStore and loads initial data.
   * @param routineManagementApi - The API service for routine management data.
   */
  constructor(private routineManagementApi: RoutineManagementApi) {
    this.loadRoutines();
    this.loadRoutineItems();
    this.loadDailyTrackings();
  }

  /**
   * Selects a routine and sets it as the currently active selection.
   * @param routine - The routine to select.
   */
  selectRoutine(routine: Routine): void {
    this.selectedRoutineSignal.set(routine);
  }

  /**
   * Selects a routine by identifier.
   * @param id - Routine identifier.
   * @returns Reactive selection for the requested routine.
   */
  getRoutineById(id: number): Signal<Routine | undefined> {
    return computed(() =>
      id ? this.routinesSignal().find((routine) => routine.id === id) : undefined,
    );
  }

  /**
   * Selects a routine item by identifier.
   * @param id - Routine item identifier.
   * @returns Reactive selection for the requested routine item.
   */
  getRoutineItemById(id: number): Signal<RoutineItem | undefined> {
    return computed(() =>
      id ? this.routineItemsSignal().find((item) => item.id === id) : undefined,
    );
  }

  /**
   * Returns the daily tracking records for a given routine,
   * filtered to the last 7 days including today.
   * @param routineId - The routine identifier to filter by.
   * @returns Computed signal with the weekly tracking records.
   */
  getWeeklyTrackingsForRoutine(routineId: number): Signal<DailyTracking[]> {
    return computed(() => {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 6);
      return this.dailyTrackingsSignal().filter((tracking) => {
        if (tracking.routineId !== routineId) return false;
        const trackingDate = new Date(tracking.date);
        return trackingDate >= weekStart && trackingDate <= today;
      });
    });
  }

  /**
   * Replaces the product of an existing routine item with a new product.
   * @param routineItemId - The ID of the routine item to update.
   * @param newProductId - The ID of the new product to assign.
   */
  replaceProduct(routineItemId: number, newProductId: number): void {
    const existingItem = this.routineItemsSignal().find((item) => item.id === routineItemId);
    if (!existingItem) return;
    const updatedItem = new RoutineItem({
      id: existingItem.id,
      routineId: existingItem.routineId,
      productId: newProductId,
      step: existingItem.step,
      scheduledTime: existingItem.scheduledTime,
      status: existingItem.status,
      order: existingItem.order,
    });
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.routineManagementApi
      .updateRoutineItem(updatedItem)
      .pipe(retry(2))
      .subscribe({
        next: (updated) => {
          this.routineItemsSignal.update((items) =>
            items.map((item) => (item.id === updated.id ? updated : item)),
          );
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to replace product'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Marks a given date as completed for the active routine.
   * If a tracking record already exists for that date it updates it,
   * otherwise it creates a new one.
   * @param date - The date string to mark as completed (e.g. '2026-05-11').
   */
  markDayCompleted(date: string): void {
    const active = this.activeRoutine();
    if (!active) return;
    const existing = this.dailyTrackingsSignal().find(
      (tracking) => tracking.routineId === active.id && tracking.date === date,
    );
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    if (existing) {
      const updated = new DailyTracking({
        id: existing.id,
        routineId: existing.routineId,
        userId: existing.userId,
        date: existing.date,
        status: TrackingStatus.Completed,
      });
      this.routineManagementApi
        .updateDailyTracking(updated)
        .pipe(retry(2))
        .subscribe({
          next: (savedTracking) => {
            this.dailyTrackingsSignal.update((trackings) =>
              trackings.map((tracking) =>
                tracking.id === savedTracking.id ? savedTracking : tracking,
              ),
            );
            this.loadingSignal.set(false);
          },
          error: (err) => {
            this.errorSignal.set(this.formatError(err, 'Failed to mark day as completed'));
            this.loadingSignal.set(false);
          },
        });
    } else {
      this.routineManagementApi
        .markDayCompleted(active.id, date)
        .pipe(retry(2))
        .subscribe({
          next: (createdTracking) => {
            this.dailyTrackingsSignal.update((trackings) => [...trackings, createdTracking]);
            this.loadingSignal.set(false);
          },
          error: (err) => {
            this.errorSignal.set(this.formatError(err, 'Failed to mark day as completed'));
            this.loadingSignal.set(false);
          },
        });
    }
  }

  /**
   * Marks a given date as not completed for the active routine.
   * If a tracking record already exists for that date it updates it,
   * otherwise it creates a new one.
   * @param date - The date string to mark as not completed (e.g. '2026-05-11').
   */
  markDayNotCompleted(date: string): void {
    const active = this.activeRoutine();
    if (!active) return;
    const existing = this.dailyTrackingsSignal().find(
      (tracking) => tracking.routineId === active.id && tracking.date === date,
    );
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    if (existing) {
      const updated = new DailyTracking({
        id: existing.id,
        routineId: existing.routineId,
        userId: existing.userId,
        date: existing.date,
        status: TrackingStatus.NotCompleted,
      });
      this.routineManagementApi
        .updateDailyTracking(updated)
        .pipe(retry(2))
        .subscribe({
          next: (savedTracking) => {
            this.dailyTrackingsSignal.update((trackings) =>
              trackings.map((tracking) =>
                tracking.id === savedTracking.id ? savedTracking : tracking,
              ),
            );
            this.loadingSignal.set(false);
          },
          error: (err) => {
            this.errorSignal.set(this.formatError(err, 'Failed to mark day as not completed'));
            this.loadingSignal.set(false);
          },
        });
    } else {
      this.routineManagementApi
        .markDayNotCompleted(active.id, date)
        .pipe(retry(2))
        .subscribe({
          next: (createdTracking) => {
            this.dailyTrackingsSignal.update((trackings) => [...trackings, createdTracking]);
            this.loadingSignal.set(false);
          },
          error: (err) => {
            this.errorSignal.set(this.formatError(err, 'Failed to mark day as not completed'));
            this.loadingSignal.set(false);
          },
        });
    }
  }

  /**
   * Updates the status of the active routine.
   * @param status - The new RoutineStatus to apply.
   */
  updateRoutineStatus(status: RoutineStatus): void {
    const active = this.activeRoutine();
    if (!active) return;
    const updated = new Routine({
      id: active.id,
      userId: active.userId,
      skinProfileId: active.skinProfileId,
      facialScanId: active.facialScanId,
      status,
      createdAt: active.createdAt,
    });
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.routineManagementApi
      .updateRoutine(updated)
      .pipe(retry(2))
      .subscribe({
        next: (savedRoutine) => {
          this.routinesSignal.update((routines) =>
            routines.map((routine) => (routine.id === savedRoutine.id ? savedRoutine : routine)),
          );
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update routine status'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Loads all routines from the API.
   */
  private loadRoutines(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.routineManagementApi
      .getRoutines()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (routines) => {
          this.routinesSignal.set(routines);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load routines'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Loads all routine items from the API.
   */
  private loadRoutineItems(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.routineManagementApi
      .getRoutineItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (routineItems) => {
          this.routineItemsSignal.set(routineItems);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load routine items'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Loads all daily tracking records from the API.
   */
  private loadDailyTrackings(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.routineManagementApi
      .getDailyTrackings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dailyTrackings) => {
          this.dailyTrackingsSignal.set(dailyTrackings);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load daily trackings'));
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
