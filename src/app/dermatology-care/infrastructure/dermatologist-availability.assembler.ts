import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {DermatologistAvailability} from '../domain/model/dermatologist-availability.entity';
import {DermatologistAvailabilityResource, DermatologistAvailabilitiesResponse} from './dermatologist-availability.response';

/**
 * Maps DermatologistAvailability entities to and from API resources.
 */
export class DermatologistAvailabilityAssembler implements BaseAssembler<DermatologistAvailability, DermatologistAvailabilityResource, DermatologistAvailabilitiesResponse> {

  /**
   * Converts a DermatologistAvailabilitiesResponse to an array of DermatologistAvailability entities.
   * @param response - The API response containing availability slots.
   * @returns An array of DermatologistAvailability entities.
   */
  toEntitiesFromResponse(response: DermatologistAvailabilitiesResponse): DermatologistAvailability[] {
    return response.dermatologist_availabilities.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a DermatologistAvailabilityResource to a DermatologistAvailability entity.
   * @param resource - The resource to convert.
   * @returns The converted DermatologistAvailability entity.
   */
  toEntityFromResource(resource: DermatologistAvailabilityResource): DermatologistAvailability {
    return new DermatologistAvailability({
      id:              resource.id,
      dermatologistId: resource.dermatologist_id,
      dayOfWeek:       resource.day_of_week,
      startTime:       resource.start_time,
      endTime:         resource.end_time,
      slotDuration:    resource.slot_duration,
    });
  }

  /**
   * Converts a DermatologistAvailability entity to a DermatologistAvailabilityResource.
   * @param entity - The entity to convert.
   * @returns The converted DermatologistAvailabilityResource.
   */
  toResourceFromEntity(entity: DermatologistAvailability): DermatologistAvailabilityResource {
    return {
      id:               entity.id,
      dermatologist_id: entity.dermatologistId,
      day_of_week:      entity.dayOfWeek,
      start_time:       entity.startTime,
      end_time:         entity.endTime,
      slot_duration:    entity.slotDuration,
    } as DermatologistAvailabilityResource;
  }
}
