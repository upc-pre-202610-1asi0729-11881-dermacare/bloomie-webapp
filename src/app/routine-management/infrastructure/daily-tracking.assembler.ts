import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import { DailyTracking, TrackingStatus } from '../domain/model/daily-tracking.entity';
import { DailyTrackingResource, DailyTrackingsResponse } from './daily-tracking.response';

/**
 * Maps DailyTracking entities to and from API resources.
 */
export class DailyTrackingAssembler implements BaseAssembler<DailyTracking, DailyTrackingResource, DailyTrackingsResponse> {

  /**
   * Converts a DailyTrackingsResponse to an array of DailyTracking entities.
   * @param response - The API response containing daily tracking records.
   * @returns An array of DailyTracking entities.
   */
  toEntitiesFromResponse(response: DailyTrackingsResponse): DailyTracking[] {
    return response.daily_trackings.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a DailyTrackingResource to a DailyTracking entity.
   * @param resource - The resource to convert.
   * @returns The converted DailyTracking entity.
   */
  toEntityFromResource(resource: DailyTrackingResource): DailyTracking {
    return new DailyTracking({
      id:        resource.id,
      routineId: resource.routine_id,
      userId:    resource.user_id,
      date:      resource.date,
      status:    resource.status as TrackingStatus,
    });
  }

  /**
   * Converts a DailyTracking entity to a DailyTrackingResource.
   * @param entity - The entity to convert.
   * @returns The converted DailyTrackingResource.
   */
  toResourceFromEntity(entity: DailyTracking): DailyTrackingResource {
    return {
      id:         entity.id,
      routine_id: entity.routineId,
      user_id:    entity.userId,
      date:       entity.date,
      status:     entity.status,
    } as DailyTrackingResource;
  }
}
