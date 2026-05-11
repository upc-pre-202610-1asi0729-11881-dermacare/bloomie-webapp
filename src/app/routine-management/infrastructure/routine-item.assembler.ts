import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import { RoutineItem, RoutineStep } from '../domain/model/routine-item.entity';
import { RoutineItemResource, RoutineItemsResponse } from './routine-item.response';

/**
 * Maps RoutineItem entities to and from API resources.
 */
export class RoutineItemAssembler implements BaseAssembler<RoutineItem, RoutineItemResource, RoutineItemsResponse> {

  /**
   * Converts a RoutineItemsResponse to an array of RoutineItem entities.
   * @param response - The API response containing routine items.
   * @returns An array of RoutineItem entities.
   */
  toEntitiesFromResponse(response: RoutineItemsResponse): RoutineItem[] {
    return response.routine_items.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a RoutineItemResource to a RoutineItem entity.
   * @param resource - The resource to convert.
   * @returns The converted RoutineItem entity.
   */
  toEntityFromResource(resource: RoutineItemResource): RoutineItem {
    return new RoutineItem({
      id:            resource.id,
      routineId:     resource.routine_id,
      productId:     resource.product_id,
      step:          resource.step as RoutineStep,
      scheduledTime: resource.scheduled_time,
      status:        resource.status,
      order:         resource.order,
    });
  }

  /**
   * Converts a RoutineItem entity to a RoutineItemResource.
   * @param entity - The entity to convert.
   * @returns The converted RoutineItemResource.
   */
  toResourceFromEntity(entity: RoutineItem): RoutineItemResource {
    return {
      id:             entity.id,
      routine_id:     entity.routineId,
      product_id:     entity.productId,
      step:           entity.step,
      scheduled_time: entity.scheduledTime,
      status:         entity.status,
      order:          entity.order,
    } as RoutineItemResource;
  }
}
