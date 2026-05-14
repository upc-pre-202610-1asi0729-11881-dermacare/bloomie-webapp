import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a product compatibility evaluation returned by the API.
 */
export interface ProductCompatibilityResource extends BaseResource {
  /** Unique identifier for the compatibility record. */
  id:                  number;
  /** Identifier of the product being evaluated. */
  product_id:          number;
  /** Identifier of the facial scan used in the evaluation. */
  facial_scan_id:      number;
  /** Identifier of the skin profile this evaluation belongs to. */
  skin_profile_id:     number;
  /** Numeric score from 0 to 100 representing compatibility with the skin profile. */
  compatibility_score: number;
  /** AI-generated explanation of the compatibility result. */
  explanation:         string;
  /** ISO 8601 date-time string for when the evaluation was performed. */
  evaluated_at:        string;
}

/**
 * Response envelope for product compatibility collection queries.
 */
export interface ProductCompatibilitiesResponse extends BaseResponse {
  /** The list of product compatibility records returned by the API. */
  product_compatibilities: ProductCompatibilityResource[];
}
