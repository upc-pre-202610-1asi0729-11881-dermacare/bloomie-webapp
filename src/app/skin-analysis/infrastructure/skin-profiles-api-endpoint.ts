import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { SkinProfile } from '../domain/model/skin-profile.entity';
import { SkinProfileResource, SkinProfilesResponse } from './skin-profile.response';
import { SkinProfileAssembler } from './skin-profile.assembler';
import { environment } from '../../../environments/environment';

export class SkinProfilesApiEndpoint extends BaseApiEndpoint<
  SkinProfile,
  SkinProfileResource,
  SkinProfilesResponse,
  SkinProfileAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.backendBasePath}${environment.backendSkinProfilesEndpointPath}`,
      new SkinProfileAssembler(),
    );
  }

  getByPatientId(patientId: number): Observable<SkinProfile> {
    return this.http
      .get<SkinProfileResource>(`${this.endpointUrl}/patient/${patientId}`)
      .pipe(
        map(resource => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to fetch skin profile by patient')),
      );
  }

  createFromLifestyleForm(data: {
    patientId:   number;
    skinType:    string;
    sensitivity: string;
    waterIntake: string;
    sunExposure: string;
    sleepHours:  string;
  }): Observable<SkinProfile> {
    return this.http.post<SkinProfileResource>(this.endpointUrl, data).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to create skin profile'))
    );
  }
}
