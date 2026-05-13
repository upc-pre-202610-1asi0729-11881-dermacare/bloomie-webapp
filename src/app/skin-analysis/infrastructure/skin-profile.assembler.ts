import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import {
  SkinProfile,
  SkinProfileStatus,
  SkinSensitivity,
  SkinType,
} from '../domain/model/skin-profile.entity';
import { SkinProfileResource, SkinProfilesResponse } from './skin-profile.response';

/**
 * Maps SkinProfile entities to and from API resources.
 */
export class SkinProfileAssembler implements BaseAssembler<
  SkinProfile,
  SkinProfileResource,
  SkinProfilesResponse
> {
  /**
   * Converts a SkinProfilesResponse to an array of SkinProfile entities.
   * @param response - The API response containing skin profiles.
   * @returns An array of SkinProfile entities.
   */
  toEntitiesFromResponse(response: SkinProfilesResponse): SkinProfile[] {
    return response.skin_profiles.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts a SkinProfileResource to a SkinProfile entity.
   * @param resource - The resource to convert.
   * @returns The converted SkinProfile entity.
   */
  toEntityFromResource(resource: SkinProfileResource): SkinProfile {
    return new SkinProfile({
      id: resource.id,
      userId: resource.user_id,
      skinType: resource.skin_type as SkinType,
      sensitivity: resource.sensitivity as SkinSensitivity,
      status: resource.status as SkinProfileStatus,
    });
  }

  /**
   * Converts a SkinProfile entity to a SkinProfileResource.
   * @param entity - The entity to convert.
   * @returns The converted SkinProfileResource.
   */
  toResourceFromEntity(entity: SkinProfile): SkinProfileResource {
    return {
      id: entity.id,
      user_id: entity.userId,
      skin_type: entity.skinType,
      sensitivity: entity.sensitivity,
      status: entity.status,
    } as SkinProfileResource;
  }
}
