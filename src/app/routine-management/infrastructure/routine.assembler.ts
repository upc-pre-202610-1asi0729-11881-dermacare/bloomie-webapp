import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import { Routine, RoutineStatus } from '../domain/model/routine.entity';
import { RoutineResource, RoutinesResponse } from './routine.response';

/**
 * Maps Routine entities to and from API resources.
 */
export class RoutineAssembler implements BaseAssembler<Routine, RoutineResource, RoutinesResponse> {

  /**
   * Converts a RoutinesResponse to an array of Routine entities.
   * @param response - The API response containing routines.
   * @returns An array of Routine entities.
   */
  toEntitiesFromResponse(response: RoutinesResponse): Routine[] {
    return response.routines.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a RoutineResource to a Routine entity.
   * @param resource - The resource to convert.
   * @returns The converted Routine entity.
   */
  toEntityFromResource(resource: RoutineResource): Routine {
    return new Routine({
      id:            resource.id,
      userId:        resource.user_id,
      skinProfileId: resource.skin_profile_id,
      facialScanId:  resource.facial_scan_id,
      status:        resource.status as RoutineStatus,
      createdAt:     resource.created_at,
    });
  }

  /**
   * Converts a Routine entity to a RoutineResource.
   * @param entity - The entity to convert.
   * @returns The converted RoutineResource.
   */
  toResourceFromEntity(entity: Routine): RoutineResource {
    return {
      id:              entity.id,
      user_id:         entity.userId,
      skin_profile_id: entity.skinProfileId,
      facial_scan_id:  entity.facialScanId,
      status:          entity.status,
      created_at:      entity.createdAt,
    } as RoutineResource;
  }
}
