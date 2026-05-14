import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Displays the scan processing state.
 * Shows a success flow to continue or a failure state with a retry option.
 */
@Component({
  selector: 'app-scan-progress',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './scan-progress.html',
  styleUrl: './scan-progress.css',
})
export class ScanProgress {
  protected router = inject(Router);

  /** Whether the scan processing has failed. */
  readonly hasFailed = signal<boolean>(false);

  /** Navigates forward to the analyzing screen. */
  onContinue(): void {
    this.router.navigate(['/skin-analysis/analyzing']);
  }

  /** Resets the failed state and navigates back to the prepare screen. */
  onRetry(): void {
    this.hasFailed.set(false);
    this.router.navigate(['/skin-analysis/prepare']);
  }

  /** Navigates back to the prepare screen. */
  navigateBack(): void {
    this.router.navigate(['/skin-analysis/prepare']);
  }
}
