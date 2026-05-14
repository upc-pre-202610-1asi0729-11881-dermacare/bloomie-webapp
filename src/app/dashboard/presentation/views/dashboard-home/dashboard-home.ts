import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { SkinAnalysisStore } from '../../../../skin-analysis/application/skin-analysis.store';
import { RoutineManagementStore } from '../../../../routine-management/application/routine-management.store';
import { DermatologyCareStore } from '../../../../dermatology-care/application/dermatology-care.store';
import { ProductDiscoveryStore } from '../../../../product-discovery/application/product-discovery.store';
import { SkinSensitivity, SkinType, } from '../../../../skin-analysis/domain/model/skin-profile.entity';
import { FacialScan } from '../../../../skin-analysis/domain/model/facial-scan.entity';
import { RoutineItem } from '../../../../routine-management/domain/model/routine-item.entity';
import { Appointment, AppointmentStatus, } from '../../../../dermatology-care/domain/model/appointment.entity';
import { Product } from '../../../../product-discovery/domain/model/product.entity';
import { DermatologistProfile } from '../../../../dermatology-care/domain/model/dermatologist-profile.entity';
/**
 * Represents a single bar in the skin progress chart.
 * Each bar corresponds to one completed facial scan within the last 30 days.
 */
interface SkinProgressBar {
  /** Week label shown below the bar (W1, W2, W3, W4). */
  weekLabel: string;
  /** Overall skin score for this week's representative scan (0–100). */
  score: number;
  /** Height percentage of the bar relative to the chart maximum (0–100). */
  heightPercent: number;
  /** Whether this bar corresponds to the most recent data point. */
  isLatest: boolean;
}

/**
 * Represents a single stat card shown in the top summary row.
 */
interface StatCard {
  /** i18n translation key for the card title. */
  titleKey: string;
  /** Primary value displayed in large text. */
  value: string;
  /** Secondary subtitle line beneath the value. */
  subtitle: string;
  /** Material icon name for the card. */
  icon: string;
}

/**
 * Represents a single upcoming action item shown in the actions widget.
 */
interface UpcomingAction {
  /** Material icon name for the action type. */
  icon: string;
  /** Display label for the action. */
  label: string;
  /** Secondary context text (e.g. date, timing). */
  context: string;
  /** Navigation route when the action is clicked. */
  route: string;
  /** Background color class applied to the icon container. */
  iconColor: string;
}

/**
 * Dashboard home view.
 *
 * This component is a presentation-only aggregator. It has no domain of its own.
 * It reads reactive signals from the following bounded context stores:
 *  - SkinAnalysisStore    → skin scores, skin profile, scan history
 *  - RoutineManagementStore → active routine, items, tracking data
 *  - DermatologyCareStore → upcoming appointments, dermatologist profiles
 *  - ProductDiscoveryStore  → AI-recommended products for the recommendations widget
 *
 * All computed values derive directly from store signals — no local state is
 * introduced for data that already exists in a bounded context.
 */
@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome implements OnInit {
  // ─── Injected stores ────────────────────────────────────────────────────────

  /** Provides skin scan history, profile, and score data. */
  private readonly skinAnalysisStore = inject(SkinAnalysisStore);

  /** Provides active routine, items, and daily tracking records. */
  private readonly routineManagementStore = inject(RoutineManagementStore);

  /** Provides appointment and dermatologist profile data. */
  private readonly dermatologyCareStore = inject(DermatologyCareStore);

  /** Provides the product catalog for personalized recommendations. */
  private readonly productDiscoveryStore = inject(ProductDiscoveryStore);

  /** Used for programmatic navigation to bounded context views. */
  private readonly router = inject(Router);

  /** Used to resolve translated strings for dynamic computed values. */
  private readonly translateService = inject(TranslateService);

  // ─── Greeting ────────────────────────────────────────────────────────────────

  /**
   * Greeting phrase based on the current hour of the day.
   * Morning:   00:00 – 11:59
   * Afternoon: 12:00 – 17:59
   * Evening:   18:00 – 23:59
   */
  readonly greetingKey = computed((): string => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'dashboard.greeting.morning';
    if (currentHour < 18) return 'dashboard.greeting.afternoon';
    return 'dashboard.greeting.evening';
  });

  /** Today's date formatted as a readable string (e.g. "Friday, April 24, 2026"). */
  readonly formattedToday = computed((): string =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  );

  // ─── Skin health score ───────────────────────────────────────────────────────

  /**
   * Current overall skin health score from the latest completed facial scan.
   * Returns 0 when no completed scan exists.
   */
  readonly skinHealthScore = computed((): number => {
    const latestScan = this.skinAnalysisStore.latestCompletedScan();
    return latestScan ? Math.round(latestScan.overallScore) : 0;
  });

  /**
   * Score improvement relative to the first completed scan.
   * Positive means improvement, negative means decline.
   * Sourced directly from SkinAnalysisStore computed signal.
   */
  readonly skinScoreImprovement = computed((): number =>
    this.skinAnalysisStore.overallScoreImprovement(),
  );

  // ─── Routine streak ──────────────────────────────────────────────────────────

  /**
   * Number of days in the current week where the active routine was completed.
   * A week is defined as the 7 days up to and including today.
   * Sourced from RoutineManagementStore.
   */
  readonly routineStreakDays = computed((): number =>
    this.routineManagementStore.completedDaysThisWeek(),
  );

  // ─── Next appointment ────────────────────────────────────────────────────────

  /**
   * The next upcoming appointment — the soonest scheduled or confirmed
   * appointment whose date is in the future.
   * Returns null when no upcoming appointment exists.
   */
  readonly nextAppointment = computed((): Appointment | null => {
    const now = new Date();
    const upcomingAppointments = this.dermatologyCareStore.appointments().filter((appointment) => {
      const isUpcoming =
        appointment.status === AppointmentStatus.Scheduled ||
        appointment.status === AppointmentStatus.Confirmed;
      return isUpcoming && new Date(appointment.scheduledAt) > now;
    });

    if (upcomingAppointments.length === 0) return null;

    return upcomingAppointments.reduce((earliest, appointment) =>
      new Date(appointment.scheduledAt) < new Date(earliest.scheduledAt) ? appointment : earliest,
    );
  });

  /**
   * Dermatologist profile for the next appointment.
   * Returns null when no appointment or matching profile exists.
   */
  readonly nextAppointmentDermatologist = computed((): DermatologistProfile | null => {
    const appointment = this.nextAppointment();
    if (!appointment) return null;
    return (
      this.dermatologyCareStore
        .dermatologistProfiles()
        .find((profile) => profile.id === appointment.dermatologistId) ?? null
    );
  });

  /**
   * Display-friendly date string for the next appointment (e.g. "Aug 15").
   * Returns the i18n "no appointment" key when none is scheduled.
   */
  readonly nextAppointmentDateLabel = computed((): string => {
    const appointment = this.nextAppointment();
    if (!appointment) return this.translateService.instant('dashboard.stats.noAppointment');
    return new Date(appointment.scheduledAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  });

  /**
   * Dermatologist specialty label for the next appointment subtitle.
   * The DermatologistProfile entity does not carry a display name — the backend
   * only exposes professional attributes (specialty, fee, rating, experience).
   * Specialty is therefore the correct identifier to show, consistent with
   * how the rest of the app (e.g. select-doctor view) references dermatologists.
   * Returns empty string when no appointment or matching profile exists.
   */
  readonly nextAppointmentDoctorLabel = computed((): string => {
    const dermatologist = this.nextAppointmentDermatologist();
    return dermatologist ? dermatologist.specialty : '';
  });

  // ─── Products in routine ─────────────────────────────────────────────────────

  /**
   * Number of items in the currently active routine.
   * Returns 0 when no active routine exists.
   */
  readonly productsInRoutineCount = computed(
    (): number => this.routineManagementStore.activeRoutineItems().length,
  );

  // ─── Stat cards ──────────────────────────────────────────────────────────────

  /**
   * Computed stat card data for the four summary tiles at the top of the dashboard.
   * Each card is built from bounded context store signals.
   */
  readonly statCards = computed((): StatCard[] => {
    const scoreImprovement = this.skinScoreImprovement();
    const improvementLabel =
      scoreImprovement > 0
        ? this.translateService.instant('dashboard.stats.thisWeek', { value: scoreImprovement })
        : '';

    return [
      {
        titleKey: 'dashboard.stats.skinHealthScore',
        value: `${this.skinHealthScore()}/100`,
        subtitle: improvementLabel,
        icon: 'monitor_heart',
      },
      {
        titleKey: 'dashboard.stats.routineStreak',
        value: `${this.routineStreakDays()} ${this.translateService.instant('dashboard.stats.days')}`,
        subtitle: this.translateService.instant('dashboard.stats.keepItUp'),
        icon: 'auto_awesome',
      },
      {
        titleKey: 'dashboard.stats.nextAppointment',
        value: this.nextAppointmentDateLabel(),
        subtitle: this.nextAppointmentDoctorLabel(),
        icon: 'calendar_month',
      },
      {
        titleKey: 'dashboard.stats.productsInRoutine',
        value: `${this.productsInRoutineCount()} ${this.translateService.instant('dashboard.stats.steps')}`,
        subtitle: this.translateService.instant('dashboard.stats.lastUpdatedToday'),
        icon: 'check_circle',
      },
    ];
  });

  // ─── Skin status widget ──────────────────────────────────────────────────────

  /**
   * Skin type display label derived from the user's skin profile.
   * Falls back to an empty string when no profile exists.
   */
  readonly skinTypeLabel = computed((): string => {
    const skinProfile = this.skinAnalysisStore.skinProfile();
    if (!skinProfile) return '';
    const skinType = skinProfile.skinType;

    const skinTypeTranslationKeyMap: Record<SkinType, string> = {
      [SkinType.Normal]: 'dashboard.skinStatus.skinTypes.NORMAL',
      [SkinType.Dry]: 'dashboard.skinStatus.skinTypes.DRY',
      [SkinType.Oily]: 'dashboard.skinStatus.skinTypes.OILY',
      [SkinType.Combination]: 'dashboard.skinStatus.skinTypes.COMBINATION',
      [SkinType.Sensitive]: 'dashboard.skinStatus.skinTypes.SENSITIVE',
    };

    return this.translateService.instant(
      skinTypeTranslationKeyMap[skinType] ?? 'dashboard.skinStatus.skinTypes.NORMAL',
    );
  });

  /**
   * Skin sensitivity subtitle derived from the user's skin profile.
   * Falls back to an empty string when no profile exists.
   */
  readonly skinSensitivityLabel = computed((): string => {
    const skinProfile = this.skinAnalysisStore.skinProfile();
    if (!skinProfile) return '';

    const sensitivityTranslationKeyMap: Record<SkinSensitivity, string> = {
      [SkinSensitivity.Low]: 'dashboard.skinStatus.sensitivity_levels.LOW',
      [SkinSensitivity.Medium]: 'dashboard.skinStatus.sensitivity_levels.MEDIUM',
      [SkinSensitivity.High]: 'dashboard.skinStatus.sensitivity_levels.HIGH',
    };

    return this.translateService.instant(
      sensitivityTranslationKeyMap[skinProfile.sensitivity] ??
        'dashboard.skinStatus.sensitivity_levels.MEDIUM',
    );
  });

  /**
   * Overall skin score as an integer for the circular score display.
   * Sourced from the latest completed facial scan.
   */
  readonly skinStatusScore = computed((): number => this.skinHealthScore());

  /**
   * Hydration score percentage from the latest completed scan (0–100).
   */
  readonly hydrationScore = computed((): number => {
    const latestScan = this.skinAnalysisStore.latestCompletedScan();
    return latestScan ? Math.round(latestScan.hydrationScore) : 0;
  });

  /**
   * Texture score percentage from the latest completed scan (0–100).
   */
  readonly textureScore = computed((): number => {
    const latestScan = this.skinAnalysisStore.latestCompletedScan();
    return latestScan ? Math.round(latestScan.textureScore) : 0;
  });

  /**
   * Sensitivity score percentage from the latest completed scan (0–100).
   */
  readonly sensitivityScore = computed((): number => {
    const latestScan = this.skinAnalysisStore.latestCompletedScan();
    return latestScan ? Math.round(latestScan.sensitivityScore) : 0;
  });

  /**
   * Brightness score percentage from the latest completed scan (0–100).
   */
  readonly brightnessScore = computed((): number => {
    const latestScan = this.skinAnalysisStore.latestCompletedScan();
    return latestScan ? Math.round(latestScan.brightnessScore) : 0;
  });

  /**
   * Skin status trend label key (Improving / Stable / Declining).
   * Calculated by comparing the last two completed scans:
   *  - Improvement > +2 points  → "Improving"
   *  - Decline    < -2 points   → "Declining"
   *  - Otherwise                → "Stable"
   */
  readonly skinStatusTrendKey = computed((): string => {
    const improvement = this.skinAnalysisStore.overallScoreImprovement();
    if (improvement > 2) return 'dashboard.skinStatus.improving';
    if (improvement < -2) return 'dashboard.skinStatus.declining';
    return 'dashboard.skinStatus.stable';
  });

  /**
   * CSS class applied to the trend badge based on the skin status trend.
   */
  readonly skinStatusTrendClass = computed((): string => {
    const improvement = this.skinAnalysisStore.overallScoreImprovement();
    if (improvement > 2) return 'trend-badge--improving';
    if (improvement < -2) return 'trend-badge--declining';
    return 'trend-badge--stable';
  });

  // ─── Skin progress chart ─────────────────────────────────────────────────────

  /**
   * Builds the data points for the skin progress chart.
   * Groups completed scans by week within the last 30 days (4 weeks).
   * For each week, uses the highest overall score recorded in that week.
   * Bar heights are normalized relative to the maximum score in the set,
   * with a minimum visual height of 10% to keep empty weeks visible.
   */
  readonly skinProgressBars = computed((): SkinProgressBar[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekLabels = ['W1', 'W2', 'W3', 'W4'];

    /** Score buckets indexed 0–3 from oldest to newest week. */
    const weeklyScores: (number | null)[] = [null, null, null, null];

    const completedScans = this.skinAnalysisStore
      .facialScans()
      .filter((scan: FacialScan) => scan.isCompleted);

    completedScans.forEach((scan: FacialScan) => {
      const scanDate = new Date(scan.scannedAt);
      scanDate.setHours(0, 0, 0, 0);
      const daysAgo = Math.floor((today.getTime() - scanDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysAgo < 0 || daysAgo > 29) return;

      /** Week index: 0 = oldest (days 22–29), 3 = most recent (days 0–6). */
      const weekIndex = 3 - Math.floor(daysAgo / 7);
      const currentBest = weeklyScores[weekIndex];
      if (currentBest === null || scan.overallScore > currentBest) {
        weeklyScores[weekIndex] = scan.overallScore;
      }
    });

    const validScores = weeklyScores.filter((score): score is number => score !== null);
    const maximumScore = validScores.length > 0 ? Math.max(...validScores) : 100;
    const latestNonNullIndex = weeklyScores.reduce(
      (lastIndex, score, index) => (score !== null ? index : lastIndex),
      -1,
    );

    return weekLabels.map((label, index) => {
      const score = weeklyScores[index] ?? 0;
      const heightPercent = score > 0 ? Math.max(10, Math.round((score / maximumScore) * 100)) : 0;

      return {
        weekLabel: label,
        score: Math.round(score),
        heightPercent,
        isLatest: index === latestNonNullIndex,
      };
    });
  });

  // ─── Today's routine widget ──────────────────────────────────────────────────

  /**
   * Ordered list of routine items for the active routine,
   * used to render the Today's Routine widget.
   */
  readonly todaysRoutineItems = computed((): RoutineItem[] =>
    this.routineManagementStore.activeRoutineItems(),
  );

  /**
   * Number of routine items completed today.
   * Cross-references today's daily tracking record against the active routine.
   * A routine is counted as completed for today if there is a completed
   * DailyTracking record dated today for the active routine.
   */
  readonly completedRoutineItemsToday = computed((): number => {
    const activeRoutine = this.routineManagementStore.activeRoutine();
    if (!activeRoutine) return 0;

    const todayString = new Date().toISOString().split('T')[0];

    const todayTracking = this.routineManagementStore.dailyTrackings().find((tracking) => {
      return tracking.routineId === activeRoutine.id && tracking.date.startsWith(todayString);
    });

    if (!todayTracking || !todayTracking.isCompleted) return 0;

    /** When today is marked as completed, count all items as done. */
    return this.todaysRoutineItems().length;
  });

  /**
   * Progress percentage of today's routine (0–100).
   * Used to drive the progress bar width in the template.
   */
  readonly routineProgressPercent = computed((): number => {
    const totalItems = this.todaysRoutineItems().length;
    if (totalItems === 0) return 0;
    return Math.round((this.completedRoutineItemsToday() / totalItems) * 100);
  });

  /**
   * Whether the active routine has any items to display.
   */
  readonly hasActiveRoutine = computed(
    (): boolean => this.routineManagementStore.activeRoutine() !== null,
  );

  // ─── This week summary ───────────────────────────────────────────────────────

  /**
   * Number of days this week where the routine was completed.
   * Sourced from RoutineManagementStore.
   */
  readonly weekRoutineCompletedDays = computed((): number =>
    this.routineManagementStore.completedDaysThisWeek(),
  );

  /**
   * Total number of completed skin scans across all time.
   * Sourced from SkinAnalysisStore.
   */
  readonly weekSkinScansCount = computed((): number => this.skinAnalysisStore.completedScanCount());

  /**
   * Estimated total number of product applications this week.
   * Calculated as: completed days this week × number of items in the active routine.
   * This is the correct business rule: each completed day applies all routine items.
   */
  readonly weekProductsAppliedCount = computed((): number => {
    const completedDays = this.routineManagementStore.completedDaysThisWeek();
    const itemsPerDay = this.routineManagementStore.activeRoutineItems().length;
    return completedDays * itemsPerDay;
  });

  // ─── Skin scan due widget ────────────────────────────────────────────────────

  /**
   * Whether the weekly skin scan reminder should be displayed.
   * True when no completed scan exists within the last 7 days.
   * Rule: one scan per week is the expected cadence.
   */
  readonly isSkinScanDue = computed((): boolean => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCompletedScan = this.skinAnalysisStore.facialScans().some((scan: FacialScan) => {
      if (!scan.isCompleted) return false;
      return new Date(scan.scannedAt) >= sevenDaysAgo;
    });

    return !recentCompletedScan;
  });

  // ─── Upcoming actions widget ─────────────────────────────────────────────────

  /**
   * Dynamically built list of upcoming user actions.
   * Actions are included conditionally based on current app state:
   *  1. Next appointment (if one exists)
   *  2. Weekly skin scan reminder (if scan is due)
   *  3. Routine update suggestion (if routine status is UPDATE)
   */
  readonly upcomingActions = computed((): UpcomingAction[] => {
    const actions: UpcomingAction[] = [];

    const appointment = this.nextAppointment();
    if (appointment) {
      const dermatologist = this.nextAppointmentDermatologist();
      const appointmentDate = new Date(appointment.scheduledAt);
      const appointmentDateLabel = appointmentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const appointmentTimeLabel = appointmentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      actions.push({
        icon: 'calendar_month',
        label: dermatologist ? dermatologist.specialty : 'Dermatologist',
        context: `${appointmentDateLabel} · ${appointmentTimeLabel}`,
        route: '/dermatology',
        iconColor: 'action-icon--appointment',
      });
    }

    if (this.isSkinScanDue()) {
      actions.push({
        icon: 'monitor_heart',
        label: this.translateService.instant('dashboard.upcomingActions.weeklySkiScan'),
        context: this.translateService.instant('dashboard.upcomingActions.dueToday'),
        route: '/skin-analysis',
        iconColor: 'action-icon--scan',
      });
    }

    const activeRoutine = this.routineManagementStore.activeRoutine();
    if (activeRoutine && !activeRoutine.isActive) {
      actions.push({
        icon: 'auto_awesome',
        label: this.translateService.instant('dashboard.upcomingActions.updateRoutine'),
        context: this.translateService.instant('dashboard.upcomingActions.newAiSuggestion'),
        route: '/routine',
        iconColor: 'action-icon--routine',
      });
    }

    return actions;
  });

  // ─── Personalized recommendations widget ────────────────────────────────────

  /**
   * Up to four AI-recommended products shown in the recommendations widget.
   * Filtered from the full product catalog to those flagged as AI-recommended.
   * The slice limit (4) is intentional: the widget shows a 2×2 preview grid.
   */
  readonly recommendedProducts = computed((): Product[] =>
    this.productDiscoveryStore
      .products()
      .filter((product: Product) => product.isAiRecommended)
      .slice(0, 4),
  );

  /**
   * Contextual AI tip shown in the AI assistant widget.
   *
   * The tip is derived from the latest completed facial scan metrics,
   * prioritizing the lowest-scoring skin dimension so the suggestion
   * is always actionable and specific to the user's current skin state.
   *
   * Priority order (lowest score wins):
   *   1. Hydration   → hydration tip
   *   2. Brightness  → brightness tip
   *   3. Texture     → texture tip
   *   4. Sensitivity → sensitivity tip
   *
   * Returns null when no completed scan exists, so the widget hides the
   * message section and only shows the "Ask AI anything" button.
   */
  readonly aiAssistantLastMessage = computed((): string | null => {
    const latestScan = this.skinAnalysisStore.latestCompletedScan();
    if (!latestScan) return null;

    const lowestDimension = [
      { score: latestScan.hydrationScore, tipKey: 'dashboard.aiAssistant.tipHydration' },
      { score: latestScan.brightnessScore, tipKey: 'dashboard.aiAssistant.tipBrightness' },
      { score: latestScan.textureScore, tipKey: 'dashboard.aiAssistant.tipTexture' },
      { score: latestScan.sensitivityScore, tipKey: 'dashboard.aiAssistant.tipSensitivity' },
    ].reduce((lowest, current) => (current.score < lowest.score ? current : lowest));

    return this.translateService.instant(lowestDimension.tipKey);
  });

  // ─── Loading and error state ─────────────────────────────────────────────────

  /**
   * True while any of the bounded context stores is still loading data.
   * The dashboard shows a loading indicator until all stores are ready.
   */
  readonly isLoading = computed(
    (): boolean =>
      this.skinAnalysisStore.loading() ||
      this.routineManagementStore.loading() ||
      this.dermatologyCareStore.loading() ||
      this.productDiscoveryStore.loading(),
  );

  /**
   * Error message from any bounded context store, shown in the error banner.
   * Priority order: skin analysis → routine → dermatology → products.
   * Returns null when all stores are error-free.
   */
  readonly errorMessage = computed(
    (): string | null =>
      this.skinAnalysisStore.error() ??
      this.routineManagementStore.error() ??
      this.dermatologyCareStore.error() ??
      this.productDiscoveryStore.error(),
  );

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  ngOnInit(): void {
    /**
     * The bounded context stores are all provided in root and bootstrap
     * themselves on first injection. No explicit load calls are needed here.
     * This hook is kept for future dashboard-specific initialization (e.g.
     * analytics events, scroll restoration, etc.).
     */
  }

  // ─── Navigation helpers ──────────────────────────────────────────────────────

  /**
   * Navigates to the full routine management view.
   */
  goToRoutine(): void {
    this.router.navigate(['/routine']);
  }

  /**
   * Navigates to the skin analysis home view to start a new scan.
   */
  goToSkinScan(): void {
    this.router.navigate(['/skin-analysis']);
  }

  /**
   * Navigates to the AI chat assistant view.
   */
  goToAiAssistant(): void {
    this.router.navigate(['/consult']);
  }

  /**
   * Navigates to the trending / product discovery view.
   */
  goToTrending(): void {
    this.router.navigate(['/trending']);
  }

  /**
   * Navigates to a given route from an upcoming action item.
   * @param route - The route path to navigate to.
   */
  navigateToAction(route: string): void {
    this.router.navigate([route]);
  }
}
