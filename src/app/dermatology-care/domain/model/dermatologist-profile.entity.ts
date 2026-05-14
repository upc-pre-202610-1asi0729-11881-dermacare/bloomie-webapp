import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Represents a certified dermatologist's professional profile
 * within the dermatology care bounded context.
 */
export class DermatologistProfile implements BaseEntity {

  /**
   * Creates a new DermatologistProfile entity.
   * @param props - Initialization values for the profile.
   */
  constructor(props: {
    id:              number;
    userId:          number;
    specialty:       string;
    consultationFee: number;
    rating:          number;
    yearsExperience: number;
    patientCount:    number;
    available:       boolean;
  }) {
    this._id              = props.id;
    this._userId          = props.userId;
    this._specialty       = props.specialty;
    this._consultationFee = props.consultationFee;
    this._rating          = props.rating;
    this._yearsExperience = props.yearsExperience;
    this._patientCount    = props.patientCount;
    this._available       = props.available;
  }

  /** Unique identifier for the profile. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** Identifier of the user account linked to this profile. */
  private _userId: number;

  get userId(): number { return this._userId; }

  /** Medical specialty of the dermatologist. */
  private _specialty: string;

  get specialty(): string { return this._specialty; }
  set specialty(value: string) { this._specialty = value; }

  /**
   * Fee charged per consultation in USD.
   * Must be greater than zero.
   */
  private _consultationFee: number;

  get consultationFee(): number { return this._consultationFee; }
  set consultationFee(value: number) { this._consultationFee = value; }

  /**
   * Average rating given by patients, from 0.0 to 5.0.
   */
  private _rating: number;

  get rating(): number { return this._rating; }

  /** Number of years the dermatologist has been practicing. */
  private _yearsExperience: number;

  get yearsExperience(): number { return this._yearsExperience; }
  set yearsExperience(value: number) { this._yearsExperience = value; }

  /** Total number of patients attended on the platform. */
  private _patientCount: number;

  get patientCount(): number { return this._patientCount; }

  /** Whether the dermatologist is currently accepting appointments. */
  private _available: boolean;

  get available(): boolean { return this._available; }
  set available(value: boolean) { this._available = value; }

  /**
   * Returns true if the dermatologist has a high rating.
   * A rating of 4.5 or above is considered high.
   */
  get hasHighRating(): boolean {
    return this._rating >= 4.5;
  }

  /**
   * Returns the formatted consultation fee as a display string.
   * @returns Fee formatted as a USD currency string.
   */
  get formattedFee(): string {
    return `$${this._consultationFee.toFixed(2)}`;
  }
}
