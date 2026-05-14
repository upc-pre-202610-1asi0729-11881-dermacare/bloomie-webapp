import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {FavoriteProduct} from '../domain/model/favorite-product.entity';
import {FavoriteProductResource, FavoriteProductsResponse} from './favorite-product.response';

/**
 * Maps FavoriteProduct entities to and from API resources.
 */
export class FavoriteProductAssembler implements BaseAssembler<FavoriteProduct, FavoriteProductResource, FavoriteProductsResponse> {

  /**
   * Converts a FavoriteProductsResponse to an array of FavoriteProduct entities.
   * @param response - The API response containing favorite product records.
   * @returns An array of FavoriteProduct entities.
   */
  toEntitiesFromResponse(response: FavoriteProductsResponse): FavoriteProduct[] {
    return response.favorite_products.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a FavoriteProductResource to a FavoriteProduct entity.
   * @param resource - The resource to convert.
   * @returns The converted FavoriteProduct entity.
   */
  toEntityFromResource(resource: FavoriteProductResource): FavoriteProduct {
    return new FavoriteProduct({
      id:        resource.id,
      userId:    resource.user_id,
      productId: resource.product_id,
      savedAt:   resource.saved_at,
    });
  }

  /**
   * Converts a FavoriteProduct entity to a FavoriteProductResource.
   * @param entity - The entity to convert.
   * @returns The converted FavoriteProductResource.
   */
  toResourceFromEntity(entity: FavoriteProduct): FavoriteProductResource {
    return {
      id:         entity.id,
      user_id:    entity.userId,
      product_id: entity.productId,
      saved_at:   entity.savedAt,
    } as FavoriteProductResource;
  }
}
