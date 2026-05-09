import {Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';

/** Represents a selectable day in the booking calendar. */
interface CalendarDay {
  day:  number;
  name: string;
}

/**
 * Allows the patient to view dermatologist details and select
 * a date and time slot to book an appointment.
 */
@Component({
  selector:    'app-book-appointment',
  imports:     [MatIconModule, TranslatePipe],
  templateUrl: './book-appointment.html',
  styleUrl:    './book-appointment.css',
})
export class BookAppointment {
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  selectedDay  = signal<number>(0);
  selectedTime = signal<string>('');

  /**
   * Calendar days built from the selected dermatologist's availability.
   * Falls back to the next 5 weekdays when no availability is loaded.
   */
  readonly calendarDays = computed((): CalendarDay[] => {
    const dayNames       = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const availabilities = this.store.availabilities();
    if (availabilities.length > 0) {
      return availabilities.map(availability => ({
        day:  0,
        name: availability.dayOfWeek.slice(0, 3),
      }));
    }
    const today = new Date();
    return Array.from({length: 5}, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index + 1);
      return { day: date.getDate(), name: dayNames[date.getDay()] };
    });
  });

  /**
   * Available time slots built from the selected dermatologist's availability.
   */
  readonly timeSlots = computed((): string[] => {
    const availabilities      = this.store.availabilities();
    if (availabilities.length === 0) return [];
    const selectedAvailability = availabilities[this.selectedDay()];
    if (!selectedAvailability) return [];
    const slots: string[] = [];
    const [startHour]     = selectedAvailability.startTime.split(':').map(Number);
    const [endHour]       = selectedAvailability.endTime.split(':').map(Number);
    const duration        = selectedAvailability.slotDuration;
    let current           = startHour * 60;
    const end             = endHour * 60;
    while (current + duration <= end) {
      const startHourStr = String(Math.floor(current / 60)).padStart(2, '0');
      const startMinStr  = String(current % 60).padStart(2, '0');
      const endMinutes   = current + duration;
      const endHourStr   = String(Math.floor(endMinutes / 60)).padStart(2, '0');
      const endMinStr    = String(endMinutes % 60).padStart(2, '0');
      slots.push(`${startHourStr}:${startMinStr} - ${endHourStr}:${endMinStr}`);
      current += duration;
    }
    return slots;
  });

  /** Selects a calendar day by index. */
  selectDay(index: number): void {
    this.selectedDay.set(index);
    this.selectedTime.set('');
  }

  /** Selects a time slot. */
  selectTime(slot: string): void {
    this.selectedTime.set(slot);
  }

  /** Navigates to the payment method screen. */
  confirmBooking(): void {
    this.router.navigate(['/dermatology/payment-method']);
  }

  /** Navigates back to the select doctor screen. */
  navigateBack(): void {
    this.router.navigate(['/dermatology/select-doctor']);
  }
}
