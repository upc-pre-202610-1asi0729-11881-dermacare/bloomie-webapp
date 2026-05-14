import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a daily tracking entry returned by the API.
 */
export interface DailyTrackingResource extends BaseResource {
  /** Unique identifier for the daily tracking record. */
  id:         number;
  /** Identifier of the routine being tracked. */
  routine_id: number;
  /** Identifier of the user who owns this tracking record. */
  user_id:    number;
  /** ISO 8601 date string for this tracking entry (e.g. '2026-05-11'). */
  date:       string;
  /** Completion status of the routine on this day. */
  status:     string;
}

/**
 * Response envelope for daily tracking collection queries.
 */
export interface DailyTrackingsResponse extends BaseResponse {
  /** The list of daily tracking records returned by the API. */
  daily_trackings: DailyTrackingResource[];
}
