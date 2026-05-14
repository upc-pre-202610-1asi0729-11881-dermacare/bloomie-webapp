import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents the AI's recommended next action for the user
 * based on their skin analysis and conversation context.
 */
export enum SuggestedAction {
  ContinueRoutine = 'CONTINUE_ROUTINE',
  ChangeProduct = 'CHANGE_PRODUCT',
  SuggestDermatologyConsultation = 'SUGGEST_DERMATOLOGY_CONSULTATION',
}

/**
 * Represents the lifecycle status of a support query session.
 */
export enum SupportQueryStatus {
  InProgress = 'IN_PROGRESS',
  AwaitingAi = 'AWAITING_AI',
  Resolved = 'RESOLVED',
  Unresolved = 'UNRESOLVED',
}

/**
 * Represents an AI-powered skincare support session linked to
 * a user's skin profile and most recent facial scan.
 */
export class SupportQuery implements BaseEntity {
  /**
   * Creates a new SupportQuery entity.
   * @param props - Initialization values for the support query.
   */
  constructor(props: {
    id: number;
    userId: number;
    skinProfileId: number;
    lastFacialScanId: number;
    suggestedAction: SuggestedAction;
    status: SupportQueryStatus;
    createdAt: string;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._skinProfileId = props.skinProfileId;
    this._lastFacialScanId = props.lastFacialScanId;
    this._suggestedAction = props.suggestedAction;
    this._status = props.status;
    this._createdAt = props.createdAt;
  }

  /** Unique identifier for the support query. */
  private _id: number;

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  /** Identifier of the user who initiated this support query. */
  private _userId: number;

  get userId(): number {
    return this._userId;
  }

  /** Identifier of the skin profile linked to this support query. */
  private _skinProfileId: number;

  get skinProfileId(): number {
    return this._skinProfileId;
  }

  /** Identifier of the most recent facial scan associated with this query. */
  private _lastFacialScanId: number;

  get lastFacialScanId(): number {
    return this._lastFacialScanId;
  }

  /** AI-recommended next action derived from the conversation context. */
  private _suggestedAction: SuggestedAction;

  get suggestedAction(): SuggestedAction {
    return this._suggestedAction;
  }
  set suggestedAction(value: SuggestedAction) {
    this._suggestedAction = value;
  }

  /** Current lifecycle status of the support query. */
  private _status: SupportQueryStatus;

  get status(): SupportQueryStatus {
    return this._status;
  }
  set status(value: SupportQueryStatus) {
    this._status = value;
  }

  /** ISO 8601 date-time string for when the support query was created. */
  private _createdAt: string;

  get createdAt(): string {
    return this._createdAt;
  }

  /**
   * Returns true if the query is still being handled.
   */
  get isInProgress(): boolean {
    return this._status === SupportQueryStatus.InProgress;
  }

  /**
   * Returns true if the query has been successfully resolved.
   */
  get isResolved(): boolean {
    return this._status === SupportQueryStatus.Resolved;
  }

  /**
   * Returns true if the AI is currently generating a response.
   */
  get isAwaitingAi(): boolean {
    return this._status === SupportQueryStatus.AwaitingAi;
  }

  /**
   * Returns true if the AI's suggested action recommends
   * booking a professional dermatology consultation.
   */
  get requiresDermatologyConsultation(): boolean {
    return this._suggestedAction === SuggestedAction.SuggestDermatologyConsultation;
  }

  /**
   * Returns a display-friendly formatted date for when the query was created.
   * @returns Formatted date as 'MMM DD, YYYY'.
   */
  get formattedCreatedAt(): string {
    return new Date(this._createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }
}
