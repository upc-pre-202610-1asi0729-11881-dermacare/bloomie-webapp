import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {RoutineItem} from '../../../../../Downloads/routine-management/domain/model/routine-item.entity';
import {RoutineItemResource, RoutineItemsResponse} from '../../../../../Downloads/routine-management/infrastructure/routine-item.response';
import {RoutineItemAssembler} from './routine-item.assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for routine item CRUD operations.
 */
export class RoutineItemsApiEndpoint extends BaseApiEndpoint<RoutineItem, RoutineItemResource, RoutineItemsResponse, RoutineItemAssembler> {

  /**
   * Creates an instance of RoutineItemsApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBasePath}${environment.routineItemsEndpointPath}`,
      new RoutineItemAssembler()
    );
  }
}
