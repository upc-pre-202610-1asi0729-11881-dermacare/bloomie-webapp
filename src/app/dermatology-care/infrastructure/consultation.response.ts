import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a consultation returned by the API.
 */
export interface ConsultationResource extends BaseResource {
  /** Unique identifier for the consultation. */
  id:                  number;
  /** Identifier of the appointment this consultation belongs to. */
  appointment_id:      number;
  /** Identifier of the patient attending the consultation. */
  patient_id:          number;
  /** Identifier of the dermatologist conducting the consultation. */
  dermatologist_id:    number;
  /** List of clinical photo URLs uploaded during the consultation. */
  clinical_photo_urls: string[];
  /** Clinical notes recorded by the dermatologist. */
  notes:               string;
  /** Treatment recommendations provided by the dermatologist. */
  recommendations:     string;
  /** Current lifecycle status of the consultation. */
  status:              string;
  /** ISO 8601 date-time string for when the consultation started. */
  started_at:          string;
  /** ISO 8601 date-time string for when the consultation ended. */
  finished_at:         string;
}

/**
 * Response envelope for consultation collection queries.
 */
export interface ConsultationsResponse extends BaseResponse {
  /** The list of consultations returned by the API. */
  consultations: ConsultationResource[];
}
