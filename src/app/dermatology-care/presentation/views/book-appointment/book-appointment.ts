import {Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {take} from 'rxjs';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {IamStore} from '../../../../iam/application/iam.store';

/** View model for a selectable day in the booking calendar. */
interface CalendarDay {
  day:  number;
  name: string;
  date: Date;
}

const DAY_NAMES          = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DESKTOP_BREAKPOINT = 768;

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
export class BookAppointment implements OnInit {
  readonly store            = inject(DermatologyCareStore);
  private readonly iamStore = inject(IamStore);
  protected router          = inject(Router);
  private translateSvc      = inject(TranslateService);

  selectedDay    = signal<number>(0);
  selectedTime   = signal<string>('');
  pageOffset     = signal<number>(0);
  pageSize       = signal<number>(this.getPageSize());
  doctorPhotoUrl = signal<string | null>(null);

  private touchStartX = 0;

  @HostListener('window:resize')
  onResize(): void {
    const newSize = this.getPageSize();
    if (newSize !== this.pageSize()) {
      this.pageSize.set(newSize);
      this.pageOffset.set(0);
      this.selectedDay.set(0);
      this.selectedTime.set('');
    }
  }

  private getPageSize(): number {
    return window.innerWidth < DESKTOP_BREAKPOINT ? 3 : 5;
  }

  ngOnInit(): void {
    const derm = this.store.selectedDermatologist();
    if (derm) {
      this.store.selectDermatologist(derm);
    }
    if (derm) {
      this.iamStore.getUserById(derm.userId)
        .pipe(take(1))
        .subscribe({
          next:  user => this.doctorPhotoUrl.set(user.photoUrl ?? null),
          error: ()   => {},
        });
    }
  }

  /** Calendar days for the current page, mapped from the store's upcoming available dates. */
  readonly calendarDays = computed((): CalendarDay[] =>
    this.store.upcomingAvailableDates()
      .slice(this.pageOffset(), this.pageOffset() + this.pageSize())
      .map(date => ({ day: date.getDate(), name: DAY_NAMES[date.getDay()], date }))
  );

  readonly hasNextPage = computed(() =>
    this.pageOffset() + this.pageSize() < this.store.upcomingAvailableDates().length
  );

  readonly hasPrevPage = computed(() => this.pageOffset() > 0);

  /** Formatted working time string built from loaded availability slots. */
  readonly workingTimeText = computed((): string => {
    const toTitle = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
    const active  = this.store.availabilities().filter(a => a.active);
    if (active.length === 0) return '-';
    const groups  = new Map<string, string[]>();
    for (const a of active) {
      const key = `${a.startTime} – ${a.endTime}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(toTitle(a.dayOfWeek));
    }
    return Array.from(groups.entries())
      .map(([time, days]) => `${days.join(', ')} · ${time}`)
      .join(' | ');
  });

  /** Month label derived from the first visible calendar day. */
  readonly calendarMonth = computed((): string => {
    const days   = this.calendarDays();
    const lang   = this.translateSvc.currentLang === 'es' ? 'es-ES' : 'en-US';
    const date   = days.length > 0 ? days[0].date : new Date();
    return date.toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  });

  /** Time slots for the currently selected day, delegated to the store. */
  readonly timeSlots = computed((): string[] => {
    const selected = this.calendarDays()[this.selectedDay()];
    return selected ? this.store.timeSlotsForDate(selected.date) : [];
  });

  /** Advances to the next page of calendar days. */
  nextPage(): void {
    if (this.hasNextPage()) {
      this.pageOffset.update(o => o + this.pageSize());
      this.selectedDay.set(0);
      this.selectedTime.set('');
    }
  }

  /** Returns to the previous page of calendar days. */
  prevPage(): void {
    if (this.hasPrevPage()) {
      this.pageOffset.update(o => Math.max(0, o - this.pageSize()));
      this.selectedDay.set(0);
      this.selectedTime.set('');
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const diff = this.touchStartX - event.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) this.nextPage();
      else this.prevPage();
    }
  }

  /** Selects a calendar day by index and clears the time selection. */
  selectDay(index: number): void {
    this.selectedDay.set(index);
    this.selectedTime.set('');
  }

  /** Selects a time slot. */
  selectTime(slot: string): void {
    this.selectedTime.set(slot);
  }

  /** Saves the selected date and time, then navigates to payment. */
  confirmBooking(): void {
    const selectedDate = this.calendarDays()[this.selectedDay()]?.date;
    const selectedTime = this.selectedTime();
    if (selectedDate && selectedTime) {
      this.store.setPendingAppointmentDateTime(selectedDate, selectedTime);
    }
    this.router.navigate(['/dermatology/payment-method']);
  }

  /** Navigates back to the select doctor screen. */
  navigateBack(): void {
    this.router.navigate(['/dermatology/select-doctor']);
  }
}
