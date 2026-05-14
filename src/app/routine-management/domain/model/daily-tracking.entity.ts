import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Represents the completion state of a daily tracking entry.
 */
export enum TrackingStatus {
  Completed    = 'COMPLETED',
  NotCompleted = 'NOT_COMPLETED',
}

/**
 * Represents the daily tracking record for a single routine item.
 */
export class DailyTracking implements BaseEntity {

  /**
   * Creates a new DailyTracking entity.
   * @param props - Initialization values for the daily tracking entry.
   */
  constructor(props: {
    id:        number;
    routineId: number;
    userId:    number;
    date:      string;
    status:    TrackingStatus;
  }) {
    this._id        = props.id;
    this._routineId = props.routineId;
    this._userId    = props.userId;
    this._date      = props.date;
    this._status    = props.status;
  }

  /** Unique identifier for the daily tracking record. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** Identifier of the routine being tracked. */
  private _routineId: number;

  get routineId(): number { return this._routineId; }

  /** Identifier of the user who owns this tracking record. */
  private _userId: number;

  get userId(): number { return this._userId; }

  /** ISO 8601 date string for this tracking entry (e.g. '2026-05-11'). */
  private _date: string;

  get date(): string { return this._date; }

  /** Completion status of the routine on this day. */
  private _status: TrackingStatus;

  get status(): TrackingStatus { return this._status; }
  set status(value: TrackingStatus) { this._status = value; }

  /**
   * Returns true if the routine was completed on this tracking day.
   */
  get isCompleted(): boolean {
    return this._status === TrackingStatus.Completed;
  }

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
