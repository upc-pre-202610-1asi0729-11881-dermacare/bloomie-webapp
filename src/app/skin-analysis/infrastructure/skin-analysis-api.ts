import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { FacialScan } from '../domain/model/facial-scan.entity';
import { SkinProfile } from '../domain/model/skin-profile.entity';
import { FacialScansApiEndpoint } from './facial-scans-api-endpoint';
import { SkinProfilesApiEndpoint } from './skin-profiles-api-endpoint';

/**
 * Infrastructure facade for skin analysis endpoint operations.
 */
@Injectable({ providedIn: 'root' })
export class SkinAnalysisApi extends BaseApi {
  private readonly facialScansEndpoint: FacialScansApiEndpoint;
  private readonly skinProfilesEndpoint: SkinProfilesApiEndpoint;

  /**
   * Creates an instance of SkinAnalysisApi.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super();
    this.facialScansEndpoint = new FacialScansApiEndpoint(http);
    this.skinProfilesEndpoint = new SkinProfilesApiEndpoint(http);
  }

  /**
   * Retrieves all facial scans.
   * @returns Stream with the facial scan collection.
   */
  getFacialScans(): Observable<FacialScan[]> {
    return this.facialScansEndpoint.getAll();
  }

  /**
   * Retrieves a single facial scan by ID.
   * @param id - The ID of the facial scan.
   * @returns Stream with the matched FacialScan entity.
   */
  getFacialScan(id: number): Observable<FacialScan> {
    return this.facialScansEndpoint.getById(id);
  }

  /**
   * Creates a new facial scan.
   * @param facialScan - The facial scan to create.
   * @returns Stream with the created FacialScan entity.
   */
  createFacialScan(facialScan: FacialScan): Observable<FacialScan> {
    return this.facialScansEndpoint.create(facialScan);
  }

  /**
   * Updates an existing facial scan.
   * @param facialScan - The facial scan to update.
   * @returns Stream with the updated FacialScan entity.
   */
  updateFacialScan(facialScan: FacialScan): Observable<FacialScan> {
    return this.facialScansEndpoint.update(facialScan, facialScan.id);
  }

  /**
   * Retrieves all skin profiles.
   * @returns Stream with the skin profile collection.
   */
  getSkinProfiles(): Observable<SkinProfile[]> {
    return this.skinProfilesEndpoint.getAll();
  }

  /**
   * Retrieves a single skin profile by ID.
   * @param id - The ID of the skin profile.
   * @returns Stream with the matched SkinProfile entity.
   */
  getSkinProfile(id: number): Observable<SkinProfile> {
    return this.skinProfilesEndpoint.getById(id);
  }

  /**
   * Creates a new skin profile.
   * @param skinProfile - The skin profile to create.
   * @returns Stream with the created SkinProfile entity.
   */
  createSkinProfile(skinProfile: SkinProfile): Observable<SkinProfile> {
    return this.skinProfilesEndpoint.create(skinProfile);
  }

  /**
   * Updates an existing skin profile.
   * @param skinProfile - The skin profile to update.
   * @returns Stream with the updated SkinProfile entity.
   */
  updateSkinProfile(skinProfile: SkinProfile): Observable<SkinProfile> {
    return this.skinProfilesEndpoint.update(skinProfile, skinProfile.id);
  }
}
