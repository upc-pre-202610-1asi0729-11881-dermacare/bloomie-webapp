import {BaseEntity} from '../../../shared/infrastructure/base-entity';
import {RoutineItem} from './routine-item.entity';

/**
 * Represents the lifecycle states of a skincare routine.
 */
export enum RoutineStatus {
  Active   = 'ACTIVE',
  Update   = 'UPDATE',
  Inactive = 'INACTIVE',
}

/**
 * Represents a personalized skincare routine assigned to a user.
 */
export class Routine implements BaseEntity {

  /**
   * Creates a new Routine entity.
   * @param props - Initialization values for the routine.
   */
  constructor(props: {
    id:           number;
    userId:       number;
    skinProfileId: number;
    facialScanId: number;
    status:       RoutineStatus;
    createdAt:    string;
  }) {
    this._id            = props.id;
    this._userId        = props.userId;
    this._skinProfileId = props.skinProfileId;
    this._facialScanId  = props.facialScanId;
    this._status        = props.status;
    this._createdAt     = props.createdAt;
    this._items         = [];
  }

  /** Unique identifier for the routine. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** Identifier of the user who owns this routine. */
  private _userId: number;

  get userId(): number { return this._userId; }

  /** Identifier of the skin profile associated with this routine. */
  private _skinProfileId: number;

  get skinProfileId(): number { return this._skinProfileId; }

  /** Identifier of the facial scan that generated this routine. */
  private _facialScanId: number;

  get facialScanId(): number { return this._facialScanId; }

  /** Current lifecycle status of the routine. */
  private _status: RoutineStatus;

  get status(): RoutineStatus { return this._status; }
  set status(value: RoutineStatus) { this._status = value; }

  /** ISO 8601 date-time string for when the routine was created. */
  private _createdAt: string;

  get createdAt(): string { return this._createdAt; }

  /** List of routine items belonging to this routine. */
  private _items: RoutineItem[];

  get items(): RoutineItem[] { return this._items; }
  set items(value: RoutineItem[]) { this._items = value; }

  /**
   * Returns true if the routine is currently active.
   */
  get isActive(): boolean {
    return this._status === RoutineStatus.Active;
  }

  /**
   * Returns the number of items in this routine.
   */
  get itemCount(): number {
    return this._items.length;
  }

  /**
   * Returns a display-friendly formatted creation date.
   * @returns Formatted date as 'MMM DD, YYYY'.
   */
  get formattedCreatedAt(): string {
    return new Date(this._createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day:   '2-digit',
      year:  'numeric',
    });
  }
}
