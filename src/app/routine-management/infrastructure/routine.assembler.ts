import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Routine, RoutineStatus } from '../domain/model/routine.entity';
import { RoutineResource, RoutinesResponse } from './routine.response';
import { RoutineItemAssembler } from './routine-item.assembler';

/**
 * Maps Routine entities to and from API resources.
 * Handles embedded RoutineItem assembly via RoutineItemAssembler.
 */
export class RoutineAssembler implements BaseAssembler<Routine, RoutineResource, RoutinesResponse> {

  private readonly itemAssembler = new RoutineItemAssembler();

  toEntitiesFromResponse(response: RoutinesResponse): Routine[] {
    return response.routines.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: RoutineResource): Routine {
    const routine = new Routine({
      id:             resource.id,
      patientId:      resource.patientId,
      skinAnalysisId: resource.skinAnalysisId,
      status:         resource.status as RoutineStatus,
      createdAt:      resource.createdAt,
    });
    if (resource.items) {
      routine.items = resource.items.map(item => this.itemAssembler.toEntityFromResource(item));
    }
    return routine;
  }

  toResourceFromEntity(entity: Routine): RoutineResource {
    return {
      id:             entity.id,
      patientId:      entity.patientId,
      skinAnalysisId: entity.skinAnalysisId,
      status:         entity.status,
      createdAt:      entity.createdAt,
      items:          [],
    } as RoutineResource;
  }
}
