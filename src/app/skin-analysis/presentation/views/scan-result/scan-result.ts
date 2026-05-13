import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SkinAnalysisStore } from '../../../application/skin-analysis.store';

/**
 * Displays the results of the latest completed facial scan,
 * including individual metric scores and the AI diagnosis.
 * Allows the user to save the report and return to the home screen.
 */
@Component({
  selector: 'app-scan-result',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './scan-result.html',
  styleUrl: './scan-result.css',
})
export class ScanResult {
  readonly store = inject(SkinAnalysisStore);
  protected router = inject(Router);

  /**
   * Saves the current scan report and navigates back to the skin scan home screen.
   * In a real implementation this would trigger a download or persistence action.
   */
  onSaveAndDone(): void {
    this.router.navigate(['/skin-analysis']);
  }

  /** Navigates back to the skin scan home screen without saving. */
  navigateBack(): void {
    this.router.navigate(['/skin-analysis']);
  }
}
