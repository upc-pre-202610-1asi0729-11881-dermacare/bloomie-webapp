import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Routine} from '../domain/model/routine.entity';
import { RoutineResource, RoutinesResponse } from './routine.response';
import {RoutineAssembler} from './routine.assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for routine CRUD operations.
 */
export class RoutinesApiEndpoint extends BaseApiEndpoint<Routine, RoutineResource, RoutinesResponse, RoutineAssembler> {

  /**
   * Creates an instance of RoutinesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBasePath}${environment.routinesEndpointPath}`,
      new RoutineAssembler()
    );
  }
}
