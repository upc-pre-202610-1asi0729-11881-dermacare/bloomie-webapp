import { UserResource } from './user.response';

/**
 * Resource representation of a dermatologist registration payload.
 *
 * @remarks
 * Extends {@link UserResource} adding the medical specialty selected by the
 * dermatologist during sign-up. The specialty is required by the backend to
 * create the linked dermatologist profile in the dermatology care bounded
 * context.
 */
export interface DermatologistResource extends UserResource {
  /** Medical specialty selected by the dermatologist on registration. */
  specialty: string;
}
