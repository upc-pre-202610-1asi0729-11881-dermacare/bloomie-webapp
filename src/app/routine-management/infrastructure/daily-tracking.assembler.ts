import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DailyTracking } from '../domain/model/daily-tracking.entity';
import { DailyTrackingResource, DailyTrackingsResponse } from './daily-tracking.response';

/**
 * Maps DailyTracking entities to and from API resources.
 */
export class DailyTrackingAssembler implements BaseAssembler<DailyTracking, DailyTrackingResource, DailyTrackingsResponse> {

  toEntitiesFromResponse(response: DailyTrackingsResponse): DailyTracking[] {
    return response.daily_trackings.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: DailyTrackingResource): DailyTracking {
    return new DailyTracking({
      id:          resource.id,
      patientId:   resource.patientId,
      routineId:   resource.routineId,
      date:        resource.date,
      isCompleted: resource.isCompleted,
      completedAt: resource.completedAt ?? '',
    });
  }

  toResourceFromEntity(entity: DailyTracking): DailyTrackingResource {
    return {
      id:          entity.id,
      patientId:   entity.patientId,
      routineId:   entity.routineId,
      date:        entity.date,
      isCompleted: entity.isCompleted,
      completedAt: entity.completedAt,
    } as DailyTrackingResource;
  }
}
