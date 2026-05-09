import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {DermatologistAvailability} from '../domain/model/dermatologist-availability.entity';
import {DermatologistAvailabilityResource, DermatologistAvailabilitiesResponse} from './dermatologist-availability.response';
import {DermatologistAvailabilityAssembler} from './dermatologist-availability.assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for dermatologist availability CRUD operations.
 */
export class DermatologistAvailabilitiesApiEndpoint extends BaseApiEndpoint<DermatologistAvailability, DermatologistAvailabilityResource, DermatologistAvailabilitiesResponse, DermatologistAvailabilityAssembler> {

  /**
   * Creates an instance of DermatologistAvailabilitiesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBasePath}${environment.dermatologistAvailabilitiesEndpointPath}`,
      new DermatologistAvailabilityAssembler()
    );
  }
}
