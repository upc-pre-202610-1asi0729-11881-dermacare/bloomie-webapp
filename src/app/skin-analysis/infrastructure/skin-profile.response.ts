import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a skin profile returned by the API.
 */
export interface SkinProfileResource extends BaseResource {
  /** Unique identifier for the skin profile. */
  id: number;
  /** Identifier of the user who owns this skin profile. */
  user_id: number;
  /** Classified skin type for the user. */
  skin_type: string;
  /** Sensitivity level of the user's skin. */
  sensitivity: string;
  /** Current lifecycle status of the skin profile. */
  status: string;
}

/**
 * Response envelope for skin profile collection queries.
 */
export interface SkinProfilesResponse extends BaseResponse {
  /** The list of skin profiles returned by the API. */
  skin_profiles: SkinProfileResource[];
}
