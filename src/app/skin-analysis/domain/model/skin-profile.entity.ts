import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents the different skin types a user can have.
 */
export enum SkinType {
  Normal = 'NORMAL',
  Dry = 'DRY',
  Oily = 'OILY',
  Combination = 'COMBINATION',
  Sensitive = 'SENSITIVE',
}

/**
 * Represents the sensitivity levels for a skin profile.
 */
export enum SkinSensitivity {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

/**
 * Represents the lifecycle states of a skin profile.
 */
export enum SkinProfileStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Inactive = 'INACTIVE',
}

/**
 * Represents a user's skin profile derived from facial scan analysis.
 */
export class SkinProfile implements BaseEntity {
  /**
   * Creates a new SkinProfile entity.
   * @param props - Initialization values for the skin profile.
   */
  constructor(props: {
    id: number;
    userId: number;
    skinType: SkinType;
    sensitivity: SkinSensitivity;
    status: SkinProfileStatus;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._skinType = props.skinType;
    this._sensitivity = props.sensitivity;
    this._status = props.status;
  }

  /** Unique identifier for the skin profile. */
  private _id: number;

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  /** Identifier of the user who owns this skin profile. */
  private _userId: number;

  get userId(): number {
    return this._userId;
  }

  /** Classified skin type for the user. */
  private _skinType: SkinType;

  get skinType(): SkinType {
    return this._skinType;
  }
  set skinType(value: SkinType) {
    this._skinType = value;
  }

  /** Sensitivity level of the user's skin. */
  private _sensitivity: SkinSensitivity;

  get sensitivity(): SkinSensitivity {
    return this._sensitivity;
  }
  set sensitivity(value: SkinSensitivity) {
    this._sensitivity = value;
  }

  /** Current lifecycle status of the skin profile. */
  private _status: SkinProfileStatus;

  get status(): SkinProfileStatus {
    return this._status;
  }
  set status(value: SkinProfileStatus) {
    this._status = value;
  }

  /**
   * Returns true if the skin profile has been fully completed.
   */
  get isCompleted(): boolean {
    return this._status === SkinProfileStatus.Completed;
  }

  /**
   * Returns true if the skin is classified as sensitive or has high sensitivity.
   * A skin type of Sensitive OR a sensitivity level of High both qualify.
   */
  get requiresGentleCare(): boolean {
    return this._skinType === SkinType.Sensitive || this._sensitivity === SkinSensitivity.High;
  }
}
