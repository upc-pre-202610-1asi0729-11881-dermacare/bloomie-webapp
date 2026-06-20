import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Routine } from '../domain/model/routine.entity';
import { RoutineResource, RoutinesResponse } from './routine.response';
import { RoutineAssembler } from './routine.assembler';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Endpoint client for routine management REST operations.
 * Base URL: GET /api/v1/routines
 */
export class RoutinesApiEndpoint extends BaseApiEndpoint<
  Routine,
  RoutineResource,
  RoutinesResponse,
  RoutineAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.backendBasePath}${environment.backendRoutinesEndpointPath}`,
      new RoutineAssembler(),
    );
  }

  /**
   * Retrieves the active routine for a patient.
   * GET /routines/patient/{patientId}
   */
  getByPatientId(patientId: number): Observable<Routine> {
    return this.http.get<RoutineResource>(`${this.endpointUrl}/patient/${patientId}`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch routine for patient')),
    );
  }

  /**
   * Retrieves 4 replacement product options for a routine item.
   * GET /routines/{routineId}/items/{routineItemId}/replacement-options
   */
  getReplacementOptions(routineId: number, routineItemId: number): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.endpointUrl}/${routineId}/items/${routineItemId}/replacement-options`,
    ).pipe(
      catchError(this.handleError('Failed to fetch replacement options')),
    );
  }

  /**
   * Removes an optional product step from a routine.
   * DELETE /routines/{routineId}/items/{routineItemId}
   * Returns the updated routine.
   */
  removeItem(routineId: number, routineItemId: number): Observable<Routine> {
    return this.http.delete<RoutineResource>(
      `${this.endpointUrl}/${routineId}/items/${routineItemId}`,
    ).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to remove routine item')),
    );
  }

  /**
   * Replaces the product recommendation for a routine item.
   * PUT /routines/{routineId}/items/{routineItemId}/replace
   * Returns the updated routine.
   */
  replaceProduct(routineId: number, routineItemId: number, newProductRecommendation: string): Observable<Routine> {
    return this.http.put<RoutineResource>(
      `${this.endpointUrl}/${routineId}/items/${routineItemId}/replace`,
      { newProductRecommendation },
    ).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to replace product')),
    );
  }
}
