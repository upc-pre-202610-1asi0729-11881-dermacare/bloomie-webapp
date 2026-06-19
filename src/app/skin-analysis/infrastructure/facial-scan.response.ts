import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface FacialScanResource extends BaseResource {
  id: number;
  patientId: number;
  status: string;
  photoUrl: string;
  scannedAt: string;
}

export interface FacialScansResponse extends BaseResponse {
  facialScans: FacialScanResource[];
}
