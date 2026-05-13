import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment }      from '../../../environments/environment';
import { BaseApiEndpoint }  from '../../shared/infrastructure/base-api-endpoint';
import { User }             from '../domain/model/user.entity';
import { UserResource }     from './user.response';
import { DermatologistResource } from './dermatologist.response';
import { AuthResponse }     from './auth.response';
import { UserAssembler }    from './user.assembler';

/**
 * Endpoint client for IAM authentication operations.
 *
 * @remarks
 * Extends {@link BaseApiEndpoint} so that the shared CRUD machinery remains
 * available, while exposing the authentication-specific operations required
 * by the bounded context: login, young adult registration, and dermatologist
 * registration. Each operation delegates resource-to-entity conversion to
 * the {@link UserAssembler}.
 */
export class IamApiEndpoint extends BaseApiEndpoint<User, UserResource, AuthResponse, UserAssembler> {

  /** Endpoint URL for the login operation. */
  private readonly loginEndpointUrl: string;

  /** Endpoint URL for the young adult registration operation. */
  private readonly registerYoungAdultEndpointUrl: string;

  /** Endpoint URL for the dermatologist registration operation. */
  private readonly registerDermatologistEndpointUrl: string;

  /**
   * Creates an instance of IamApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBasePath}${environment.usersEndpointPath}`,
      new UserAssembler()
    );
    this.loginEndpointUrl                 = `${environment.serverBasePath}${environment.authenticationLoginEndpointPath}`;
    this.registerYoungAdultEndpointUrl    = `${environment.serverBasePath}${environment.authenticationRegisterYoungAdultEndpointPath}`;
    this.registerDermatologistEndpointUrl = `${environment.serverBasePath}${environment.authenticationRegisterDermatologistEndpointPath}`;
  }

  /**
   * Authenticates a user against the IAM backend.
   * @param email - Email address of the account.
   * @param password - Plain text password provided by the user.
   * @returns Stream emitting the {@link AuthResponse} envelope on success.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginEndpointUrl, { email, password }).pipe(
      map(response => response),
      catchError(this.handleError('Failed to authenticate user'))
    );
  }

  /**
   * Registers a new young adult account.
   * @param resource - User resource carrying the registration payload.
   * @returns Stream emitting the {@link AuthResponse} envelope on success.
   */
  registerYoungAdult(resource: UserResource): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.registerYoungAdultEndpointUrl, resource).pipe(
      map(response => response),
      catchError(this.handleError('Failed to register young adult'))
    );
  }

  /**
   * Registers a new dermatologist account.
   * @param resource - Dermatologist resource carrying the registration payload.
   * @returns Stream emitting the {@link AuthResponse} envelope on success.
   */
  registerDermatologist(resource: DermatologistResource): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.registerDermatologistEndpointUrl, resource).pipe(
      map(response => response),
      catchError(this.handleError('Failed to register dermatologist'))
    );
  }
}
