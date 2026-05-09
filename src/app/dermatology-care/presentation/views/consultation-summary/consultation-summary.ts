import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
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
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  /** Navigates back to the select consultation screen. */
  navigateBack(): void {
    this.router.navigate(['/dermatology/select-consultation']);
  }
}
