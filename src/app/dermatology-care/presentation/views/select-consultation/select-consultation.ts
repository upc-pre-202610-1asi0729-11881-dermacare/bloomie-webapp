import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {Consultation, ConsultationStatus} from '../../../domain/model/consultation.entity';

/**
 * Lists past and pending consultations for the patient to review.
 */
@Component({
  selector:    'app-select-consultation',
  imports:     [MatIconModule, TranslatePipe],
  templateUrl: './select-consultation.html',
  styleUrl:    './select-consultation.css',
})
export class SelectConsultation {
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  readonly ConsultationStatus = ConsultationStatus;

  /** Navigates to the consultation summary for the selected consultation. */
  selectConsultation(consultation: Consultation): void {
    this.store.selectConsultation(consultation);
    this.router.navigate(['/dermatology/consultation-summary']);
  }

  /** Returns the action button translation key based on consultation status. */
  getActionKey(consultation: Consultation): string {
    if (consultation.status === ConsultationStatus.Cancelled) return 'dermatology.selectConsultation.rebook';
    return 'dermatology.selectConsultation.viewDetails';
  }

  /** Navigates back to the consult home screen. */
  navigateBack(): void {
    this.router.navigate(['/dermatology']);
  }
}
