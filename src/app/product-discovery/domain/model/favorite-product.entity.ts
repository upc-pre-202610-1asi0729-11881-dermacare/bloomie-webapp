import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Represents a product that a user has saved to their favorites list.
 */
export class FavoriteProduct implements BaseEntity {

  /**
   * Creates a new FavoriteProduct entity.
   * @param props - Initialization values for the favorite product record.
   */
  constructor(props: {
    id:        number;
    userId:    number;
    productId: number;
    savedAt:   string;
  }) {
    this._id        = props.id;
    this._userId    = props.userId;
    this._productId = props.productId;
    this._savedAt   = props.savedAt;
  }

  /** Unique identifier for the favorite product record. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** Identifier of the user who saved the product. */
  private _userId: number;

  get userId(): number { return this._userId; }

  /** Identifier of the product that was saved. */
  private _productId: number;

  get productId(): number { return this._productId; }

  /** ISO 8601 date-time string for when the product was saved as a favorite. */
  private _savedAt: string;

  get savedAt(): string { return this._savedAt; }

  /**
   * Returns true if this favorite record belongs to the given user.
   * @param userId - The user identifier to check against.
   */
  belongsToUser(userId: number): boolean {
    return this._userId === userId;
  }

  /**
   * Returns true if this favorite record corresponds to the given product.
   * @param productId - The product identifier to check against.
   */
  matchesProduct(productId: number): boolean {
    return this._productId === productId;
  }

  /**
   * Returns a formatted date string for when the product was saved.
   * @returns Date formatted as 'MMM DD, YYYY'.
   */
  get formattedSavedAt(): string {
    return new Date(this._savedAt).toLocaleDateString('en-US', {
      month: 'short',
      day:   '2-digit',
      year:  'numeric',
    });
  }
}
