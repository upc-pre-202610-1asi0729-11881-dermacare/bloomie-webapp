import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Represents the ordered steps within a skincare routine.
 * Values match the backend step identifiers.
 */
export enum RoutineStep {
  Cleanser    = 'CLEANSER',
  Toner       = 'TONER',
  Serum       = 'SERUM',
  Essence     = 'ESSENCE',
  Moisturizer = 'MOISTURIZER',
  Sunscreen   = 'SUNSCREEN',
}

/**
 * Represents a single product step within a skincare routine.
 * Items are owned by the Routine aggregate and carry no independent routineId.
 */
export class RoutineItem implements BaseEntity {

  /**
   * Creates a new RoutineItem entity.
   * @param props - Initialization values for the routine item.
   */
  constructor(props: {
    id:                    number;
    step:                  RoutineStep;
    order:                 number;
    scheduledTime:         string;
    productRecommendation: string;
  }) {
    this._id                    = props.id;
    this._step                  = props.step;
    this._order                 = props.order;
    this._scheduledTime         = props.scheduledTime;
    this._productRecommendation = props.productRecommendation;
  }

  /** Unique identifier for the routine item. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** The skincare step this item corresponds to. */
  private _step: RoutineStep;

  get step(): RoutineStep { return this._step; }

  /** Display order of this item within the routine. */
  private _order: number;

  get order(): number { return this._order; }

  /** Scheduled time of day for applying this product (e.g. 'AM', 'PM', 'AM_PM'). */
  private _scheduledTime: string;

  get scheduledTime(): string { return this._scheduledTime; }

  /** Recommended product name for this step. */
  private _productRecommendation: string;

  get productRecommendation(): string { return this._productRecommendation; }

  /**
   * Returns a display-friendly label for the step name.
   * Converts enum value to title case (e.g. 'CLEANSER' → 'Cleanser').
   */
  get stepLabel(): string {
    const step = this._step as string;
    return step.charAt(0).toUpperCase() + step.slice(1).toLowerCase();
  }
}
