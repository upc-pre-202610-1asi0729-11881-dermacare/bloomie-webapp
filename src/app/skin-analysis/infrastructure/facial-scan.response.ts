import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a facial scan returned by the API.
 */
export interface FacialScanResource extends BaseResource {
  /** Unique identifier for the facial scan. */
  id: number;
  /** Identifier of the user who performed this scan. */
  user_id: number;
  /** Identifier of the skin profile associated with this scan. */
  skin_profile_id: number;
  /** URL of the uploaded facial image used for analysis. */
  image_url: string;
  /** Diagnosis text generated from the scan results. */
  diagnosis: string;
  /** Overall skin health score from 0 to 100. */
  overall_score: number;
  /** Hydration level score from 0 to 100. */
  hydration_score: number;
  /** Skin texture quality score from 0 to 100. */
  texture_score: number;
  /** Skin sensitivity score from 0 to 100. */
  sensitivity_score: number;
  /** Skin brightness score from 0 to 100. */
  brightness_score: number;
  /** ISO 8601 date-time string for when the scan was performed. */
  scanned_at: string;
  /** Current lifecycle status of the facial scan. */
  status: string;
}

/**
 * Response envelope for facial scan collection queries.
 */
export interface FacialScansResponse extends BaseResponse {
  /** The list of facial scans returned by the API. */
  facial_scans: FacialScanResource[];
}
