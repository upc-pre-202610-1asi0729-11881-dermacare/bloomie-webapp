import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Represents a weekly availability slot defined by a dermatologist
 * for scheduling patient appointments.
 */
export class DermatologistAvailability implements BaseEntity {

  /**
   * Creates a new DermatologistAvailability entity.
   * @param props - Initialization values for the availability slot.
   */
  constructor(props: {
    id:              number;
    dermatologistId: number;
    dayOfWeek:       string;
    startTime:       string;
    endTime:         string;
    slotDuration:    number;
  }) {
    this._id              = props.id;
    this._dermatologistId = props.dermatologistId;
    this._dayOfWeek       = props.dayOfWeek;
    this._startTime       = props.startTime;
    this._endTime         = props.endTime;
    this._slotDuration    = props.slotDuration;
  }

  /** Unique identifier for the availability slot. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** Identifier of the dermatologist who owns this slot. */
  private _dermatologistId: number;

  get dermatologistId(): number { return this._dermatologistId; }

  /** Day of the week for this availability slot (e.g. MONDAY). */
  private _dayOfWeek: string;

  get dayOfWeek(): string { return this._dayOfWeek; }
  set dayOfWeek(value: string) { this._dayOfWeek = value; }

  /** Time when the availability window starts (HH:mm format). */
  private _startTime: string;

  get startTime(): string { return this._startTime; }
  set startTime(value: string) { this._startTime = value; }

  /** Time when the availability window ends (HH:mm format). */
  private _endTime: string;

  get endTime(): string { return this._endTime; }
  set endTime(value: string) { this._endTime = value; }

  /**
   * Duration of each appointment slot in minutes.
   * Must be a positive integer.
   */
  private _slotDuration: number;

  get slotDuration(): number { return this._slotDuration; }
  set slotDuration(value: number) { this._slotDuration = value; }

  /**
   * Calculates the total number of appointment slots available in this window.
   * @returns Number of slots based on window duration and slot duration.
   */
  get totalSlots(): number {
    const [startHour, startMinute] = this._startTime.split(':').map(Number);
    const [endHour, endMinute]     = this._endTime.split(':').map(Number);
    const windowMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    return windowMinutes > 0 ? Math.floor(windowMinutes / this._slotDuration) : 0;
  }
}
