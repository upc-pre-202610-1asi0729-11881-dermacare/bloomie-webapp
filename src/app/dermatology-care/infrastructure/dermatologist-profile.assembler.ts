import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {DermatologistProfile} from '../domain/model/dermatologist-profile.entity';
import {DermatologistProfileResource, DermatologistProfilesResponse} from './dermatologist-profile.response';

/**
 * Maps DermatologistProfile entities to and from API resources.
 */
export class DermatologistProfileAssembler implements BaseAssembler<DermatologistProfile, DermatologistProfileResource, DermatologistProfilesResponse> {

  /**
   * Converts a DermatologistProfilesResponse to an array of DermatologistProfile entities.
   * @param response - The API response containing dermatologist profiles.
   * @returns An array of DermatologistProfile entities.
   */
  toEntitiesFromResponse(response: DermatologistProfilesResponse): DermatologistProfile[] {
    return response.dermatologist_profiles.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a DermatologistProfileResource to a DermatologistProfile entity.
   * @param resource - The resource to convert.
   * @returns The converted DermatologistProfile entity.
   */
  toEntityFromResource(resource: DermatologistProfileResource): DermatologistProfile {
    return new DermatologistProfile({
      id:              resource.id,
      userId:          resource.user_id,
      specialty:       resource.specialty,
      consultationFee: resource.consultation_fee,
      rating:          resource.rating,
      yearsExperience: resource.years_experience,
      patientCount:    resource.patient_count,
      available:       resource.available,
    });
  }

  /**
   * Converts a DermatologistProfile entity to a DermatologistProfileResource.
   * @param entity - The entity to convert.
   * @returns The converted DermatologistProfileResource.
   */
  toResourceFromEntity(entity: DermatologistProfile): DermatologistProfileResource {
    return {
      id:               entity.id,
      user_id:          entity.userId,
      specialty:        entity.specialty,
      consultation_fee: entity.consultationFee,
      rating:           entity.rating,
      years_experience: entity.yearsExperience,
      patient_count:    entity.patientCount,
      available:        entity.available,
    } as DermatologistProfileResource;
  }
}
