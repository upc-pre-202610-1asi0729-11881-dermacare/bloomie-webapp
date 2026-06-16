import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {DermatologistAvailability} from '../domain/model/dermatologist-availability.entity';
import {DermatologistAvailabilityResource, DermatologistAvailabilitiesResponse} from './dermatologist-availability.response';
import {DermatologistAvailabilityAssembler} from './dermatologist-availability.assembler';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for dermatologist availability CRUD operations.
 */
export class DermatologistAvailabilitiesApiEndpoint extends BaseApiEndpoint<DermatologistAvailability, DermatologistAvailabilityResource, DermatologistAvailabilitiesResponse, DermatologistAvailabilityAssembler> {

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.backendBasePath}${environment.backendAvailabilitiesEndpointPath}`,
      new DermatologistAvailabilityAssembler()
    );
  }

  /**
   * Retrieves availability slots for a specific dermatologist.
   * @param dermatologistId - The dermatologist user ID to filter by.
   * @returns Stream with the filtered availability collection.
   */
  getByDermatologistId(dermatologistId: number): Observable<DermatologistAvailability[]> {
    return this.http.get<DermatologistAvailabilityResource[]>(
      `${this.endpointUrl}?dermatologistId=${dermatologistId}`
    ).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch availabilities for dermatologist'))
    );
  }
}
