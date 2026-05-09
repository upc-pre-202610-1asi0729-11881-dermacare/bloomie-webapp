import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {DermatologistProfile} from '../domain/model/dermatologist-profile.entity';
import {DermatologistProfileResource, DermatologistProfilesResponse} from './dermatologist-profile.response';
import {DermatologistProfileAssembler} from './dermatologist-profile.assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for dermatologist profile CRUD operations.
 */
export class DermatologistProfilesApiEndpoint extends BaseApiEndpoint<DermatologistProfile, DermatologistProfileResource, DermatologistProfilesResponse, DermatologistProfileAssembler> {

  /**
   * Creates an instance of DermatologistProfilesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBasePath}${environment.dermatologistProfilesEndpointPath}`,
      new DermatologistProfileAssembler()
    );
  }
}
