import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a support query returned by the API.
 * Field names follow the snake_case convention used by the REST backend.
 */
export interface SupportQueryResource extends BaseResource {
  /** Unique identifier for the support query. */
  id: number;
  /** Identifier of the user who initiated this support query. */
  user_id: number;
  /** Identifier of the skin profile linked to this support query. */
  skin_profile_id: number;
  /** Identifier of the most recent facial scan associated with this query. */
  last_facial_scan_id: number;
  /** AI-recommended next action derived from the conversation context. */
  suggested_action: string;
  /** Current lifecycle status of the support query. */
  status: string;
  /** ISO 8601 date-time string for when the support query was created. */
  created_at: string;
}

/**
 * Response envelope for support query collection queries.
 */
export interface SupportQueriesResponse extends BaseResponse {
  /** The list of support queries returned by the API. */
  support_queries: SupportQueryResource[];
}
