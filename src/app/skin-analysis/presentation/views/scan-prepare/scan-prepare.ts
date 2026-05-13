import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Guides the user through preparation tips before starting a facial scan.
 * Allows uploading a photo or proceeding directly to the scan flow.
 */
@Component({
  selector: 'app-scan-prepare',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './scan-prepare.html',
  styleUrl: './scan-prepare.css',
})
export class ScanPrepare {
  protected router = inject(Router);

  /** URL of the uploaded photo, or null if none has been uploaded. */
  readonly uploadedPhotoUrl = signal<string | null>(null);

  /** i18n keys for each preparation tip shown in the list. */
  readonly tipKeys: string[] = [
    'skinAnalysis.scanPrepare.tip1',
    'skinAnalysis.scanPrepare.tip2',
    'skinAnalysis.scanPrepare.tip3',
    'skinAnalysis.scanPrepare.tip4',
  ];

  /** Handles a photo file upload and creates a local object URL for preview. */
  onUploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.uploadedPhotoUrl.set(URL.createObjectURL(file));
  }

  /** Navigates to the scan progress screen to begin processing. */
  onStartScan(): void {
    this.router.navigate(['/skin-analysis/progress']);
  }

  /** Navigates back to the skin scan home screen. */
  navigateBack(): void {
    this.router.navigate(['/skin-analysis']);
  }
}
