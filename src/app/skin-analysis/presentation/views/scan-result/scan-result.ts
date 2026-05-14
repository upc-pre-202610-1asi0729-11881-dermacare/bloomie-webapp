import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SkinAnalysisStore } from '../../../application/skin-analysis.store';
import { FacialScan, FacialScanStatus } from '../../../domain/model/facial-scan.entity';

/**
 * Displays the results of the most recent facial scan,
 * including individual metric scores and the AI-generated diagnosis.
 *
 * On initialization, automatically marks the current in-progress scan as COMPLETED
 * and fills it with mock AI-generated scores so it appears in Past Analyses.
 *
 * Note: in production, the backend would return the completed scan with real scores.
 * The mock scores here simulate what the API would return.
 */
@Component({
  selector: 'app-scan-result',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './scan-result.html',
  styleUrl: './scan-result.css',
})
export class ScanResult implements OnInit {
  readonly store = inject(SkinAnalysisStore);
  protected router = inject(Router);

  /**
   * Marks the current in-progress scan as COMPLETED when this screen loads.
   * Assigns mock AI scores to simulate a real analysis response.
   * Without this, the scan is never saved as completed and won't appear in Past Analyses.
   */
  ngOnInit(): void {
    const currentScan = this.store.currentScan();
    if (currentScan && currentScan.status === FacialScanStatus.InProgress) {
      const completedScan = new FacialScan({
        id: currentScan.id,
        userId: currentScan.userId,
        skinProfileId: currentScan.skinProfileId,
        imageUrl: currentScan.imageUrl,
        diagnosis: this.generateMockDiagnosis(),
        overallScore: this.randomScore(65, 90),
        hydrationScore: this.randomScore(60, 85),
        textureScore: this.randomScore(60, 85),
        sensitivityScore: this.randomScore(55, 80),
        brightnessScore: this.randomScore(65, 90),
        scannedAt: new Date().toISOString(),
        status: FacialScanStatus.Completed,
      });

      this.store.updateFacialScan(completedScan);
    }
  }

  /**
   * Navigates back to the skin scan home screen after the user finishes reviewing.
   * The scan was already saved in ngOnInit, so no additional persistence is needed here.
   */
  onSaveAndDone(): void {
    this.router.navigate(['/skin-analysis']);
  }

  /** Navigates back to the skin scan home screen without any additional action. */
  navigateBack(): void {
    this.router.navigate(['/skin-analysis']);
  }

  /**
   * Generates a random integer score within the given inclusive range.
   * @param min - Minimum score value.
   * @param max - Maximum score value.
   * @returns Random integer between min and max.
   */
  private randomScore(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Returns a mock AI diagnosis string for demonstration purposes.
   * In production, this would come from the backend analysis response.
   * @returns A realistic-sounding skin analysis summary.
   */
  private generateMockDiagnosis(): string {
    const diagnoses = [
      'Skin shows mild oiliness with some uneven texture. Hydration levels are adequate. Recommend maintaining current routine with added SPF protection.',
      'Noticeable improvement in hydration levels. Minor sensitivity detected around cheek area. Continue with gentle, fragrance-free products.',
      'Skin texture is smooth with good brightness scores. Some dryness detected near the T-zone. Consider adding a hyaluronic acid serum.',
      'Overall healthy skin profile. Slight sensitivity detected. Recommend introducing calming ingredients like niacinamide and ceramides.',
    ];
    return diagnoses[Math.floor(Math.random() * diagnoses.length)];
  }
}
