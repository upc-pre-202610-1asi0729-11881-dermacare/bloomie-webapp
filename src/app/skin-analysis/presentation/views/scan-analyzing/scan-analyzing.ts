import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Simulates the AI skin analysis progress while the scan is being processed.
 * Automatically navigates to the result screen upon completion.
 */
@Component({
  selector: 'app-scan-analyzing',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './scan-analyzing.html',
  styleUrl: './scan-analyzing.css',
})
export class ScanAnalyzing implements OnInit {
  protected router = inject(Router);

  /** Current analysis progress percentage from 0 to 100. */
  readonly progress = signal<number>(0);

  /**
   * Starts the progress simulation on component initialization.
   * Increments by 2% every 80ms until reaching 100%, then navigates to results.
   */
  ngOnInit(): void {
    const intervalId = setInterval(() => {
      const current = this.progress();
      if (current >= 100) {
        clearInterval(intervalId);
        this.router.navigate(['/skin-analysis/result']);
        return;
      }
      this.progress.set(current + 2);
    }, 80);
  }

  /** Cancels the analysis and navigates back to the home screen. */
  navigateBack(): void {
    this.router.navigate(['/skin-analysis']);
  }
}
