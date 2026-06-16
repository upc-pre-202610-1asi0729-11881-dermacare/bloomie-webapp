import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { User, UserRole } from '../domain/model/user.entity';
import { UserResource }   from './user.response';
import { AuthResponse }   from './auth.response';

/**
 * Maps User entities to and from API resources within the IAM bounded context.
 */
export class UserAssembler implements BaseAssembler<User, UserResource, AuthResponse> {

  toEntitiesFromResponse(response: AuthResponse): User[] {
    return [this.toEntityFromResource(response.user)];
  }

  toEntityFromResource(resource: UserResource): User {
    const spaceIdx = resource.fullName?.indexOf(' ') ?? -1;
    const name     = spaceIdx >= 0 ? resource.fullName.substring(0, spaceIdx) : (resource.fullName ?? '');
    const lastName = spaceIdx >= 0 ? resource.fullName.substring(spaceIdx + 1) : '';

    // Backend returns "ROLE_YOUNG_ADULT" / "ROLE_DERMATOLOGIST"; strip the prefix.
    const rawRole = resource.roles?.[0] ?? '';
    const role    = rawRole.replace('ROLE_', '') as UserRole;

    return new User({
      id:       resource.id,
      email:    resource.email,
      name,
      lastName,
      role,
      photoUrl: resource.photoUrl ?? undefined,
    });
  }

  toResourceFromEntity(entity: User): UserResource {
    return {
      id:       entity.id,
      fullName: `${entity.name} ${entity.lastName}`.trim(),
      email:    entity.email,
      roles:    [entity.role],
      photoUrl: entity.photoUrl,
    };
  }
}
