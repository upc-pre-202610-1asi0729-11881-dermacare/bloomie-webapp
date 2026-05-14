import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RoutineManagementStore } from '../../../application/routine-management.store';

/**
 * Shows the comparison between the current and new product,
 * and asks the user to confirm or cancel the replacement.
 */
@Component({
  selector: 'app-replace-confirmation',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './replace-confirmation.html',
  styleUrl: './replace-confirmation.css',
})
export class ReplaceConfirmation {
  readonly store = inject(RoutineManagementStore);
  protected router = inject(Router);
  private route = inject(ActivatedRoute);

  /** The routine item ID received via query params. */
  readonly routineItemId = computed(() => {
    const paramValue = this.route.snapshot.queryParamMap.get('routineItemId');
    return paramValue ? Number(paramValue) : null;
  });

  /** The new product ID received via query params. */
  readonly newProductId = computed(() => {
    const paramValue = this.route.snapshot.queryParamMap.get('newProductId');
    return paramValue ? Number(paramValue) : null;
  });

  /** The routine item being replaced, looked up from the store. */
  readonly routineItem = computed(() => {
    const itemId = this.routineItemId();
    if (!itemId) return undefined;
    return this.store.getRoutineItemById(itemId)();
  });

  /**
   * The simulated compatibility score for the new product.
   * In production this value would come from the product-discovery bounded context.
   * Score is computed as 95 minus 3 points per product index offset.
   */
  readonly compatibilityScore = computed(() => {
    const productId = this.newProductId();
    if (!productId) return 0;
    return Math.max(85, 95 - (productId - 1) * 3);
  });

  /**
   * Returns the CSS color for the current compatibility score.
   * Scores >= 90 → green, >= 80 → amber, < 80 → red.
   */
  readonly compatibilityColor = computed(() => {
    const score = this.compatibilityScore();
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#e8a43a';
    return '#ef5350';
  });

  /**
   * Returns the compatibility level key for translation.
   * Used to display the compatibility label via i18n.
   */
  readonly compatibilityLevelKey = computed(() => {
    const score = this.compatibilityScore();
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    return 'fair';
  });

  /**
   * Confirms the product replacement by delegating to the store
   * and navigates back to the routine product list.
   */
  confirmReplacement(): void {
    const itemId = this.routineItemId();
    const productId = this.newProductId();
    if (!itemId || !productId) return;
    this.store.replaceProduct(itemId, productId);
    this.router.navigate(['/routine']);
  }

  /** Navigates back to the product replacement selection view. */
  navigateBack(): void {
    const itemId = this.routineItemId();
    this.router.navigate(['/routine/product-replacement'], {
      queryParams: { routineItemId: itemId },
    });
  }
}
