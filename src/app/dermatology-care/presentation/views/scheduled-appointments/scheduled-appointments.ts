import {Component, computed, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {Appointment, AppointmentStatus} from '../../../domain/model/appointment.entity';

/**
 * Displays the list of the patient's scheduled appointments
 * with options to cancel or join a virtual call.
 */
@Component({
  selector:    'app-scheduled-appointments',
  imports:     [MatIconModule, TranslatePipe],
  templateUrl: './scheduled-appointments.html',
  styleUrl:    './scheduled-appointments.css',
})
export class ScheduledAppointments {
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  readonly AppointmentStatus = AppointmentStatus;

  /** Computed count of active (non-cancelled) appointments. */
  readonly activeAppointmentCount = computed(() =>
    this.store.appointments().filter(appointment => !appointment.isCancelled).length
  );

  /** Initiates cancellation flow for a given appointment. */
  cancelAppointment(appointment: Appointment): void {
    this.store.selectAppointment(appointment);
    this.router.navigate(['/dermatology/cancel-appointment']);
  }

  /** Navigates to the virtual call screen. */
  joinCall(): void {
    this.router.navigate(['/dermatology/virtual-call']);
  }

  /** Navigates back to the consult home screen. */
  navigateBack(): void {
    this.router.navigate(['/dermatology']);
  }
}
