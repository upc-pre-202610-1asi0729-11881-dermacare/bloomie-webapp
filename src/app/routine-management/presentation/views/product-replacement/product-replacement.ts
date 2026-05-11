import { Component, computed, inject, signal } from '@angular/core';
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
export class ProductReplacement {
  readonly store = inject(RoutineManagementStore);
  protected router = inject(Router);
  private route = inject(ActivatedRoute);

  /** The ID of the selected replacement product, or null if none chosen. */
  selectedProductId = signal<number | null>(null);

  /** The routine item ID received via query params. */
  readonly routineItemId = computed(() => {
    const paramValue = this.route.snapshot.queryParamMap.get('routineItemId');
    return paramValue ? Number(paramValue) : null;
  });

  /** The routine item being replaced, looked up from the store. */
  readonly routineItem = computed(() => {
    const itemId = this.routineItemId();
    if (!itemId) return undefined;
    return this.store.getRoutineItemById(itemId)();
  });

  /**
   * Returns the compatibility label for a given compatibility score.
   * Scores >= 90 are Excellent, >= 80 are Good, below 80 are Fair.
   * @param compatibilityScore - A number between 0 and 100.
   * @returns A translated key suffix for the compatibility label.
   */
  readonly getCompatibilityLabel = (compatibilityScore: number): string => {
    if (compatibilityScore >= 90) return 'excellent';
    if (compatibilityScore >= 80) return 'good';
    return 'fair';
  };

  /**
   * Returns the CSS color for a given compatibility score.
   * @param compatibilityScore - A number between 0 and 100.
   * @returns A hex color string.
   */
  readonly getCompatibilityColor = (compatibilityScore: number): string => {
    if (compatibilityScore >= 90) return '#4caf50';
    if (compatibilityScore >= 80) return '#e8a43a';
    return '#ef5350';
  };

  /** Selects a product as the candidate replacement. */
  selectProduct(productId: number): void {
    this.selectedProductId.set(productId);
  }

  /**
   * Navigates to the replacement confirmation view with the selected product.
   */
  continueWithSelection(): void {
    const itemId = this.routineItemId();
    const productId = this.selectedProductId();
    if (!itemId || !productId) return;
    this.router.navigate(['/routine/replace-confirmation'], {
      queryParams: { routineItemId: itemId, newProductId: productId },
    });
  }

  /** Navigates back to the routine product list. */
  navigateBack(): void {
    this.router.navigate(['/routine']);
  }
}
