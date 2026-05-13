import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { SkinProfile } from '../domain/model/skin-profile.entity';
import { SkinProfileResource, SkinProfilesResponse } from './skin-profile.response';
import { SkinProfileAssembler } from './skin-profile.assembler';
import { environment } from '../../../environments/environment';

/**
 * Endpoint client for skin profile CRUD operations.
 */
export class SkinProfilesApiEndpoint extends BaseApiEndpoint<
  SkinProfile,
  SkinProfileResource,
  SkinProfilesResponse,
  SkinProfileAssembler
> {
  /**
   * Creates an instance of SkinProfilesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBasePath}${environment.skinProfilesEndpointPath}`,
      new SkinProfileAssembler(),
    );
  }
}
