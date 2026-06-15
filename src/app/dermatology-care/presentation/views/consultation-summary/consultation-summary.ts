import {Component, computed, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';

/**
 * Shows the clinical summary of a completed patient consultation,
 * including diagnosis, recommendations, and uploaded clinical photos.
 */
@Component({
  selector:    'app-consultation-summary',
  imports:     [MatIconModule, TranslatePipe],
  templateUrl: './consultation-summary.html',
  styleUrl:    './consultation-summary.css',
})
export class ConsultationSummary {
  readonly store             = inject(DermatologyCareStore);
  protected router           = inject(Router);
  private readonly translate = inject(TranslateService);

  /** Specialty of the dermatologist linked to the selected consultation. */
  readonly doctorLabel = computed((): string => {
    const consultation = this.store.selectedConsultation();
    if (!consultation) return '';
    const profile = this.store.dermatologistProfiles().find(
      p => p.userId === consultation.dermatologistId || p.id === consultation.dermatologistId,
    );
    return profile?.specialty ?? this.translate.instant('dermatology.consultationSummary.doctorLabel');
  });

  /** Navigates back to the select consultation screen. */
  navigateBack(): void {
    this.router.navigate(['/dermatology/select-consultation']);
  }
}
