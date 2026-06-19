import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { SkinAnalysis } from '../domain/model/skin-analysis.entity';
import { SkinAnalysisResource, SkinAnalysesResponse } from './skin-analysis.response';
import { SkinAnalysisAssembler } from './skin-analysis.assembler';
import { environment } from '../../../environments/environment';

export class SkinAnalysesApiEndpoint extends BaseApiEndpoint<
  SkinAnalysis,
  SkinAnalysisResource,
  SkinAnalysesResponse,
  SkinAnalysisAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.backendBasePath}${environment.backendSkinAnalysesEndpointPath}`,
      new SkinAnalysisAssembler(),
    );
  }

  getByFacialScanId(facialScanId: number): Observable<SkinAnalysis> {
    return this.http
      .get<SkinAnalysisResource>(`${this.endpointUrl}/facial-scan/${facialScanId}`)
      .pipe(
        map(resource => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to fetch skin analysis by facial scan')),
      );
  }
}
