import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Represents the lifecycle states of a virtual dermatology consultation.
 */
export enum ConsultationStatus {
  Pending    = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Completed  = 'COMPLETED',
  Cancelled  = 'CANCELLED',
}

/**
 * Represents a virtual dermatology consultation session
 * linked to a confirmed appointment.
 */
export class Consultation implements BaseEntity {

  /**
   * Creates a new Consultation entity.
   * @param props - Initialization values for the consultation.
   */
  constructor(props: {
    id:                 number;
    appointmentId:      number;
    patientId:          number;
    dermatologistId:    number;
    clinicalPhotoUrls:  string[];
    notes:              string;
    recommendations:    string;
    status:             ConsultationStatus;
    startedAt:          string;
    finishedAt:         string;
  }) {
    this._id                = props.id;
    this._appointmentId     = props.appointmentId;
    this._patientId         = props.patientId;
    this._dermatologistId   = props.dermatologistId;
    this._clinicalPhotoUrls = props.clinicalPhotoUrls;
    this._notes             = props.notes;
    this._recommendations   = props.recommendations;
    this._status            = props.status;
    this._startedAt         = props.startedAt;
    this._finishedAt        = props.finishedAt;
  }

  /** Unique identifier for the consultation. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** Identifier of the appointment this consultation belongs to. */
  private _appointmentId: number;

  get appointmentId(): number { return this._appointmentId; }

  /** Identifier of the patient attending the consultation. */
  private _patientId: number;

  get patientId(): number { return this._patientId; }

  /** Identifier of the dermatologist conducting the consultation. */
  private _dermatologistId: number;

  get dermatologistId(): number { return this._dermatologistId; }

  /** List of clinical photo URLs uploaded during the consultation. */
  private _clinicalPhotoUrls: string[];

  get clinicalPhotoUrls(): string[] { return this._clinicalPhotoUrls; }

  /** Clinical notes recorded by the dermatologist during the session. */
  private _notes: string;

  get notes(): string { return this._notes; }
  set notes(value: string) { this._notes = value; }

  /** Treatment recommendations provided by the dermatologist. */
  private _recommendations: string;

  get recommendations(): string { return this._recommendations; }
  set recommendations(value: string) { this._recommendations = value; }

  /** Current lifecycle status of the consultation. */
  private _status: ConsultationStatus;

  get status(): ConsultationStatus { return this._status; }
  set status(value: ConsultationStatus) { this._status = value; }

  /** ISO 8601 date-time string for when the consultation started. */
  private _startedAt: string;

  get startedAt(): string { return this._startedAt; }

  /** ISO 8601 date-time string for when the consultation ended. */
  private _finishedAt: string;

  get finishedAt(): string { return this._finishedAt; }
  set finishedAt(value: string) { this._finishedAt = value; }

  /**
   * Returns true if the consultation has clinical photos attached.
   */
  get hasClinicalPhotos(): boolean {
    return this._clinicalPhotoUrls.length > 0;
  }

  /**
   * Returns true if the consultation has been completed.
   */
  get isCompleted(): boolean {
    return this._status === ConsultationStatus.Completed;
  }

  /**
   * Calculates the duration of the consultation in minutes.
   * Returns 0 if either timestamp is missing or invalid.
   */
  get durationInMinutes(): number {
    if (!this._startedAt || !this._finishedAt) return 0;
    const start = new Date(this._startedAt).getTime();
    const end   = new Date(this._finishedAt).getTime();
    return end > start ? Math.round((end - start) / (1000 * 60)) : 0;
  }
}
