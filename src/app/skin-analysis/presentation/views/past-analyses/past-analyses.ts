import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SkinAnalysisStore } from '../../../application/skin-analysis.store';
import { FacialScan } from '../../../domain/model/facial-scan.entity';

/**
 * Displays the list of all past facial scans performed by the user.
 */
@Component({
  selector: 'app-past-analyses',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './past-analyses.html',
  styleUrl: './past-analyses.css',
})
export class PastAnalyses {
  readonly store = inject(SkinAnalysisStore);
  protected router = inject(Router);

  /** Selects a scan as current and navigates to the result screen. */
  onViewAnalysis(scan: FacialScan): void {
    this.store.selectCurrentScan(scan);
    this.router.navigate(['/skin-analysis/result']);
  }

  /** Navigates back to the skin scan home screen. */
  navigateBack(): void {
    this.router.navigate(['/skin-analysis']);
  }
}
