import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {DermatologistProfile} from '../domain/model/dermatologist-profile.entity';
import {DermatologistProfileResource, DermatologistProfilesResponse} from './dermatologist-profile.response';

/**
 * Maps DermatologistProfile entities to and from API resources.
 */
export class DermatologistProfileAssembler implements BaseAssembler<
  DermatologistProfile,
  DermatologistProfileResource,
  DermatologistProfilesResponse
> {
  toEntitiesFromResponse(response: DermatologistProfilesResponse): DermatologistProfile[] {
    return response.dermatologist_profiles.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: DermatologistProfileResource): DermatologistProfile {
    const fullName =
      resource.fullName ?? `${resource.firstName ?? ''} ${resource.lastName ?? ''}`.trim();

    return new DermatologistProfile({
      id: resource.id,
      userId: resource.dermatologistId,
      specialty: resource.specialtyName ?? resource.specialty ?? '',
      fullName: fullName,
      licenseNumber: resource.licenseNumber ?? '',
      contactPhone: resource.contactPhone ?? '',
      biography: resource.biography ?? '',
      consultationFee: resource.consultationFee ?? 0,
      photoUrl: resource.photoUrl ?? null,
    });
  }

  toResourceFromEntity(entity: DermatologistProfile): DermatologistProfileResource {
    const nameParts = entity.fullName?.split(' ') ?? [];
    return {
      id: entity.id,
      dermatologistId: entity.userId,
      firstName: nameParts[0] ?? '',
      lastName: nameParts.slice(1).join(' ') ?? '',
      specialty: entity.specialty, // ← "specialty" no "specialtyName" para el PUT
      licenseNumber: entity.licenseNumber ?? null,
      phone: entity.contactPhone ?? null, // ← "phone" no "contactPhone" para el PUT
      biography: entity.biography ?? null,
      consultationFee: entity.consultationFee,
      photoUrl: entity.photoUrl ?? null,
    } as DermatologistProfileResource;
  }
}
