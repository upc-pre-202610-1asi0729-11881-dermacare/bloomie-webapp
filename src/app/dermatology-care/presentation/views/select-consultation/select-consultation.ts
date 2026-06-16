import {Component, effect, inject, signal, untracked} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {take} from 'rxjs';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {Consultation, ConsultationStatus} from '../../../domain/model/consultation.entity';
import {IamStore} from '../../../../iam/application/iam.store';

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
  readonly store        = inject(DermatologyCareStore);
  private readonly iamStore = inject(IamStore);
  protected router      = inject(Router);

  readonly ConsultationStatus = ConsultationStatus;

  /** Maps dermatologist userId → photo URL. */
  protected readonly userPhotoMap = signal<Record<number, string | null>>({});

  constructor() {
    effect(() => {
      const consultations = this.store.consultations();
      const profiles      = this.store.dermatologistProfiles();
      const loaded        = untracked(() => this.userPhotoMap());

      consultations.forEach(c => {
        const profile = profiles.find(p => p.id === c.dermatologistId || p.userId === c.dermatologistId);
        const userId  = profile?.userId;
        if (userId !== undefined && !(userId in loaded)) {
          this.userPhotoMap.update(m => ({...m, [userId]: null}));
          this.iamStore.getUserById(userId)
            .pipe(take(1))
            .subscribe({
              next: user => this.userPhotoMap.update(m => ({...m, [userId]: user.photoUrl ?? null})),
              error: () => {},
            });
        }
      });
    }, { allowSignalWrites: true });
  }

  protected dermPhotoForConsultation(consultation: Consultation): string | null {
    const profile = this.store.dermatologistProfiles().find(
      p => p.id === consultation.dermatologistId || p.userId === consultation.dermatologistId
    );
    const userId = profile?.userId;
    return userId !== undefined ? (this.userPhotoMap()[userId] ?? null) : null;
  }

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
