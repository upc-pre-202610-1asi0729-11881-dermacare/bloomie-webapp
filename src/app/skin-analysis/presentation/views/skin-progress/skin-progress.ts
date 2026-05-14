import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SkinAnalysisStore } from '../../../application/skin-analysis.store';

/**
 * Displays skin progress metrics over time, including streak,
 * adherence rate, current score, and improvement since the first scan.
 */
@Component({
  selector: 'app-skin-progress',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './skin-progress.html',
  styleUrl: './skin-progress.css',
})
export class SkinProgress {
  readonly store = inject(SkinAnalysisStore);
  protected router = inject(Router);

  /** Returns true when there is at least one completed scan to display. */
  get hasData(): boolean {
    return this.store.completedScanCount() > 0;
  }

  /** Navigates to the routine management section. */
  onNavigateToRoutine(): void {
    this.router.navigate(['/routine']);
  }

  /** Navigates back to the skin scan home screen. */
  navigateBack(): void {
    this.router.navigate(['/skin-analysis']);
  }
}
