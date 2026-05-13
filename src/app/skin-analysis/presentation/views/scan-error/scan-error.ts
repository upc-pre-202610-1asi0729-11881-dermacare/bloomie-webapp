import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Displays an error screen when the skin analysis process has failed.
 * Offers options to retry or contact support.
 */
@Component({
  selector: 'app-scan-error',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './scan-error.html',
  styleUrl: './scan-error.css',
})
export class ScanError {
  protected router = inject(Router);

  /** Navigates back to the prepare screen to attempt the scan again. */
  onRetry(): void {
    this.router.navigate(['/skin-analysis/prepare']);
  }

  /** Navigates back to the skin scan home screen. */
  navigateBack(): void {
    this.router.navigate(['/skin-analysis']);
  }
}
