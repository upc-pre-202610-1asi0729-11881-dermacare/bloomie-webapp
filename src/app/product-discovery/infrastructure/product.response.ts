import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a skincare product returned by the API.
 */
export interface ProductResource extends BaseResource {
  /** Unique identifier for the product. */
  id:               number;
  /** Display name of the product. */
  name:             string;
  /** Brand that manufactures the product. */
  brand:            string;
  /** Skincare category the product belongs to (e.g. CLEANSER, SERUM). */
  category:         string;
  /** Detailed description of the product and its purpose. */
  description:      string;
  /** List of key benefits provided by the product. */
  benefits:         string[];
  /** Whether this product has been flagged as AI-recommended. */
  is_ai_recommended: boolean;
}

/**
 * Response envelope for product collection queries.
 */
export interface ProductsResponse extends BaseResponse {
  /** The list of products returned by the API. */
  products: ProductResource[];
}
