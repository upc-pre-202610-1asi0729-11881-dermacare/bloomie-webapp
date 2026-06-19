import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SkinProfileResource extends BaseResource {
  id: number;
  patientId: number;
  skinType: string;
  sensitivity: string;
  waterIntake: number;
  sunExposure: number;
  sleepHours: number;
  status: string;
}

export interface SkinProfilesResponse extends BaseResponse {
  skinProfiles: SkinProfileResource[];
}
