import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a daily tracking entry returned by the backend API.
 * Fields are camelCase as serialized by Java records with Jackson defaults.
 */
export interface DailyTrackingResource extends BaseResource {
  id:          number;
  patientId:   number;
  routineId:   number;
  date:        string;
  isCompleted: boolean;
  completedAt: string;
}

/**
 * Response envelope kept for BaseApiEndpoint generic compatibility.
 * The backend returns a plain array, not a collection envelope.
 */
export interface DailyTrackingsResponse extends BaseResponse {
  daily_trackings: DailyTrackingResource[];
}
