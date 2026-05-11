import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import { DailyTracking } from '../domain/model/daily-tracking.entity';
import { DailyTrackingResource, DailyTrackingsResponse } from './daily-tracking.response';
import {DailyTrackingAssembler} from './daily-tracking.assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for daily tracking CRUD operations.
 */
export class DailyTrackingsApiEndpoint extends BaseApiEndpoint<DailyTracking, DailyTrackingResource, DailyTrackingsResponse, DailyTrackingAssembler> {

  /**
   * Creates an instance of DailyTrackingsApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBasePath}${environment.dailyTrackingsEndpointPath}`,
      new DailyTrackingAssembler()
    );
  }
}
