import { Injectable }   from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { BaseApi }      from '../../shared/infrastructure/base-api';
import { UserResource } from './user.response';
import { DermatologistResource } from './dermatologist.response';
import { AuthResponse }      from './auth.response';
import { IamApiEndpoint }    from './iam-api-endpoint';

/**
 * Infrastructure facade for IAM authentication operations.
 *
 * @remarks
 * Composes the {@link IamApiEndpoint} and exposes use-case oriented methods
 * to the application layer ({@link IamStore}). Keeping the facade thin allows
 * the store to stay focused on application state without leaking transport
 * details such as endpoint URLs or HTTP verbs.
 */
@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {

  private readonly iamEndpoint: IamApiEndpoint;

  /**
   * Creates an instance of IamApi.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super();
    this.iamEndpoint = new IamApiEndpoint(http);
  }

  /**
   * Authenticates a user against the IAM backend.
   * @param email - Email address of the account.
   * @param password - Plain text password provided by the user.
   * @returns Stream emitting the {@link AuthResponse} envelope on success.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.iamEndpoint.login(email, password);
  }

  /**
   * Registers a new young adult account.
   * @param resource - User resource carrying the registration payload.
   * @returns Stream emitting the {@link AuthResponse} envelope on success.
   */
  registerYoungAdult(resource: UserResource): Observable<AuthResponse> {
    return this.iamEndpoint.registerYoungAdult(resource);
  }

  /**
   * Registers a new dermatologist account.
   * @param resource - Dermatologist resource carrying the registration payload.
   * @returns Stream emitting the {@link AuthResponse} envelope on success.
   */
  registerDermatologist(resource: DermatologistResource): Observable<AuthResponse> {
    return this.iamEndpoint.registerDermatologist(resource);
  }
}
