import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {DermatologistAvailability} from '../domain/model/dermatologist-availability.entity';
import {DermatologistAvailabilityResource, DermatologistAvailabilitiesResponse} from './dermatologist-availability.response';

/**
 * Maps DermatologistAvailability entities to and from API resources.
 */
export class DermatologistAvailabilityAssembler implements BaseAssembler<DermatologistAvailability, DermatologistAvailabilityResource, DermatologistAvailabilitiesResponse> {

  toEntitiesFromResponse(response: DermatologistAvailabilitiesResponse): DermatologistAvailability[] {
    return response.dermatologist_availabilities.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: DermatologistAvailabilityResource): DermatologistAvailability {
    return new DermatologistAvailability({
      id:              resource.id,
      dermatologistId: resource.dermatologistId,
      dayOfWeek:       resource.day,
      startTime:       resource.startTime,
      endTime:         resource.endTime,
      active:          resource.active,
    });
  }

  toResourceFromEntity(entity: DermatologistAvailability): DermatologistAvailabilityResource {
    return {
      id:              entity.id,
      dermatologistId: entity.dermatologistId,
      day:             entity.dayOfWeek,
      startTime:       entity.startTime,
      endTime:         entity.endTime,
      active:          entity.active,
    } as DermatologistAvailabilityResource;
  }
}
