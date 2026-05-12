import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportQuery } from '../domain/model/support-query.entity';
import { ChatMessage } from '../domain/model/chat-message.entity';
import { SupportQueriesApiEndpoint } from './support-queries-api-endpoint';
import { ChatMessagesApiEndpoint } from './chat-messages-api-endpoint';

/**
 * Infrastructure facade for intelligent support endpoint operations.
 * Composes support query and chat message endpoints and exposes
 * use-case oriented methods to the application layer.
 */
@Injectable({ providedIn: 'root' })
export class IntelligentSupportApi extends BaseApi {
  private readonly supportQueriesEndpoint: SupportQueriesApiEndpoint;
  private readonly chatMessagesEndpoint: ChatMessagesApiEndpoint;

  /**
   * Creates an instance of IntelligentSupportApi.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super();
    this.supportQueriesEndpoint = new SupportQueriesApiEndpoint(http);
    this.chatMessagesEndpoint = new ChatMessagesApiEndpoint(http);
  }

  /**
   * Creates a new support query for a given user and skin profile.
   * @param supportQuery - The support query entity to persist.
   * @returns Stream with the created SupportQuery entity.
   */
  createSupportQuery(supportQuery: SupportQuery): Observable<SupportQuery> {
    return this.supportQueriesEndpoint.create(supportQuery);
  }

  /**
   * Retrieves a single support query by its identifier.
   * @param id - The identifier of the support query.
   * @returns Stream with the matched SupportQuery entity.
   */
  getSupportQuery(id: number): Observable<SupportQuery> {
    return this.supportQueriesEndpoint.getById(id);
  }

  /**
   * Updates an existing support query (e.g. to change its status or suggested action).
   * @param supportQuery - The support query entity with updated values.
   * @returns Stream with the updated SupportQuery entity.
   */
  updateSupportQuery(supportQuery: SupportQuery): Observable<SupportQuery> {
    return this.supportQueriesEndpoint.update(supportQuery, supportQuery.id);
  }

  /**
   * Retrieves all chat messages belonging to a support query.
   * @param supportQueryId - The identifier of the parent support query.
   * @returns Stream with the collection of ChatMessage entities.
   */
  getChatMessages(supportQueryId: number): Observable<ChatMessage[]> {
    return this.chatMessagesEndpoint.getAll();
  }

  /**
   * Sends a new chat message within a support query session.
   * @param chatMessage - The chat message entity to persist.
   * @returns Stream with the created ChatMessage entity.
   */
  sendChatMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    return this.chatMessagesEndpoint.create(chatMessage);
  }
}
