import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { FacialScan } from '../domain/model/facial-scan.entity';
import { FacialScanResource, FacialScansResponse } from './facial-scan.response';
import { FacialScanAssembler } from './facial-scan.assembler';
import { environment } from '../../../environments/environment';

export class FacialScansApiEndpoint extends BaseApiEndpoint<
  FacialScan,
  FacialScanResource,
  FacialScansResponse,
  FacialScanAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.backendBasePath}${environment.backendFacialScansEndpointPath}`,
      new FacialScanAssembler(),
    );
  }

  startFacialScan(patientId: number): Observable<FacialScan> {
    return this.http
      .post<FacialScanResource>(this.endpointUrl, { patientId })
      .pipe(
        map(resource => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to start facial scan')),
      );
  }

  submitFacialScan(facialScanId: number, photoUrl: string): Observable<FacialScan> {
    return this.http
      .put<FacialScanResource>(`${this.endpointUrl}/${facialScanId}/submit`, { photoUrl })
      .pipe(
        map(resource => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to submit facial scan')),
      );
  }

  getByPatientId(patientId: number): Observable<FacialScan[]> {
    return this.http
      .get<FacialScanResource[]>(`${this.endpointUrl}/patient/${patientId}`)
      .pipe(
        map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
        catchError(this.handleError('Failed to fetch facial scans by patient')),
      );
  }
}
