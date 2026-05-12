import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a chat message returned by the API.
 * Field names follow the snake_case convention used by the REST backend.
 */
export interface ChatMessageResource extends BaseResource {
  /** Unique identifier for the chat message. */
  id: number;
  /** Identifier of the support query this message belongs to. */
  support_query_id: number;
  /** Text content of the message. */
  text: string;
  /** Who authored this message: USER, AI, or SYSTEM. */
  type: string;
  /** ISO 8601 date-time string for when the message was sent. */
  sent_at: string;
}

/**
 * Response envelope for chat message collection queries.
 */
export interface ChatMessagesResponse extends BaseResponse {
  /** The list of chat messages returned by the API. */
  chat_messages: ChatMessageResource[];
}
