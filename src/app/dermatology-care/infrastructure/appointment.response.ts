import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an appointment returned by the API.
 */
export interface AppointmentResource extends BaseResource {
  /** Unique identifier for the appointment. */
  id:                  number;
  /** Identifier of the patient who booked the appointment. */
  patient_id:          number;
  /** Identifier of the dermatologist assigned to the appointment. */
  dermatologist_id:    number;
  /** Identifier of the payment associated with this appointment. */
  payment_id:          number;
  /** ISO 8601 date-time string for when the appointment is scheduled. */
  scheduled_at:        string;
  /** Current lifecycle status of the appointment. */
  status:              string;
  /** Reason provided when the appointment was cancelled, empty otherwise. */
  cancellation_reason: string;
}

/**
 * Response envelope for appointment collection queries.
 */
export interface AppointmentsResponse extends BaseResponse {
  /** The list of appointments returned by the API. */
  appointments: AppointmentResource[];
}
