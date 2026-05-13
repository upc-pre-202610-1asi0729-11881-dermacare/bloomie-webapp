import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents the role assigned to a user account in the IAM bounded context.
 *
 * @remarks
 * The role determines which features and views a user can access:
 * - {@link UserRole.YoungAdult}: standard patient user that can book consultations,
 *   manage routines, and complete the skin profile questionnaire.
 * - {@link UserRole.Dermatologist}: certified specialist that can manage their
 *   agenda, availability, and attend virtual consultations.
 */
export enum UserRole {
  YoungAdult    = 'YOUNG_ADULT',
  Dermatologist = 'DERMATOLOGIST',
}

/**
 * Represents an authenticated identity in the IAM bounded context.
 *
 * @remarks
 * A User aggregates the personal information required to identify a person
 * on the platform and the role that determines their access scope. The role
 * is immutable after construction; changes of role require creating a new
 * account.
 *
 * Passwords are never stored inside the entity. They are accepted as plain
 * parameters by the registration and login use cases and forwarded directly
 * to the backend, which is responsible for hashing and persistence.
 */
export class User implements BaseEntity {

  /**
   * Creates a new User entity.
   * @param props - Initialization values for the user.
   */
  constructor(props: {
    id:       number;
    email:    string;
    name:     string;
    lastName: string;
    role:     UserRole;
  }) {
    this._id       = props.id;
    this._email    = props.email;
    this._name     = props.name;
    this._lastName = props.lastName;
    this._role     = props.role;
  }

  /** Unique identifier for the user. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** Email address used by the user to authenticate. */
  private _email: string;

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  /** Given name of the user. */
  private _name: string;

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  /** Family name of the user. */
  private _lastName: string;

  get lastName(): string { return this._lastName; }
  set lastName(value: string) { this._lastName = value; }

  /**
   * Role granted to the user.
   * @remarks
   * Exposed as read-only because role changes are not supported through the
   * profile edition flow. A new account must be created to switch roles.
   */
  private _role: UserRole;

  get role(): UserRole { return this._role; }
}
