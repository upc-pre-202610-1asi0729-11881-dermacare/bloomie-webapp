import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a dermatologist availability slot returned by the API.
 */
export interface DermatologistAvailabilityResource extends BaseResource {
  /** Unique identifier for the availability slot. */
  id:               number;
  /** Identifier of the dermatologist who owns this slot. */
  dermatologist_id: number;
  /** Day of the week for this slot (e.g. MONDAY). */
  day_of_week:      string;
  /** Start time of the availability window in HH:mm format. */
  start_time:       string;
  /** End time of the availability window in HH:mm format. */
  end_time:         string;
  /** Duration of each appointment slot in minutes. */
  slot_duration:    number;
}

/**
 * Response envelope for dermatologist availability collection queries.
 */
export interface DermatologistAvailabilitiesResponse extends BaseResponse {
  /** The list of availability slots returned by the API. */
  dermatologist_availabilities: DermatologistAvailabilityResource[];
}
