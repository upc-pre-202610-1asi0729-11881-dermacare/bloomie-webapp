import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RoutineManagementStore } from '../../../application/routine-management.store';

/**
 * Displays compatible alternative products for a routine item
 * and allows the user to select a replacement.
 */
@Component({
  selector: 'app-product-replacement',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './product-replacement.html',
  styleUrl: './product-replacement.css',
})
export class ProductReplacement implements OnInit {
  readonly store = inject(RoutineManagementStore);
  protected router = inject(Router);
  private route = inject(ActivatedRoute);

  /** The name of the selected replacement product, or null if none chosen. */
  selectedProductName = signal<string | null>(null);

  /** Simulated compatibility scores for the replacement options (index-aligned). */
  readonly compatibilityScores = [95, 92, 88, 85];

  /** The routine item ID received via query params. */
  readonly routineItemId = computed(() => {
    const paramValue = this.route.snapshot.queryParamMap.get('routineItemId');
    return paramValue ? Number(paramValue) : null;
  });

  /** The routine item being replaced, looked up from the active routine items. */
  readonly routineItem = computed(() => {
    const itemId = this.routineItemId();
    if (!itemId) return undefined;
    return this.store.getRoutineItemById(itemId)();
  });

  ngOnInit(): void {
    const itemId = this.routineItemId();
    if (itemId) {
      this.store.loadReplacementOptions(itemId);
    }
  }

  /**
   * Returns the compatibility score for a given product index.
   */
  getScoreForIndex(index: number): number {
    return this.compatibilityScores[index] ?? 85;
  }

  /**
   * Returns the compatibility label key for a given score.
   */
  readonly getCompatibilityLabel = (score: number): string => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    return 'fair';
  };

  /**
   * Returns the CSS color for a given compatibility score.
   */
  readonly getCompatibilityColor = (score: number): string => {
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#e8a43a';
    return '#ef5350';
  };

  /** Selects a product name as the candidate replacement. */
  selectProduct(productName: string): void {
    this.selectedProductName.set(productName);
  }

  /**
   * Navigates to the replacement confirmation view with the selected product name and its index.
   */
  continueWithSelection(): void {
    const itemId = this.routineItemId();
    const productName = this.selectedProductName();
    if (!itemId || !productName) return;
    const productIndex = this.store.replacementOptions().indexOf(productName);
    this.router.navigate(['/routine/replace-confirmation'], {
      queryParams: { routineItemId: itemId, newProductName: productName, productIndex },
    });
  }

  /** Navigates back to the routine product list. */
  navigateBack(): void {
    this.router.navigate(['/routine']);
  }
}
