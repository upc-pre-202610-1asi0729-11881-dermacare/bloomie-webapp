import {Injectable} from '@angular/core';
import {BaseApi} from '../..//shared/infrastructure/base-api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DermatologistProfile} from '../domain/model/dermatologist-profile.entity';
import {DermatologistAvailability} from '../domain/model/dermatologist-availability.entity';
import {Appointment} from '../domain/model/appointment.entity';
import {Consultation} from '../domain/model/consultation.entity';
import {DermatologistProfilesApiEndpoint} from './dermatologist-profiles-api-endpoint';
import {DermatologistAvailabilitiesApiEndpoint} from './dermatologist-availabilities-api-endpoint';
import {AppointmentsApiEndpoint} from './appointments-api-endpoint';
import {ConsultationsApiEndpoint} from './consultations-api-endpoint'

/**
 * Infrastructure facade for dermatology care endpoint operations.
 */
@Injectable({providedIn: 'root'})
export class DermatologyCareApi extends BaseApi {

  private readonly dermatologistProfilesEndpoint:     DermatologistProfilesApiEndpoint;
  private readonly dermatologistAvailabilitiesEndpoint: DermatologistAvailabilitiesApiEndpoint;
  private readonly appointmentsEndpoint:              AppointmentsApiEndpoint;
  private readonly consultationsEndpoint:             ConsultationsApiEndpoint;

  /**
   * Creates an instance of DermatologyCareApi.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super();
    this.dermatologistProfilesEndpoint      = new DermatologistProfilesApiEndpoint(http);
    this.dermatologistAvailabilitiesEndpoint = new DermatologistAvailabilitiesApiEndpoint(http);
    this.appointmentsEndpoint               = new AppointmentsApiEndpoint(http);
    this.consultationsEndpoint              = new ConsultationsApiEndpoint(http);
  }

  /**
   * Retrieves all dermatologist profiles.
   * @returns Stream with the dermatologist profile collection.
   */
  getDermatologistProfiles(): Observable<DermatologistProfile[]> {
    return this.dermatologistProfilesEndpoint.getAll();
  }

  /**
   * Retrieves a single dermatologist profile by ID.
   * @param id - The ID of the dermatologist profile.
   * @returns Stream with the matched DermatologistProfile entity.
   */
  getDermatologistProfile(id: number): Observable<DermatologistProfile> {
    return this.dermatologistProfilesEndpoint.getById(id);
  }

  /**
   * Creates a new dermatologist profile.
   * @param dermatologistProfile - The profile to create.
   * @returns Stream with the created DermatologistProfile entity.
   */
  createDermatologistProfile(dermatologistProfile: DermatologistProfile): Observable<DermatologistProfile> {
    return this.dermatologistProfilesEndpoint.create(dermatologistProfile);
  }

  /**
   * Updates an existing dermatologist profile.
   * @param dermatologistProfile - The profile to update.
   * @returns Stream with the updated DermatologistProfile entity.
   */
  updateDermatologistProfile(dermatologistProfile: DermatologistProfile): Observable<DermatologistProfile> {
    return this.dermatologistProfilesEndpoint.update(dermatologistProfile, dermatologistProfile.id);
  }

  /**
   * Retrieves all availability slots for a dermatologist.
   * @returns Stream with the dermatologist availability collection.
   */
  getDermatologistAvailabilities(): Observable<DermatologistAvailability[]> {
    return this.dermatologistAvailabilitiesEndpoint.getAll();
  }

  /**
   * Creates a new availability slot for a dermatologist.
   * @param dermatologistAvailability - The availability slot to create.
   * @returns Stream with the created DermatologistAvailability entity.
   */
  createDermatologistAvailability(dermatologistAvailability: DermatologistAvailability): Observable<DermatologistAvailability> {
    return this.dermatologistAvailabilitiesEndpoint.create(dermatologistAvailability);
  }

  /**
   * Updates an existing availability slot.
   * @param dermatologistAvailability - The availability slot to update.
   * @returns Stream with the updated DermatologistAvailability entity.
   */
  updateDermatologistAvailability(dermatologistAvailability: DermatologistAvailability): Observable<DermatologistAvailability> {
    return this.dermatologistAvailabilitiesEndpoint.update(dermatologistAvailability, dermatologistAvailability.id);
  }

  /**
   * Retrieves all appointments.
   * @returns Stream with the appointment collection.
   */
  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsEndpoint.getAll();
  }

  /**
   * Retrieves a single appointment by ID.
   * @param id - The ID of the appointment.
   * @returns Stream with the matched Appointment entity.
   */
  getAppointment(id: number): Observable<Appointment> {
    return this.appointmentsEndpoint.getById(id);
  }

  /**
   * Creates a new appointment.
   * @param appointment - The appointment to create.
   * @returns Stream with the created Appointment entity.
   */
  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.appointmentsEndpoint.create(appointment);
  }

  /**
   * Updates an existing appointment.
   * @param appointment - The appointment to update.
   * @returns Stream with the updated Appointment entity.
   */
  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.appointmentsEndpoint.update(appointment, appointment.id);
  }

  /**
   * Retrieves all consultations.
   * @returns Stream with the consultation collection.
   */
  getConsultations(): Observable<Consultation[]> {
    return this.consultationsEndpoint.getAll();
  }

  /**
   * Retrieves a single consultation by ID.
   * @param id - The ID of the consultation.
   * @returns Stream with the matched Consultation entity.
   */
  getConsultation(id: number): Observable<Consultation> {
    return this.consultationsEndpoint.getById(id);
  }

  /**
   * Creates a new consultation.
   * @param consultation - The consultation to create.
   * @returns Stream with the created Consultation entity.
   */
  createConsultation(consultation: Consultation): Observable<Consultation> {
    return this.consultationsEndpoint.create(consultation);
  }

  /**
   * Updates an existing consultation.
   * @param consultation - The consultation to update.
   * @returns Stream with the updated Consultation entity.
   */
  updateConsultation(consultation: Consultation): Observable<Consultation> {
    return this.consultationsEndpoint.update(consultation, consultation.id);
  }
}
