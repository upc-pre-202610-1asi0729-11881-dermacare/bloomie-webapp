import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { FacialScan, FacialScanStatus } from '../domain/model/facial-scan.entity';
import { FacialScanResource, FacialScansResponse } from './facial-scan.response';

/**
 * Maps FacialScan entities to and from API resources.
 */
export class FacialScanAssembler implements BaseAssembler<
  FacialScan,
  FacialScanResource,
  FacialScansResponse
> {
  /**
   * Converts a FacialScansResponse to an array of FacialScan entities.
   * @param response - The API response containing facial scans.
   * @returns An array of FacialScan entities.
   */
  toEntitiesFromResponse(response: FacialScansResponse): FacialScan[] {
    return response.facial_scans.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts a FacialScanResource to a FacialScan entity.
   * @param resource - The resource to convert.
   * @returns The converted FacialScan entity.
   */
  toEntityFromResource(resource: FacialScanResource): FacialScan {
    return new FacialScan({
      id: resource.id,
      userId: resource.user_id,
      skinProfileId: resource.skin_profile_id,
      imageUrl: resource.image_url,
      diagnosis: resource.diagnosis,
      overallScore: resource.overall_score,
      hydrationScore: resource.hydration_score,
      textureScore: resource.texture_score,
      sensitivityScore: resource.sensitivity_score,
      brightnessScore: resource.brightness_score,
      scannedAt: resource.scanned_at,
      status: resource.status as FacialScanStatus,
    });
  }

  /**
   * Converts a FacialScan entity to a FacialScanResource.
   * @param entity - The entity to convert.
   * @returns The converted FacialScanResource.
   */
  toResourceFromEntity(entity: FacialScan): FacialScanResource {
    return {
      id: entity.id,
      user_id: entity.userId,
      skin_profile_id: entity.skinProfileId,
      image_url: entity.imageUrl,
      diagnosis: entity.diagnosis,
      overall_score: entity.overallScore,
      hydration_score: entity.hydrationScore,
      texture_score: entity.textureScore,
      sensitivity_score: entity.sensitivityScore,
      brightness_score: entity.brightnessScore,
      scanned_at: entity.scannedAt,
      status: entity.status,
    } as FacialScanResource;
  }
}
