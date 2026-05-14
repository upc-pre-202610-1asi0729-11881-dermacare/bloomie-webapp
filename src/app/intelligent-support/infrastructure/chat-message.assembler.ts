import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ChatMessage, MessageType } from '../domain/model/chat-message.entity';
import { ChatMessageResource, ChatMessagesResponse } from './chat-message.response';

/**
 * Maps ChatMessage entities to and from API resources.
 */
export class ChatMessageAssembler implements BaseAssembler<
  ChatMessage,
  ChatMessageResource,
  ChatMessagesResponse
> {
  /**
   * Converts a ChatMessagesResponse to an array of ChatMessage entities.
   * @param response - The API response containing chat messages.
   * @returns An array of ChatMessage entities.
   */
  toEntitiesFromResponse(response: ChatMessagesResponse): ChatMessage[] {
    return response.chat_messages.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts a ChatMessageResource to a ChatMessage entity.
   * @param resource - The resource to convert.
   * @returns The converted ChatMessage entity.
   */
  toEntityFromResource(resource: ChatMessageResource): ChatMessage {
    return new ChatMessage({
      id: resource.id,
      supportQueryId: resource.support_query_id,
      text: resource.text,
      type: resource.type as MessageType,
      sentAt: resource.sent_at,
    });
  }

  /**
   * Converts a ChatMessage entity to a ChatMessageResource.
   * @param entity - The entity to convert.
   * @returns The converted ChatMessageResource.
   */
  toResourceFromEntity(entity: ChatMessage): ChatMessageResource {
    return {
      id: entity.id,
      support_query_id: entity.supportQueryId,
      text: entity.text,
      type: entity.type,
      sent_at: entity.sentAt,
    } as ChatMessageResource;
  }
}
