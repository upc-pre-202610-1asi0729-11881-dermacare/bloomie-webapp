import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SkinAnalysisResource extends BaseResource {
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
}

export interface SkinAnalysesResponse extends BaseResponse {
  skinAnalyses: SkinAnalysisResource[];
}
