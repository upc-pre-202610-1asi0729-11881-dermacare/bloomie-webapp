import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';

/**
 * Shows the full clinical summary of a consultation from the dermatologist's perspective,
 * with notes, recommendations, and clinical photos.
 */
@Component({
  selector:    'app-derm-consultation-summary',
  imports:     [MatIconModule, TranslatePipe],
  templateUrl: './derm-consultation-summary.html',
  styleUrl:    './derm-consultation-summary.css',
})
export class DermConsultationSummary {
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  /** Navigates back to past consultations. */
  navigateBack(): void {
    this.router.navigate(['/derm/past-consultations']);
  }
}
