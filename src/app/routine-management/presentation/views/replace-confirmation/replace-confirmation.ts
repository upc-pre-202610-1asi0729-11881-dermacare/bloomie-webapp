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

  /** The new product name received via query params. */
  readonly newProductName = computed(() =>
    this.route.snapshot.queryParamMap.get('newProductName') ?? null,
  );

  /** The product index received via query params, used to compute the simulated score. */
  private readonly productIndex = computed(() => {
    const paramValue = this.route.snapshot.queryParamMap.get('productIndex');
    return paramValue ? Number(paramValue) : 0;
  });

  /** The routine item being replaced, looked up from the active routine items. */
  readonly routineItem = computed(() => {
    const itemId = this.routineItemId();
    if (!itemId) return undefined;
    return this.store.getRoutineItemById(itemId)();
  });

  /**
   * Simulated compatibility score for the selected replacement product.
   * Based on the option's position in the recommendations list (index 0 = best match).
   */
  readonly compatibilityScore = computed(() => {
    return Math.max(85, 95 - this.productIndex() * 3);
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
    const productName = this.newProductName();
    if (!itemId || !productName) return;
    this.store.replaceProduct(itemId, productName);
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
