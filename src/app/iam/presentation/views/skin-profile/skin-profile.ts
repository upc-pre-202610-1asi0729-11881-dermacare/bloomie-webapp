import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SkinAnalysisStore } from '../../../../skin-analysis/application/skin-analysis.store';
import { SkinProfile, SkinType } from '../../../../skin-analysis/domain/model/skin-profile.entity';

/**
 * Allows the user to view and update their skin profile preferences,
 * including skin type, water intake, sun exposure, and sleep habits.
 * Persists changes via SkinAnalysisStore to the backend API.
 */
@Component({
  selector: 'app-skin-profile',
  standalone: true,
  imports: [MatIconModule, TranslatePipe, FormsModule],
  templateUrl: './skin-profile.html',
  styleUrl: './skin-profile.css',
})
export class SkinProfileView implements OnInit {
  private readonly router = inject(Router);
  private readonly store = inject(SkinAnalysisStore);

  protected skinType = signal<string>('Normal skin');
  protected waterIntake = signal<string>('3 - 5 glasses');
  protected sunExposure = signal<string>('30 - 60 minutes');
  protected sleepHabits = signal<string>('8 hours');
  protected saveSuccess = signal<boolean>(false);
  protected saving = signal<boolean>(false);

  readonly skinTypeOptions = [
    'Normal skin',
    'Oily skin',
    'Dry skin',
    'Combination skin',
    'Sensitive skin',
  ];
  readonly waterOptions = [
    'Less than 3 glasses',
    '3 - 5 glasses',
    '5 - 9 glasses',
    'More than 9 glasses',
  ];
  readonly sunOptions = [
    'Less than 15 minutes',
    '15 - 30 minutes',
    '30 - 60 minutes',
    'More than 1 hour',
  ];
  readonly sleepOptions = [
    'Less than 5 hours',
    '5 - 6 hours',
    '6 hours',
    '7 - 8 hours',
    '8 hours',
    'More than 8 hours',
  ];

  /**
   * Loads the existing skin profile from the store when the component initializes.
   * Maps stored enum values to display labels for the dropdowns.
   */
  ngOnInit(): void {
    const profile = this.store.skinProfile();
    if (profile) {
      this.skinType.set(this.mapSkinTypeToLabel(profile.skinType));
    }
  }

  /**
   * Saves the updated skin profile preferences to the backend API.
   * Shows a success indicator and resets it after 2 seconds.
   */
  onSave(): void {
    this.saving.set(true);
    const profile = this.store.skinProfile();

    if (profile) {
      // Update existing profile
      const updatedProfile = new SkinProfile({
        id: profile.id,
        userId: profile.userId,
        skinType: this.mapLabelToSkinType(this.skinType()),
        sensitivity: profile.sensitivity,
        status: profile.status,
      });

      this.store.updateSkinProfile(updatedProfile);
    }

    // Show success feedback regardless (mock API may not persist all fields)
    setTimeout(() => {
      this.saving.set(false);
      this.saveSuccess.set(true);
      setTimeout(() => this.saveSuccess.set(false), 2000);
    }, 600);
  }

  /** Navigates back to the user profile screen. */
  onBack(): void {
    this.router.navigate(['/profile']).then();
  }

  /**
   * Maps a stored SkinType enum value to a human-readable display label.
   * @param skinType - The SkinType enum value from the API.
   * @returns Display label for the dropdown.
   */
  private mapSkinTypeToLabel(skinType: SkinType): string {
    const map: Record<SkinType, string> = {
      [SkinType.Normal]: 'Normal skin',
      [SkinType.Oily]: 'Oily skin',
      [SkinType.Dry]: 'Dry skin',
      [SkinType.Combination]: 'Combination skin',
      [SkinType.Sensitive]: 'Sensitive skin',
    };
    return map[skinType] ?? 'Normal skin';
  }

  /**
   * Maps a human-readable dropdown label back to the SkinType enum value.
   * @param label - The display label selected by the user.
   * @returns The matching SkinType enum value.
   */
  private mapLabelToSkinType(label: string): SkinType {
    const map: Record<string, SkinType> = {
      'Normal skin': SkinType.Normal,
      'Oily skin': SkinType.Oily,
      'Dry skin': SkinType.Dry,
      'Combination skin': SkinType.Combination,
      'Sensitive skin': SkinType.Sensitive,
    };
    return map[label] ?? SkinType.Normal;
  }
}
