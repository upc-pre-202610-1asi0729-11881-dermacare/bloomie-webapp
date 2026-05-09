import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a dermatologist profile returned by the API.
 */
export interface DermatologistProfileResource extends BaseResource {
  /** Unique identifier for the dermatologist profile. */
  id:               number;
  /** Identifier of the linked user account. */
  user_id:          number;
  /** Medical specialty of the dermatologist. */
  specialty:        string;
  /** Fee charged per consultation in USD. */
  consultation_fee: number;
  /** Average patient rating from 0.0 to 5.0. */
  rating:           number;
  /** Number of years in professional practice. */
  years_experience: number;
  /** Total number of patients attended on the platform. */
  patient_count:    number;
  /** Whether the dermatologist is currently accepting appointments. */
  available:        boolean;
}

/**
 * Response envelope for dermatologist profile collection queries.
 */
export interface DermatologistProfilesResponse extends BaseResponse {
  /** The list of dermatologist profiles returned by the API. */
  dermatologist_profiles: DermatologistProfileResource[];
}
