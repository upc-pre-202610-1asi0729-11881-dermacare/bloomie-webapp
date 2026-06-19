import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { FacialScan, FacialScanStatus } from '../domain/model/facial-scan.entity';
import { FacialScanResource, FacialScansResponse } from './facial-scan.response';

export class FacialScanAssembler implements BaseAssembler<
  FacialScan,
  FacialScanResource,
  FacialScansResponse
> {
  toEntitiesFromResponse(response: FacialScansResponse): FacialScan[] {
    return response.facialScans.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: FacialScanResource): FacialScan {
    return new FacialScan({
      id: resource.id,
      patientId: resource.patientId,
      status: resource.status as FacialScanStatus,
      photoUrl: resource.photoUrl,
      scannedAt: resource.scannedAt,
    });
  }

  toResourceFromEntity(entity: FacialScan): FacialScanResource {
    return {
      id: entity.id,
      patientId: entity.patientId,
      status: entity.status,
      photoUrl: entity.photoUrl,
      scannedAt: entity.scannedAt,
    } as FacialScanResource;
  }
}
