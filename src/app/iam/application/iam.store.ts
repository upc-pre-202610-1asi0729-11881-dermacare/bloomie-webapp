import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, retry } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../domain/model/user.entity';
import { IamApi } from '../infrastructure/iam-api';
import { UserAssembler } from '../infrastructure/user.assembler';
import { UserResource } from '../infrastructure/user.response';
import { DermatologistResource } from '../infrastructure/dermatologist.response';
import { AuthResponse } from '../infrastructure/auth.response';

/**
 * Mock credentials for local development
 */
const MOCK_CREDENTIALS = [
  {
    email: 'user@gmail.com',
    password: '12345678',
    id: 1,
    name: 'Juan',
    lastName: 'Pérez',
    role: UserRole.YoungAdult,
  },
  {
    email: 'derma@gmail.com',
    password: '12345678',
    id: 2,
    name: 'Laura',
    lastName: 'Morales',
    role: UserRole.Dermatologist,
  },
];
const MOCK_AUTHENTICATION_TOKEN = 'mock-auth-token';

/**
 * Key used to persist the authentication token in the browser session storage.
 */
const AUTHENTICATION_TOKEN_STORAGE_KEY = 'bloomie.authentication.token';

/**
 * Key used to persist the authenticated user payload in the browser session storage.
 */
const AUTHENTICATED_USER_STORAGE_KEY = 'bloomie.authentication.user';

/**
 * Holds IAM application state and coordinates authentication
 * and registration behavior across the bounded context.
 *
 * @remarks
 * The store exposes the currently authenticated user as a readonly signal
 * and offers use-case oriented methods that map directly to the actions
 * available in the presentation layer (login, logout, registration). When
 * the `useMockAuthentication` environment flag is enabled, the store
 * resolves authentication against an in-memory credential list instead of
 * calling the backend.
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly userAssembler = new UserAssembler();
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal for the currently authenticated user, or null when
   * no session is active.
   */
  readonly currentUser = this.currentUserSignal.asReadonly();

  /**
   * Readonly signal indicating whether an authentication operation is
   * currently in progress.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Readonly signal for the current authentication error message, or null
   * when the last operation succeeded.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Computed signal that resolves to true when a user session is active.
   */
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  /**
   * Creates an instance of IamStore and restores any previously persisted session.
   * @param iamApi - The API service for IAM authentication operations.
   */
  constructor(private iamApi: IamApi) {
    this.restorePersistedSession();
  }

  /**
   * Authenticates a user with email and password credentials.
   *
   * @param email - Email address provided by the user.
   * @param password - Plain text password provided by the user.
   * @remarks
   * Delegates to the mock authentication flow when the environment flag is
   * enabled, otherwise calls the backend through {@link IamApi}. On success,
   * the user is navigated to the landing route that corresponds to their role.
   */
  login(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    if (environment.useMockAuthentication) {
      this.loginWithMockCredentials(email, password);
      return;
    }

    this.iamApi
      .login(email, password)
      .pipe(retry(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.handleAuthenticationSuccess(response),
        error: (err) => this.handleAuthenticationError(err, 'Invalid email or password'),
      });
  }

  /**
   * Clears the active session and navigates the user back to the landing page.
   */
  logout(): void {
    this.currentUserSignal.set(null);
    this.errorSignal.set(null);
    sessionStorage.removeItem(AUTHENTICATION_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(AUTHENTICATED_USER_STORAGE_KEY);
    this.router.navigate(['/iam/sign-in-home']).then();
  }

  /**
   * Registers a new young adult patient account.
   *
   * @param email - Email address chosen for the new account.
   * @param password - Plain text password chosen by the user.
   * @param name - Given name of the user.
   * @param lastName - Family name of the user.
   */
  registerYoungAdult(email: string, password: string, name: string, lastName: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    if (environment.useMockAuthentication) {
      this.registerWithMockResponse(email, name, lastName, UserRole.YoungAdult);
      return;
    }

    const resource: UserResource = {
      id: 0,
      email: email,
      name: name,
      last_name: lastName,
      role: UserRole.YoungAdult,
      password_hash: password,
    };

    this.iamApi
      .registerYoungAdult(resource)
      .pipe(retry(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.handleAuthenticationSuccess(response),
        error: (err) =>
          this.handleAuthenticationError(err, 'Failed to register young adult account'),
      });
  }

  /**
   * Registers a new certified dermatologist account.
   *
   * @param email - Email address chosen for the new account.
   * @param password - Plain text password chosen by the user.
   * @param name - Given name of the dermatologist.
   * @param lastName - Family name of the dermatologist.
   * @param specialty - Medical specialty selected by the dermatologist.
   */
  registerDermatologist(
    email: string,
    password: string,
    name: string,
    lastName: string,
    specialty: string,
  ): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    if (environment.useMockAuthentication) {
      this.registerWithMockResponse(email, name, lastName, UserRole.Dermatologist);
      return;
    }

    const resource: DermatologistResource = {
      id: 0,
      email: email,
      name: name,
      last_name: lastName,
      role: UserRole.Dermatologist,
      password_hash: password,
      specialty: specialty,
    };

    this.iamApi
      .registerDermatologist(resource)
      .pipe(retry(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.handleAuthenticationSuccess(response),
        error: (err) =>
          this.handleAuthenticationError(err, 'Failed to register dermatologist account'),
      });
  }

  /**
   * Resolves an authentication attempt against the in-memory mock credentials.
   *
   * @param email - Email address typed by the user.
   * @param password - Password typed by the user.
   */
  private loginWithMockCredentials(email: string, password: string): void {
    const normalizedEmail = email.trim().toLowerCase();
    const match = MOCK_CREDENTIALS.find(
      (credential) =>
        credential.email.toLowerCase() === normalizedEmail && credential.password === password,
    );

    if (!match) {
      this.handleAuthenticationError(new Error('Invalid credentials'), 'Invalid email or password');
      return;
    }

    const response: AuthResponse = {
      token: MOCK_AUTHENTICATION_TOKEN,
      user: {
        id: match.id,
        email: match.email,
        name: match.name,
        last_name: match.lastName,
        role: match.role,
        password_hash: '',
      },
    };

    of(response)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (authResponse) => this.handleAuthenticationSuccess(authResponse),
      });
  }

  /**
   * Builds a synthetic authentication response for a successful mock registration.
   *
   * @param email - Email registered by the user.
   * @param name - Given name registered by the user.
   * @param lastName - Family name registered by the user.
   * @param role - Role assigned to the new account.
   */
  private registerWithMockResponse(
    email: string,
    name: string,
    lastName: string,
    role: UserRole,
  ): void {
    const response: AuthResponse = {
      token: MOCK_AUTHENTICATION_TOKEN,
      user: {
        id: Date.now(),
        email: email,
        name: name,
        last_name: lastName,
        role: role,
        password_hash: '',
      },
    };

    of(response)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (authResponse) => this.handleAuthenticationSuccess(authResponse),
      });
  }

  /**
   * Applies a successful authentication response to the store and navigates
   * the user to the entry point that corresponds to their role.
   *
   * @param response - Authentication envelope returned by the API or mock layer.
   */
  private handleAuthenticationSuccess(response: AuthResponse): void {
    const user = this.userAssembler.toEntityFromResource(response.user);
    this.currentUserSignal.set(user);
    this.loadingSignal.set(false);
    this.errorSignal.set(null);

    sessionStorage.setItem(AUTHENTICATION_TOKEN_STORAGE_KEY, response.token);
    sessionStorage.setItem(AUTHENTICATED_USER_STORAGE_KEY, JSON.stringify(response.user));

    this.navigateToRoleEntryPoint(user.role);
  }

  /**
   * Records an authentication failure on the store state.
   *
   * @param error - Source error raised by the API or mock layer.
   * @param fallback - Default message used when the error has no readable detail.
   */
  private handleAuthenticationError(error: unknown, fallback: string): void {
    const message = error instanceof Error && error.message ? error.message : fallback;
    this.errorSignal.set(message);
    this.loadingSignal.set(false);
  }

  /**
   * Restores the user session from the browser session storage, if present.
   *
   * @remarks
   * Allows the application to keep the user signed in across page reloads
   * without forcing a new authentication request.
   */
  private restorePersistedSession(): void {
    const storedUser = sessionStorage.getItem(AUTHENTICATED_USER_STORAGE_KEY);
    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser) as UserResource;
      const user = this.userAssembler.toEntityFromResource(parsed);
      this.currentUserSignal.set(user);
    } catch {
      sessionStorage.removeItem(AUTHENTICATION_TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(AUTHENTICATED_USER_STORAGE_KEY);
    }
  }

  /**
   * Navigates the authenticated user to the entry route that matches their role.
   *
   * @param role - Role granted to the authenticated user.
   */
  private navigateToRoleEntryPoint(role: UserRole): void {
    if (role === UserRole.Dermatologist) {
      this.router.navigate(['/derm']).then();
      return;
    }
    this.router.navigate(['/dashboard']).then();
  }
}
