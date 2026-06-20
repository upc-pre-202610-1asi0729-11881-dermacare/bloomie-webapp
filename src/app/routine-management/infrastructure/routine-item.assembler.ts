import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { RoutineItem, RoutineStep } from '../domain/model/routine-item.entity';
import { RoutineItemResource, RoutineItemsResponse } from './routine-item.response';

/**
 * Maps RoutineItem entities to and from API resources.
 */
export class RoutineItemAssembler implements BaseAssembler<RoutineItem, RoutineItemResource, RoutineItemsResponse> {

  toEntitiesFromResponse(response: RoutineItemsResponse): RoutineItem[] {
    return response.routine_items.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: RoutineItemResource): RoutineItem {
    return new RoutineItem({
      id:                    resource.id,
      step:                  resource.step as RoutineStep,
      order:                 resource.order,
      scheduledTime:         resource.scheduledTime,
      productRecommendation: resource.productRecommendation,
    });
  }

  toResourceFromEntity(entity: RoutineItem): RoutineItemResource {
    return {
      id:                    entity.id,
      step:                  entity.step,
      order:                 entity.order,
      scheduledTime:         entity.scheduledTime,
      productRecommendation: entity.productRecommendation,
    } as RoutineItemResource;
  }
}
