import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RoutineManagementStore } from '../../../application/routine-management.store';
import { RoutineItem } from '../../../domain/model/routine-item.entity';

/** Represents a day entry in the weekly day strip. */
interface WeekDay {
  date: Date;
  dayNumber: number;
  dayName: string;
  isToday: boolean;
  isCompleted: boolean;
}

/**
 * Displays the active skincare routine with a weekly calendar,
 * daily completion tracking, and expandable product steps.
 */
@Component({
  selector: 'app-routine-product-list',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './routine-product-list.html',
  styleUrl: './routine-product-list.css',
})
export class RoutineProductList {
  readonly store = inject(RoutineManagementStore);
  protected router = inject(Router);

  /** Index of the currently expanded routine item, or null if none. */
  expandedProductId = signal<number | null>(null);

  /** The currently selected date for tracking display. */
  selectedDate = signal<Date>(new Date());

  readonly activeRoutineItems = this.store.activeRoutineItems;

  /** Calendar month offset from current month (0 = current). */
  calendarMonthOffset = signal<number>(0);

  /**
   * Computed signal for the 7-day strip centered on today.
   * Shows 3 days before today and 3 days after.
   */
  readonly weekDays = computed((): WeekDay[] => {
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const today = new Date();
    const completedSet = new Set(this.store.completedDays());
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 3 + index);
      const dateString = date.toISOString().split('T')[0];
      return {
        date,
        dayNumber: date.getDate(),
        dayName: dayNames[date.getDay()],
        isToday: date.toDateString() === today.toDateString(),
        isCompleted: completedSet.has(dateString),
      };
    });
  });

  /**
   * Computed signal for the display label of the selected date.
   * Returns a formatted string like 'Wednesday, 11'.
   */
  readonly selectedDayLabel = computed(() =>
    this.selectedDate().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' }),
  );

  /**
   * Computed signal for the calendar weeks of the currently displayed month.
   * Returns a 2D array of day numbers (null for empty cells).
   */
  readonly calendarWeeks = computed((): (number | null)[][] => {
    const today = new Date();
    const displayDate = new Date(
      today.getFullYear(),
      today.getMonth() + this.calendarMonthOffset(),
      1,
    );
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekDay = new Date(year, month, 1).getDay();
    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = Array.from({ length: firstWeekDay }, () => null);
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push([...currentWeek]);
    }
    return weeks;
  });

  /**
   * Computed signal for the currently displayed month and year label.
   * Returns a string like 'May 2026'.
   */
  readonly calendarMonthLabel = computed(() => {
    const today = new Date();
    const displayDate = new Date(
      today.getFullYear(),
      today.getMonth() + this.calendarMonthOffset(),
      1,
    );
    return displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  /**
   * Returns true if the given day number in the current calendar month
   * has been marked as completed.
   * @param day - The day number to check.
   * @returns True if the day is completed.
   */
  readonly isDayCompletedInCalendar = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date();
    const displayDate = new Date(
      today.getFullYear(),
      today.getMonth() + this.calendarMonthOffset(),
      day,
    );
    const dateString = displayDate.toISOString().split('T')[0];
    return this.store.completedDays().includes(dateString);
  };

  /**
   * Returns true if the selected date has been marked as completed.
   */
  readonly isSelectedDayCompleted = computed(() => {
    const dateString = this.selectedDate().toISOString().split('T')[0];
    return this.store.completedDays().includes(dateString);
  });

  /** Selects a day from the weekly strip. */
  selectWeekDay(day: WeekDay): void {
    this.selectedDate.set(day.date);
  }

  /** Selects a day number from the month calendar. */
  selectCalendarDay(day: number | null): void {
    if (!day) return;
    const today = new Date();
    const displayDate = new Date(
      today.getFullYear(),
      today.getMonth() + this.calendarMonthOffset(),
      day,
    );
    this.selectedDate.set(displayDate);
  }

  /** Advances the calendar to the next month. */
  nextMonth(): void {
    this.calendarMonthOffset.update((offset) => offset + 1);
  }

  /** Moves the calendar back to the previous month. */
  previousMonth(): void {
    this.calendarMonthOffset.update((offset) => offset - 1);
  }

  /**
   * Toggles the completion state of the selected day.
   * Marks as completed if not yet done, otherwise marks as not completed.
   */
  toggleDayCompletion(): void {
    const dateString = this.selectedDate().toISOString().split('T')[0];
    if (this.isSelectedDayCompleted()) {
      this.store.markDayNotCompleted(dateString);
    } else {
      this.store.markDayCompleted(dateString);
    }
  }

  /**
   * Toggles the expanded state of a routine item card.
   * Collapses if already expanded, expands if not.
   * @param itemId - The ID of the routine item to toggle.
   */
  toggleProductExpand(itemId: number): void {
    this.expandedProductId.update((current) => (current === itemId ? null : itemId));
  }

  /**
   * Navigates to the product replacement view for the given routine item.
   * @param routineItem - The routine item whose product will be replaced.
   */
  navigateToReplaceProduct(routineItem: RoutineItem): void {
    this.store.selectRoutine(this.store.activeRoutine()!);
    this.router.navigate(['/routine/product-replacement'], {
      queryParams: { routineItemId: routineItem.id },
    });
  }
}
