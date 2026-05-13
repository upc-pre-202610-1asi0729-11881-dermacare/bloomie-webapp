import { BaseResource } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a user account returned by the IAM API.
 *
 * @remarks
 * Field names follow the snake_case convention used by the backend.
 * The `password_hash` field is only sent on registration requests and is
 * never persisted on the client; the server is responsible for hashing
 * and storing it securely.
 */
export interface UserResource extends BaseResource {
  /** Unique identifier for the user. */
  id:            number;
  /** Email address used by the user to authenticate. */
  email:         string;
  /** Given name of the user. */
  name:          string;
  /** Family name of the user. */
  last_name:     string;
  /** Role granted to the user, encoded as a string value of UserRole. */
  role:          string;
  /** Hashed password value exchanged with the server on registration. */
  password_hash: string;
}
