import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Represents the ordered steps within a skincare routine.
 */
export enum RoutineStep {
  Cleanse     = 'CLEANSE',
  Essence     = 'ESSENCE',
  Toner       = 'TONER',
  Moisturizer = 'MOISTURIZER',
  Sunscreen   = 'SUNSCREEN',
}


/**
 * Represents a single product step within a skincare routine.
 */
export class RoutineItem implements BaseEntity {

  /**
   * Creates a new RoutineItem entity.
   * @param props - Initialization values for the routine item.
   */
  constructor(props: {
    id:            number;
    routineId:     number;
    productId:     number;
    step:          RoutineStep;
    scheduledTime: string;
    status:        string;
    order:         number;
  }) {
    this._id            = props.id;
    this._routineId     = props.routineId;
    this._productId     = props.productId;
    this._step          = props.step;
    this._scheduledTime = props.scheduledTime;
    this._status        = props.status;
    this._order         = props.order;
  }

  /** Unique identifier for the routine item. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** Identifier of the routine this item belongs to. */
  private _routineId: number;

  get routineId(): number { return this._routineId; }

  /** Identifier of the product used in this step. */
  private _productId: number;

  get productId(): number { return this._productId; }

  /** The skincare step this item corresponds to. */
  private _step: RoutineStep;

  get step(): RoutineStep { return this._step; }

  /** Scheduled time of day for applying this product (e.g. '08:00'). */
  private _scheduledTime: string;

  get scheduledTime(): string { return this._scheduledTime; }

  /** Current application status of this item. */
  private _status: string;

  get status(): string { return this._status; }

  /** Display order of this item within the routine. */
  private _order: number;

  get order(): number { return this._order; }

  /**
   * Returns a display-friendly label for the step name.
   * Converts enum value to title case (e.g. 'CLEANSE' → 'Cleanse').
   */
  get stepLabel(): string {
    return this._step.charAt(0).toUpperCase() + this._step.slice(1).toLowerCase();
  }
}
