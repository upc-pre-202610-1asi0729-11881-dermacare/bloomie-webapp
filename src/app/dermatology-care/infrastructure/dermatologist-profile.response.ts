import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a dermatologist profile returned by the backend API.
 */
export interface DermatologistProfileResource extends BaseResource {
  id:              number;
  dermatologistId: number;
  firstName?:      string;
  lastName?:       string;
  fullName?:       string | null;
  specialtyName?:  string;
  specialty?:      string;
  licenseNumber:   string | null;
  contactPhone:    string | null;
  phone?:          string | null;
  biography:       string | null;
  consultationFee?: number;
  photoUrl?:       string | null;
}

/**
 * Response envelope kept for BaseAssembler type-param compatibility.
 * The backend returns a plain array, so this interface is not used at runtime.
 */
export interface DermatologistProfilesResponse extends BaseResponse {
  dermatologist_profiles: DermatologistProfileResource[];
}
