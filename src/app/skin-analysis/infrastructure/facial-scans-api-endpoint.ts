import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { FacialScan } from '../domain/model/facial-scan.entity';
import { FacialScanResource, FacialScansResponse } from './facial-scan.response';
import { FacialScanAssembler } from './facial-scan.assembler';
import { environment } from '../../../environments/environment';

/**
 * Endpoint client for facial scan CRUD operations.
 */
export class FacialScansApiEndpoint extends BaseApiEndpoint<
  FacialScan,
  FacialScanResource,
  FacialScansResponse,
  FacialScanAssembler
> {
  /**
   * Creates an instance of FacialScansApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBasePath}${environment.facialScansEndpointPath}`,
      new FacialScanAssembler(),
    );
  }
}
