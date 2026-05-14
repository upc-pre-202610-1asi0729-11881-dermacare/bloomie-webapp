import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Product, ProductCategory} from '../domain/model/product.entity';
import {ProductResource, ProductsResponse} from './product.response';

/**
 * Maps Product entities to and from API resources.
 */
export class ProductAssembler implements BaseAssembler<Product, ProductResource, ProductsResponse> {

  /**
   * Converts a ProductsResponse to an array of Product entities.
   * @param response - The API response containing products.
   * @returns An array of Product entities.
   */
  toEntitiesFromResponse(response: ProductsResponse): Product[] {
    return response.products.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a ProductResource to a Product entity.
   * @param resource - The resource to convert.
   * @returns The converted Product entity.
   */
  toEntityFromResource(resource: ProductResource): Product {
    return new Product({
      id:              resource.id,
      name:            resource.name,
      brand:           resource.brand,
      category:        resource.category as ProductCategory,
      description:     resource.description,
      benefits:        resource.benefits,
      isAiRecommended: resource.is_ai_recommended,
    });
  }

  /**
   * Converts a Product entity to a ProductResource.
   * @param entity - The entity to convert.
   * @returns The converted ProductResource.
   */
  toResourceFromEntity(entity: Product): ProductResource {
    return {
      id:                entity.id,
      name:              entity.name,
      brand:             entity.brand,
      category:          entity.category,
      description:       entity.description,
      benefits:          entity.benefits,
      is_ai_recommended: entity.isAiRecommended,
    } as ProductResource;
  }
}
