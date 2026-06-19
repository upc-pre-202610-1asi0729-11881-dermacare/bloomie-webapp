import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { FacialScan } from '../domain/model/facial-scan.entity';
import { SkinProfile } from '../domain/model/skin-profile.entity';
import { SkinAnalysis } from '../domain/model/skin-analysis.entity';
import { FacialScansApiEndpoint } from './facial-scans-api-endpoint';
import { SkinProfilesApiEndpoint } from './skin-profiles-api-endpoint';
import { SkinAnalysesApiEndpoint } from './skin-analyses-api-endpoint';

@Injectable({ providedIn: 'root' })
export class SkinAnalysisApi extends BaseApi {
  private readonly facialScansEndpoint: FacialScansApiEndpoint;
  private readonly skinProfilesEndpoint: SkinProfilesApiEndpoint;
  private readonly skinAnalysesEndpoint: SkinAnalysesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.facialScansEndpoint = new FacialScansApiEndpoint(http);
    this.skinProfilesEndpoint = new SkinProfilesApiEndpoint(http);
    this.skinAnalysesEndpoint = new SkinAnalysesApiEndpoint(http);
  }

  startFacialScan(patientId: number): Observable<FacialScan> {
    return this.facialScansEndpoint.startFacialScan(patientId);
  }

  submitFacialScan(facialScanId: number, photoUrl: string): Observable<FacialScan> {
    return this.facialScansEndpoint.submitFacialScan(facialScanId, photoUrl);
  }

  getFacialScansByPatientId(patientId: number): Observable<FacialScan[]> {
    return this.facialScansEndpoint.getByPatientId(patientId);
  }

  getSkinProfileByPatientId(patientId: number): Observable<SkinProfile> {
    return this.skinProfilesEndpoint.getByPatientId(patientId);
  }

  updateSkinProfile(skinProfile: SkinProfile): Observable<SkinProfile> {
    return this.skinProfilesEndpoint.update(skinProfile, skinProfile.id);
  }

  getSkinAnalysisByFacialScanId(facialScanId: number): Observable<SkinAnalysis> {
    return this.skinAnalysesEndpoint.getByFacialScanId(facialScanId);
  }
}
