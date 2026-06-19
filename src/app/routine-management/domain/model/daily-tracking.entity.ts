import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Represents the daily tracking record for a patient's skincare routine completion.
 */
export class DailyTracking implements BaseEntity {

  /**
   * Creates a new DailyTracking entity.
   * @param props - Initialization values for the daily tracking entry.
   */
  constructor(props: {
    id:          number;
    patientId:   number;
    routineId:   number;
    date:        string;
    isCompleted: boolean;
    completedAt: string;
  }) {
    this._id          = props.id;
    this._patientId   = props.patientId;
    this._routineId   = props.routineId;
    this._date        = props.date;
    this._isCompleted = props.isCompleted;
    this._completedAt = props.completedAt;
  }

  /** Unique identifier for the daily tracking record. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** Identifier of the patient who owns this tracking record. */
  private _patientId: number;

  get patientId(): number { return this._patientId; }

  /** Identifier of the routine that was tracked. */
  private _routineId: number;

  get routineId(): number { return this._routineId; }

  /** ISO 8601 date string for this tracking entry (e.g. '2026-06-19'). */
  private _date: string;

  get date(): string { return this._date; }

  /** Whether the routine was completed on this day. */
  private _isCompleted: boolean;

  get isCompleted(): boolean { return this._isCompleted; }

  /** ISO 8601 date-time string when the completion was recorded. */
  private _completedAt: string;

  get completedAt(): string { return this._completedAt; }

  /**
   * Returns a display-friendly formatted date string for this tracking entry.
   * @returns Formatted date as 'MMM DD, YYYY'.
   */
  get formattedDate(): string {
    return new Date(this._date).toLocaleDateString('en-US', {
      month: 'short',
      day:   '2-digit',
      year:  'numeric',
    });
  }
}
