import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an appointment returned by the API.
 */
export interface AppointmentResource extends BaseResource {
  id:                   number;
  // snake_case (mock API)
  patient_id?:          number;
  dermatologist_id?:    number;
  payment_id?:          number;
  scheduled_at?:        string;
  status:               string;
  cancellation_reason?: string;
  // camelCase (real backend)
  patientId?:           number;
  dermatologistId?:     number;
  paymentId?:           number;
  scheduledAt?:         string;
  cancellationReason?:  string;
}

/**
 * Response envelope for appointment collection queries.
 */
export interface AppointmentsResponse extends BaseResponse {
  /** The list of appointments returned by the API. */
  appointments: AppointmentResource[];
}
