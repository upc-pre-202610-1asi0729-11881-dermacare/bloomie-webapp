import {Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {Appointment} from '../../../domain/model/appointment.entity';

/** Represents a day cell in the dermatologist's agenda strip. */
interface AgendaDay {
  day:     number;
  name:    string;
  isToday: boolean;
}

/**
 * Shows the dermatologist's daily appointment agenda
 * with a day strip for navigation and a list of scheduled consultations.
 */
@Component({
  selector:    'app-derm-agenda',
  imports:     [MatIconModule, TranslatePipe],
  templateUrl: './derm-agenda.html',
  styleUrl:    './derm-agenda.css',
})
export class DermAgenda {
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  selectedDayIndex = signal<number>(0);

  private readonly dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  /** Agenda days centered on today. */
  readonly agendaDays = computed((): AgendaDay[] => {
    const today = new Date();
    return Array.from({length: 7}, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index - 2);
      return {
        day:     date.getDate(),
        name:    this.dayNames[date.getDay()],
        isToday: index === 2,
      };
    });
  });

  /** Count of confirmed appointments. */
  readonly completedCount = computed(() =>
    this.store.appointments().filter(appointment => appointment.isConfirmed).length
  );

  /** Selects a day in the agenda strip. */
  selectDay(index: number): void {
    this.selectedDayIndex.set(index);
  }

  /** Navigates to the derm virtual call screen for the selected appointment. */
  startCall(appointment: Appointment): void {
    this.store.selectAppointment(appointment);
    this.router.navigate(['/derm/virtual-call']);
  }
}
