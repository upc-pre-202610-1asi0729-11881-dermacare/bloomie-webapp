import { BaseResource } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a user account returned by the IAM API.
 */
export interface UserResource extends BaseResource {
  /** Unique identifier for the user. */
  id:        number;
  /** Full name of the user as returned by the backend. */
  fullName:  string;
  /** Email address used by the user to authenticate. */
  email:     string;
  /** Roles granted to the user (e.g. ["ROLE_YOUNG_ADULT"]). */
  roles:     string[];
  /** URL of the user's profile photo, if set. */
  photoUrl?: string | null;
}
