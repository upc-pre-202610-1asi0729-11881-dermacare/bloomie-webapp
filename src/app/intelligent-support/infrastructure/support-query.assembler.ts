import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import {
  SupportQuery,
  SuggestedAction,
  SupportQueryStatus,
} from '../domain/model/support-query.entity';
import { SupportQueryResource, SupportQueriesResponse } from './support-query.response';

/**
 * Maps SupportQuery entities to and from API resources.
 */
export class SupportQueryAssembler implements BaseAssembler<
  SupportQuery,
  SupportQueryResource,
  SupportQueriesResponse
> {
  /**
   * Converts a SupportQueriesResponse to an array of SupportQuery entities.
   * @param response - The API response containing support queries.
   * @returns An array of SupportQuery entities.
   */
  toEntitiesFromResponse(response: SupportQueriesResponse): SupportQuery[] {
    return response.support_queries.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts a SupportQueryResource to a SupportQuery entity.
   * @param resource - The resource to convert.
   * @returns The converted SupportQuery entity.
   */
  toEntityFromResource(resource: SupportQueryResource): SupportQuery {
    return new SupportQuery({
      id: resource.id,
      userId: resource.user_id,
      skinProfileId: resource.skin_profile_id,
      lastFacialScanId: resource.last_facial_scan_id,
      suggestedAction: resource.suggested_action as SuggestedAction,
      status: resource.status as SupportQueryStatus,
      createdAt: resource.created_at,
    });
  }

  /**
   * Converts a SupportQuery entity to a SupportQueryResource.
   * @param entity - The entity to convert.
   * @returns The converted SupportQueryResource.
   */
  toResourceFromEntity(entity: SupportQuery): SupportQueryResource {
    return {
      id: entity.id,
      user_id: entity.userId,
      skin_profile_id: entity.skinProfileId,
      last_facial_scan_id: entity.lastFacialScanId,
      suggested_action: entity.suggestedAction,
      status: entity.status,
      created_at: entity.createdAt,
    } as SupportQueryResource;
  }
}
