import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a routine returned by the API.
 */
export interface RoutineResource extends BaseResource {
  /** Unique identifier for the routine. */
  id:              number;
  /** Identifier of the user who owns this routine. */
  user_id:         number;
  /** Identifier of the skin profile associated with this routine. */
  skin_profile_id: number;
  /** Identifier of the facial scan that generated this routine. */
  facial_scan_id:  number;
  /** Current lifecycle status of the routine. */
  status:          string;
  /** ISO 8601 date-time string for when the routine was created. */
  created_at:      string;
}

/**
 * Response envelope for routine collection queries.
 */
export interface RoutinesResponse extends BaseResponse {
  /** The list of routines returned by the API. */
  routines: RoutineResource[];
}
