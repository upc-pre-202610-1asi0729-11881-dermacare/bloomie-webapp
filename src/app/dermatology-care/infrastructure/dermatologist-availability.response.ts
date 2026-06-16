import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a dermatologist availability slot returned by the backend API.
 */
export interface DermatologistAvailabilityResource extends BaseResource {
  id:              number;
  dermatologistId: number;
  day:             string;
  startTime:       string;
  endTime:         string;
  active:          boolean;
}

/**
 * Response envelope kept for BaseAssembler type-param compatibility.
 * The backend returns a plain array, so this interface is not used at runtime.
 */
export interface DermatologistAvailabilitiesResponse extends BaseResponse {
  dermatologist_availabilities: DermatologistAvailabilityResource[];
}
