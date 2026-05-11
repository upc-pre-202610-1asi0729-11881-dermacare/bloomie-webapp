import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a routine item returned by the API.
 */
export interface RoutineItemResource extends BaseResource {
  /** Unique identifier for the routine item. */
  id:             number;
  /** Identifier of the routine this item belongs to. */
  routine_id:     number;
  /** Identifier of the product used in this step. */
  product_id:     number;
  /** The skincare step this item corresponds to. */
  step:           string;
  /** Scheduled time of day for applying this product (e.g. '08:00'). */
  scheduled_time: string;
  /** Current application status of this item. */
  status:         string;
  /** Display order of this item within the routine. */
  order:          number;
}

/**
 * Response envelope for routine item collection queries.
 */
export interface RoutineItemsResponse extends BaseResponse {
  /** The list of routine items returned by the API. */
  routine_items: RoutineItemResource[];
}
