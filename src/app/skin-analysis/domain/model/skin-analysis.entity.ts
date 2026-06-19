import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class SkinAnalysis implements BaseEntity {
  constructor(props: {
    id: number;
    patientId: number;
    facialScanId: number;
    overallScore: number;
    hydrationScore: number;
    textureScore: number;
    sensitivityScore: number;
    brightnessScore: number;
    status: string;
    analyzedAt: string;
  }) {
    this._id = props.id;
    this._patientId = props.patientId;
    this._facialScanId = props.facialScanId;
    this._overallScore = props.overallScore;
    this._hydrationScore = props.hydrationScore;
    this._textureScore = props.textureScore;
    this._sensitivityScore = props.sensitivityScore;
    this._brightnessScore = props.brightnessScore;
    this._status = props.status;
    this._analyzedAt = props.analyzedAt;
  }

  private _id: number;
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  private _patientId: number;
  get patientId(): number { return this._patientId; }

  private _facialScanId: number;
  get facialScanId(): number { return this._facialScanId; }

  private _overallScore: number;
  get overallScore(): number { return this._overallScore; }

  private _hydrationScore: number;
  get hydrationScore(): number { return this._hydrationScore; }

  private _textureScore: number;
  get textureScore(): number { return this._textureScore; }

  private _sensitivityScore: number;
  get sensitivityScore(): number { return this._sensitivityScore; }

  private _brightnessScore: number;
  get brightnessScore(): number { return this._brightnessScore; }

  private _status: string;
  get status(): string { return this._status; }

  private _analyzedAt: string;
  get analyzedAt(): string { return this._analyzedAt; }

  get averageScore(): number {
    const total = this._overallScore + this._hydrationScore + this._textureScore
      + this._sensitivityScore + this._brightnessScore;
    return Math.round((total / 5) * 10) / 10;
  }
}
