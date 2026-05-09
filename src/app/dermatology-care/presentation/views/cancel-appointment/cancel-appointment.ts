import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';

/** Steps in the cancellation flow. */
export type CancellationStep = 'reason' | 'confirmed';

/**
 * Guides the patient through selecting a cancellation reason
 * and confirming the appointment cancellation.
 */
@Component({
  selector:    'app-cancel-appointment',
  imports:     [MatIconModule, TranslatePipe],
  templateUrl: './cancel-appointment.html',
  styleUrl:    './cancel-appointment.css',
})
export class CancelAppointment {
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  step           = signal<CancellationStep>('reason');
  selectedReason = signal<string | null>(null);

  /** Available cancellation reason translation keys. */
  readonly reasons: string[] = [
    'dermatology.cancelAppointment.reason.scheduleConflict',
    'dermatology.cancelAppointment.reason.foundOther',
    'dermatology.cancelAppointment.reason.platformIssue',
    'dermatology.cancelAppointment.reason.mistakenBooking',
    'dermatology.cancelAppointment.reason.noLongerNeeded',
    'dermatology.cancelAppointment.reason.other',
  ];

  /** Selects a cancellation reason. */
  selectReason(reason: string): void {
    this.selectedReason.set(reason);
  }

  /**
   * Confirms the cancellation and updates the appointment in the store.
   * Determines refund eligibility based on the appointment's isEligibleForRefund property.
   */
  confirmCancellation(): void {
    const appointment = this.store.selectedAppointment();
    if (!appointment || !this.selectedReason()) return;
    appointment.cancellationReason = this.selectedReason()!;
    this.store.cancelAppointment(appointment);
    this.step.set('confirmed');
  }

  /** Navigates to the select doctor screen to book a new appointment. */
  bookNewAppointment(): void {
    this.router.navigate(['/dermatology/select-doctor']);
  }

  /** Navigates back to the scheduled appointments screen. */
  navigateBack(): void {
    this.router.navigate(['/dermatology/scheduled-appointments']);
  }
}
