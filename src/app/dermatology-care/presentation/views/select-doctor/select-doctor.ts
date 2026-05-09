import {Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {DermatologyCareStore} from '../../../application/dermatology-care.store';
import {DermatologistProfile} from '../../../domain/model/dermatologist-profile.entity';

/** Price range filter option. */
interface PriceRange {
  labelKey: string;
  min:      number;
  max:      number;
}

/**
 * Displays the list of available dermatologists with search
 * and price filter capabilities.
 */
@Component({
  selector:    'app-select-doctor',
  imports:     [MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, TranslatePipe],
  templateUrl: './select-doctor.html',
  styleUrl:    './select-doctor.css',
})
export class SelectDoctor {
  readonly store    = inject(DermatologyCareStore);
  protected router  = inject(Router);

  searchQuery      = signal<string>('');
  selectedPriceIdx = signal<number>(0);
  showFilterPanel  = signal<boolean>(false);

  /** Available price range filter options. */
  readonly priceRanges: PriceRange[] = [
    { labelKey: 'dermatology.selectDoctor.allPrices', min: 0,  max: Infinity },
    { labelKey: 'dermatology.selectDoctor.under30',   min: 0,  max: 29 },
    { labelKey: 'dermatology.selectDoctor.range3035', min: 30, max: 35 },
    { labelKey: 'dermatology.selectDoctor.over35',    min: 36, max: Infinity },
  ];

  /**
   * Computed list of dermatologists filtered by search query and price range.
   */
  readonly filteredDermatologists = computed(() => {
    const query      = this.searchQuery().toLowerCase();
    const priceRange = this.priceRanges[this.selectedPriceIdx()];
    return this.store.dermatologistProfiles().filter(dermatologist => {
      const matchesSearch = !query || dermatologist.specialty.toLowerCase().includes(query);
      const matchesPrice  = dermatologist.consultationFee >= priceRange.min
        && dermatologist.consultationFee <= priceRange.max;
      return matchesSearch && matchesPrice;
    });
  });

  /** Computed count label for the filtered results. */
  readonly resultCountLabel = computed(() =>
    `${this.filteredDermatologists().length} specialist${this.filteredDermatologists().length !== 1 ? 's' : ''} available`
  );

  /** Selects a dermatologist and navigates to the booking screen. */
  selectDermatologist(dermatologistProfile: DermatologistProfile): void {
    this.store.selectDermatologist(dermatologistProfile);
    this.router.navigate(['/dermatology/book-appointment']);
  }

  /** Applies the selected price range filter. */
  selectPriceRange(index: number): void {
    this.selectedPriceIdx.set(index);
    this.showFilterPanel.set(false);
  }

  /** Clears the active price range filter. */
  clearPriceFilter(): void {
    this.selectedPriceIdx.set(0);
  }

  /** Toggles the filter panel visibility. */
  toggleFilterPanel(): void {
    this.showFilterPanel.update(value => !value);
  }

  /** Navigates back to the consult home screen. */
  navigateBack(): void {
    this.router.navigate(['/dermatology']);
  }
}
