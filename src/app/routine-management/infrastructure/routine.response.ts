import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { RoutineItemResource } from './routine-item.response';

/**
 * Resource representation of a routine returned by the backend API.
 * Fields are camelCase as serialized by Java records with Jackson defaults.
 */
export interface RoutineResource extends BaseResource {
  id:            number;
  patientId:     number;
  skinAnalysisId: number;
  status:        string;
  createdAt:     string;
  items:         RoutineItemResource[];
}

/**
 * Response envelope kept for BaseApiEndpoint generic compatibility.
 * The backend returns a single RoutineResource, not a collection envelope.
 */
export interface RoutinesResponse extends BaseResponse {
  routines: RoutineResource[];
}
