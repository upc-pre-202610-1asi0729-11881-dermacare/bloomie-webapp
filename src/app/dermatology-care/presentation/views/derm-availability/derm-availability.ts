import {Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {DermatologistAvailability} from '../../../domain/model/dermatologist-availability.entity';

/** Represents a day option in the availability form. */
interface DayOption {
  id:       string;
  labelKey: string;
  short:    string;
}

/**
 * Allows the dermatologist to configure working days, hours,
 * and appointment slot duration.
 */
@Component({
  selector:    'app-derm-availability',
  imports:     [MatIconModule, MatSelectModule, FormsModule, TranslatePipe],
  templateUrl: './derm-availability.html',
  styleUrl:    './derm-availability.css',
})
export class DermAvailability {
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  saveSuccess  = signal<boolean>(false);
  startTime    = signal<string>('09:00 AM');
  endTime      = signal<string>('05:00 PM');
  slotDuration = signal<string>('30');
  activeDays   = signal<Set<string>>(new Set(['mon', 'tue', 'wed', 'thu', 'fri']));

  /** Available weekday options. */
  readonly days: DayOption[] = [
    { id: 'mon', labelKey: 'dermatology.dermAvailability.days.monday',    short: 'Mo' },
    { id: 'tue', labelKey: 'dermatology.dermAvailability.days.tuesday',   short: 'Tu' },
    { id: 'wed', labelKey: 'dermatology.dermAvailability.days.wednesday', short: 'We' },
    { id: 'thu', labelKey: 'dermatology.dermAvailability.days.thursday',  short: 'Th' },
    { id: 'fri', labelKey: 'dermatology.dermAvailability.days.friday',    short: 'Fr' },
    { id: 'sat', labelKey: 'dermatology.dermAvailability.days.saturday',  short: 'Sa' },
    { id: 'sun', labelKey: 'dermatology.dermAvailability.days.sunday',    short: 'Su' },
  ];

  /** Available time options for start/end selection. */
  readonly timeOptions: string[] = [
    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
  ];

  /** Available slot duration options in minutes. */
  readonly slotOptions: string[] = ['15', '30', '45', '60'];

  /** Label of currently active days for display. */
  readonly activeDaysLabel = computed(() =>
    this.days
      .filter(day => this.activeDays().has(day.id))
      .map(day => day.short)
      .join(', ') || 'None'
  );

  /** Toggles a day in the active days set. */
  toggleDay(dayId: string): void {
    this.activeDays.update(days => {
      const updated = new Set(days);
      updated.has(dayId) ? updated.delete(dayId) : updated.add(dayId);
      return updated;
    });
  }

  /**
   * Saves the availability configuration by creating availability entries
   * for each active day in the store.
   */
  saveAvailability(): void {
    const dermatologist = this.store.selectedDermatologist();
    if (!dermatologist) return;
    this.activeDays().forEach(dayId => {
      const availability = new DermatologistAvailability({
        id:              0,
        dermatologistId: dermatologist.id,
        dayOfWeek:       dayId.toUpperCase(),
        startTime:       this.startTime(),
        endTime:         this.endTime(),
        slotDuration:    Number(this.slotDuration()),
      });
      this.store.addAvailability(availability);
    });
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 2000);
  }

  /** Navigates back to the derm profile. */
  navigateBack(): void {
    this.router.navigate(['/derm/profile']);
  }
}
