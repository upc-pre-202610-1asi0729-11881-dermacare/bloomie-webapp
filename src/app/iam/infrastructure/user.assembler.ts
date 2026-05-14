import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { User, UserRole } from '../domain/model/user.entity';
import { UserResource }   from './user.response';
import { AuthResponse }   from './auth.response';

/**
 * Maps User entities to and from API resources within the IAM bounded context.
 *
 * @remarks
 * Translates the snake_case fields exposed by the backend (`last_name`,
 * `password_hash`) to the camelCase fields used by the domain model, and
 * unwraps the {@link AuthResponse} envelope returned by login and registration
 * operations.
 */
export class UserAssembler implements BaseAssembler<User, UserResource, AuthResponse> {

  /**
   * Converts an AuthResponse envelope into an array of User entities.
   * @param response - The API response containing the authenticated user.
   * @returns An array with the single authenticated User entity.
   */
  toEntitiesFromResponse(response: AuthResponse): User[] {
    return [this.toEntityFromResource(response.user)];
  }

  /**
   * Converts a UserResource to a User entity.
   * @param resource - The resource to convert.
   * @returns The converted User entity.
   */
  toEntityFromResource(resource: UserResource): User {
    return new User({
      id:       resource.id,
      email:    resource.email,
      name:     resource.name,
      lastName: resource.last_name,
      role:     resource.role as UserRole,
    });
  }

  /**
   * Converts a User entity to a UserResource.
   * @param entity - The entity to convert.
   * @returns The converted UserResource with an empty password hash, since
   *          the password is provided separately during registration.
   */
  toResourceFromEntity(entity: User): UserResource {
    return {
      id:            entity.id,
      email:         entity.email,
      name:          entity.name,
      last_name:     entity.lastName,
      role:          entity.role,
      password_hash: '',
    } as UserResource;
  }
}
