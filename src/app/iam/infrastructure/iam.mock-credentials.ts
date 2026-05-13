import { UserRole } from '../domain/model/user.entity';

/**
 * In-memory test credentials used while the IAM backend is unavailable.
 *
 * @remarks
 * These records simulate the response that the authentication endpoint
 * would return for valid credentials. They are only consulted when the
 * `useMockAuthentication` flag in the environment is enabled, and must
 * never be used in production builds.
 *
 * The password values are intentionally readable for local testing and
 * are matched in plain text by the {@link IamStore}.
 */
export interface MockCredential {
  /** Email used to authenticate the account. */
  email:     string;
  /** Plain text password expected during login. */
  password:  string;
  /** Numeric identifier returned on successful authentication. */
  id:        number;
  /** Given name of the test account. */
  name:      string;
  /** Family name of the test account. */
  lastName:  string;
  /** Role granted to the test account. */
  role:      UserRole;
  /** Medical specialty, only meaningful for dermatologist accounts. */
  specialty: string | null;
}

/**
 * Predefined test accounts for local development and demos.
 *
 * @remarks
 * Includes one young adult patient and one certified dermatologist so that
 * both sign-in flows can be exercised end to end without a live backend.
 */
export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    email:     'sofia.mendez@bloomie.test',
    password:  'bloomie123',
    id:        1,
    name:      'Sofia',
    lastName:  'Mendez',
    role:      UserRole.YoungAdult,
    specialty: null,
  },
  {
    email:     'laura.morales@bloomie.test',
    password:  'specialist123',
    id:        2,
    name:      'Laura',
    lastName:  'Morales',
    role:      UserRole.Dermatologist,
    specialty: 'Dermatology',
  },
];

/**
 * Token value returned by the mock authentication flow.
 *
 * @remarks
 * The string is intentionally recognizable so it can be easily filtered
 * out of HTTP traces during development.
 */
export const MOCK_AUTHENTICATION_TOKEN = 'mock-authentication-token';
