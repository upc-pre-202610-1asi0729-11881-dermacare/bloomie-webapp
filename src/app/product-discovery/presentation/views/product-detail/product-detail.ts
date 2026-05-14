import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductDiscoveryStore } from '../../../application/product-discovery.store';
import { FavoriteProduct } from '../../../domain/model/favorite-product.entity';

/**
 * Displays the full detail of a selected skincare product,
 * including AI skin compatibility score, description, and key benefits.
 */
@Component({
  selector: 'app-product-detail',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  readonly store = inject(ProductDiscoveryStore);
  protected router = inject(Router);

  /**
   * Skin profile ID used to look up the compatibility record.
   * In a full implementation this would come from the user session.
   */
  private readonly currentSkinProfileId = 1;

  /**
   * Computed compatibility record for the selected product and skin profile.
   */
  readonly compatibility = computed(() => {
    const product = this.store.selectedProduct();
    if (!product) return undefined;
    return this.store.getCompatibilityForProduct(product.id, this.currentSkinProfileId)();
  });

  /**
   * Computed favorite state for the selected product.
   */
  readonly isFavorite = computed(() => {
    const product = this.store.selectedProduct();
    if (!product) return false;
    return this.store.favorites().some((favorite) => favorite.matchesProduct(product.id));
  });

  /**
   * Toggles the selected product in or out of the favorites list.
   */
  toggleFavorite(): void {
    const product = this.store.selectedProduct();
    if (!product) return;
    const existingFavorite = this.store
      .favorites()
      .find((favorite) => favorite.matchesProduct(product.id));
    if (existingFavorite) {
      this.store.removeFavoriteProduct(existingFavorite.id);
    } else {
      const newFavorite = new FavoriteProduct({
        id: 0,
        userId: 1,
        productId: product.id,
        savedAt: new Date().toISOString(),
      });
      this.store.saveFavoriteProduct(newFavorite);
    }
  }

  /**
   * Navigates back to the trending items list.
   */
  navigateBack(): void {
    this.router.navigate(['/trending']);
  }
}
