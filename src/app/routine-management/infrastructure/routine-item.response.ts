import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a routine item as embedded in a RoutineResource.
 * Fields are camelCase as serialized by Java records with Jackson defaults.
 */
export interface RoutineItemResource extends BaseResource {
  id:                    number;
  step:                  string;
  order:                 number;
  scheduledTime:         string;
  productRecommendation: string;
}

/**
 * Response envelope kept for BaseApiEndpoint generic compatibility.
 */
export interface RoutineItemsResponse extends BaseResponse {
  routine_items: RoutineItemResource[];
}
