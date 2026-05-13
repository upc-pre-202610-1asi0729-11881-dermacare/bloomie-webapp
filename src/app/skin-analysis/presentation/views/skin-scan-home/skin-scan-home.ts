import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SkinAnalysisStore } from '../../../application/skin-analysis.store';

/**
 * Entry point for the skin analysis section.
 * Presents options to start a new scan, view past analyses, or track skin progress.
 */
@Component({
  selector: 'app-skin-scan-home',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './skin-scan-home.html',
  styleUrl: './skin-scan-home.css',
})
export class SkinScanHome {
  readonly store = inject(SkinAnalysisStore);
  protected router = inject(Router);

  /** Cards displayed in the skin scan home section. */
  readonly cards = [
    {
      titleKey: 'skinAnalysis.scanHome.startTitle',
      descKey: 'skinAnalysis.scanHome.startDesc',
      btnKey: 'skinAnalysis.scanHome.startBtn',
      icon: 'face_retouching_natural',
      action: () => this.router.navigate(['/skin-analysis/prepare']),
    },
    {
      titleKey: 'skinAnalysis.scanHome.historyTitle',
      descKey: 'skinAnalysis.scanHome.historyDesc',
      btnKey: 'skinAnalysis.scanHome.historyBtn',
      icon: 'history',
      action: () => this.router.navigate(['/skin-analysis/past-analyses']),
    },
    {
      titleKey: 'skinAnalysis.scanHome.progressTitle',
      descKey: 'skinAnalysis.scanHome.progressDesc',
      btnKey: 'skinAnalysis.scanHome.progressBtn',
      icon: 'trending_up',
      action: () => this.router.navigate(['/skin-analysis/skin-progress']),
    },
  ];

  /** Navigates back to the dashboard. */
  navigateBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
