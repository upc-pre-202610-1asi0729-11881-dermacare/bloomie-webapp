import {BaseEntity} from '../../../shared/infrastructure/base-entity';

/**
 * Minimum compatibility score (0–100) considered a good match for a skin profile.
 */
const GOOD_COMPATIBILITY_THRESHOLD  = 60;

/**
 * Minimum compatibility score (0–100) considered an excellent match for a skin profile.
 */
const EXCELLENT_COMPATIBILITY_THRESHOLD = 85;

/**
 * Represents the AI-generated compatibility evaluation between a product
 * and a specific skin profile derived from a facial scan.
 */
export class ProductCompatibility implements BaseEntity {

  /**
   * Creates a new ProductCompatibility entity.
   * @param props - Initialization values for the compatibility record.
   */
  constructor(props: {
    id:                 number;
    productId:          number;
    facialScanId:       number;
    skinProfileId:      number;
    compatibilityScore: number;
    explanation:        string;
    evaluatedAt:        string;
  }) {
    this._id                 = props.id;
    this._productId          = props.productId;
    this._facialScanId       = props.facialScanId;
    this._skinProfileId      = props.skinProfileId;
    this._compatibilityScore = props.compatibilityScore;
    this._explanation        = props.explanation;
    this._evaluatedAt        = props.evaluatedAt;
  }

  /** Unique identifier for the compatibility record. */
  private _id: number;

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /** Identifier of the product being evaluated. */
  private _productId: number;

  get productId(): number { return this._productId; }

  /** Identifier of the facial scan used in the evaluation. */
  private _facialScanId: number;

  get facialScanId(): number { return this._facialScanId; }

  /** Identifier of the skin profile this evaluation belongs to. */
  private _skinProfileId: number;

  get skinProfileId(): number { return this._skinProfileId; }

  /**
   * Numeric score from 0 to 100 representing how compatible
   * the product is with the user's skin profile.
   */
  private _compatibilityScore: number;

  get compatibilityScore(): number { return this._compatibilityScore; }

  /** AI-generated explanation of the compatibility result. */
  private _explanation: string;

  get explanation(): string { return this._explanation; }

  /** ISO 8601 date-time string for when the evaluation was performed. */
  private _evaluatedAt: string;

  get evaluatedAt(): string { return this._evaluatedAt; }

  /**
   * Returns true if the compatibility score qualifies as an excellent match.
   * Threshold: score >= 85.
   */
  get isExcellentMatch(): boolean {
    return this._compatibilityScore >= EXCELLENT_COMPATIBILITY_THRESHOLD;
  }

  /**
   * Returns true if the compatibility score qualifies as at least a good match.
   * Threshold: score >= 60.
   */
  get isGoodMatch(): boolean {
    return this._compatibilityScore >= GOOD_COMPATIBILITY_THRESHOLD;
  }

  /**
   * Returns a human-readable compatibility label based on the score.
   * - Excellent match: score >= 85
   * - Good match:      score >= 60
   * - Low compatibility: score < 60
   */
  get compatibilityLabel(): string {
    if (this._compatibilityScore >= EXCELLENT_COMPATIBILITY_THRESHOLD) return 'Excellent match';
    if (this._compatibilityScore >= GOOD_COMPATIBILITY_THRESHOLD)      return 'Good match';
    return 'Low compatibility';
  }

  /**
   * Returns the hex color associated with the compatibility level.
   * - Excellent: green (#4a9a4a)
   * - Good:      amber (#c8a030)
   * - Low:       red   (#c8302a)
   */
  get compatibilityColor(): string {
    if (this._compatibilityScore >= EXCELLENT_COMPATIBILITY_THRESHOLD) return '#4a9a4a';
    if (this._compatibilityScore >= GOOD_COMPATIBILITY_THRESHOLD)      return '#c8a030';
    return '#c8302a';
  }

  /**
   * Returns a formatted date string for when the evaluation was performed.
   * @returns Date formatted as 'MMM DD, YYYY'.
   */
  get formattedEvaluatedAt(): string {
    return new Date(this._evaluatedAt).toLocaleDateString('en-US', {
      month: 'short',
      day:   '2-digit',
      year:  'numeric',
    });
  }
}
