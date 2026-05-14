import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents the lifecycle states of a facial scan.
 */
export enum FacialScanStatus {
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
}

/**
 * Represents a facial scan performed by a user to analyze their skin condition.
 */
export class FacialScan implements BaseEntity {
  /**
   * Creates a new FacialScan entity.
   * @param props - Initialization values for the facial scan.
   */
  constructor(props: {
    id: number;
    userId: number;
    skinProfileId: number;
    imageUrl: string;
    diagnosis: string;
    overallScore: number;
    hydrationScore: number;
    textureScore: number;
    sensitivityScore: number;
    brightnessScore: number;
    scannedAt: string;
    status: FacialScanStatus;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._skinProfileId = props.skinProfileId;
    this._imageUrl = props.imageUrl;
    this._diagnosis = props.diagnosis;
    this._overallScore = props.overallScore;
    this._hydrationScore = props.hydrationScore;
    this._textureScore = props.textureScore;
    this._sensitivityScore = props.sensitivityScore;
    this._brightnessScore = props.brightnessScore;
    this._scannedAt = props.scannedAt;
    this._status = props.status;
  }

  /** Unique identifier for the facial scan. */
  private _id: number;

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  /** Identifier of the user who performed this scan. */
  private _userId: number;

  get userId(): number {
    return this._userId;
  }

  /** Identifier of the skin profile associated with this scan. */
  private _skinProfileId: number;

  get skinProfileId(): number {
    return this._skinProfileId;
  }

  /** URL of the uploaded facial image used for analysis. */
  private _imageUrl: string;

  get imageUrl(): string {
    return this._imageUrl;
  }

  /** Diagnosis text generated from the scan results. */
  private _diagnosis: string;

  get diagnosis(): string {
    return this._diagnosis;
  }

  /** Overall skin health score from 0 to 100. */
  private _overallScore: number;

  get overallScore(): number {
    return this._overallScore;
  }

  /** Hydration level score from 0 to 100. */
  private _hydrationScore: number;

  get hydrationScore(): number {
    return this._hydrationScore;
  }

  /** Skin texture quality score from 0 to 100. */
  private _textureScore: number;

  get textureScore(): number {
    return this._textureScore;
  }

  /** Skin sensitivity score from 0 to 100. */
  private _sensitivityScore: number;

  get sensitivityScore(): number {
    return this._sensitivityScore;
  }

  /** Skin brightness score from 0 to 100. */
  private _brightnessScore: number;

  get brightnessScore(): number {
    return this._brightnessScore;
  }

  /** ISO 8601 date-time string for when the scan was performed. */
  private _scannedAt: string;

  get scannedAt(): string {
    return this._scannedAt;
  }

  /** Current lifecycle status of the facial scan. */
  private _status: FacialScanStatus;

  get status(): FacialScanStatus {
    return this._status;
  }
  set status(value: FacialScanStatus) {
    this._status = value;
  }

  /**
   * Returns true if the scan has been successfully completed.
   */
  get isCompleted(): boolean {
    return this._status === FacialScanStatus.Completed;
  }

  /**
   * Returns true if the scan failed during processing.
   */
  get hasFailed(): boolean {
    return this._status === FacialScanStatus.Failed;
  }

  /**
   * Returns true if the scan is currently being processed.
   */
  get isInProgress(): boolean {
    return this._status === FacialScanStatus.InProgress;
  }

  /**
   * Calculates the average score across all skin metrics.
   * The average is computed from overall, hydration, texture,
   * sensitivity, and brightness scores.
   * @returns The average score rounded to one decimal place.
   */
  get averageScore(): number {
    const total =
      this._overallScore +
      this._hydrationScore +
      this._textureScore +
      this._sensitivityScore +
      this._brightnessScore;
    return Math.round((total / 5) * 10) / 10;
  }

  /**
   * Returns a display-friendly formatted date string for when the scan was performed.
   * @returns Formatted date as 'MMM DD, YYYY'.
   */
  get formattedScannedAt(): string {
    return new Date(this._scannedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }
}
