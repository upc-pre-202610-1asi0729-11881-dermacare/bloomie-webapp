import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SkinAnalysis } from '../domain/model/skin-analysis.entity';
import { SkinAnalysisResource, SkinAnalysesResponse } from './skin-analysis.response';

export class SkinAnalysisAssembler implements BaseAssembler<
  SkinAnalysis,
  SkinAnalysisResource,
  SkinAnalysesResponse
> {
  toEntitiesFromResponse(response: SkinAnalysesResponse): SkinAnalysis[] {
    return response.skinAnalyses.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: SkinAnalysisResource): SkinAnalysis {
    return new SkinAnalysis({
      id: resource.id,
      patientId: resource.patientId,
      facialScanId: resource.facialScanId,
      overallScore: resource.overallScore,
      hydrationScore: resource.hydrationScore,
      textureScore: resource.textureScore,
      sensitivityScore: resource.sensitivityScore,
      brightnessScore: resource.brightnessScore,
      status: resource.status,
      analyzedAt: resource.analyzedAt,
    });
  }

  toResourceFromEntity(entity: SkinAnalysis): SkinAnalysisResource {
    return {
      id: entity.id,
      patientId: entity.patientId,
      facialScanId: entity.facialScanId,
      overallScore: entity.overallScore,
      hydrationScore: entity.hydrationScore,
      textureScore: entity.textureScore,
      sensitivityScore: entity.sensitivityScore,
      brightnessScore: entity.brightnessScore,
      status: entity.status,
      analyzedAt: entity.analyzedAt,
    } as SkinAnalysisResource;
  }
}
