import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry, take} from 'rxjs';
import {DermatologistProfile} from '../domain/model/dermatologist-profile.entity';
import {DermatologistAvailability} from '../domain/model/dermatologist-availability.entity';
import {Appointment, AppointmentStatus} from '../domain/model/appointment.entity';
import {Consultation} from '../domain/model/consultation.entity';
import {DermatologyCareApi} from '../infrastructure/dermatology-care-api';

/**
 * Holds dermatology care application state and coordinates
 * dermatologist, appointment, and consultation application layer behavior.
 */
@Injectable({providedIn: 'root'})
export class DermatologyCareStore {

  private readonly dermatologistProfilesSignal  = signal<DermatologistProfile[]>([]);
  private readonly availabilitiesSignal          = signal<DermatologistAvailability[]>([]);
  private readonly appointmentsSignal            = signal<Appointment[]>([]);
  private readonly consultationsSignal           = signal<Consultation[]>([]);
  private readonly selectedDermatologistSignal   = signal<DermatologistProfile | null>(null);
  private readonly selectedAppointmentSignal     = signal<Appointment | null>(null);
  private readonly selectedConsultationSignal    = signal<Consultation | null>(null);
  private readonly loadingSignal                 = signal<boolean>(false);
  private readonly errorSignal                   = signal<string | null>(null);

  /**
   * Readonly signal for the list of dermatologist profiles.
   */
  readonly dermatologistProfiles = this.dermatologistProfilesSignal.asReadonly();

  /**
   * Readonly signal for the list of dermatologist availability slots.
   */
  readonly availabilities = this.availabilitiesSignal.asReadonly();

  /**
   * Readonly signal for the list of appointments.
   */
  readonly appointments = this.appointmentsSignal.asReadonly();

  /**
   * Readonly signal for the list of consultations.
   */
  readonly consultations = this.consultationsSignal.asReadonly();

  /**
   * Readonly signal for the currently selected dermatologist profile.
   */
  readonly selectedDermatologist = this.selectedDermatologistSignal.asReadonly();

  /**
   * Readonly signal for the currently selected appointment.
   */
  readonly selectedAppointment = this.selectedAppointmentSignal.asReadonly();

  /**
   * Readonly signal for the currently selected consultation.
   */
  readonly selectedConsultation = this.selectedConsultationSignal.asReadonly();

  /**
   * Readonly signal indicating if data is loading.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Readonly signal for the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Computed signal for the count of available dermatologists.
   */
  readonly availableDermatologistCount = computed(() =>
    this.dermatologistProfiles().filter(dermatologist => dermatologist.available).length
  );

  /**
   * Computed signal for the count of confirmed appointments.
   */
  readonly confirmedAppointmentCount = computed(() =>
    this.appointments().filter(appointment => appointment.isConfirmed).length
  );

  /**
   * Creates an instance of DermatologyCareStore and loads initial data.
   * @param dermatologyCareApi - The API service for dermatology care data.
   */
  private readonly destroyRef = inject(DestroyRef);

  constructor(private dermatologyCareApi: DermatologyCareApi) {
    this.loadDermatologistProfiles();
    this.loadAppointments();
    this.loadConsultations();
  }

  /**
   * Selects a dermatologist profile by identifier.
   * @param id - Dermatologist profile identifier.
   * @returns Reactive selection for the requested dermatologist profile.
   */
  getDermatologistProfileById(id: number): Signal<DermatologistProfile | undefined> {
    return computed(() => id ? this.dermatologistProfiles().find(dermatologist => dermatologist.id === id) : undefined);
  }

  /**
   * Selects an appointment by identifier.
   * @param id - Appointment identifier.
   * @returns Reactive selection for the requested appointment.
   */
  getAppointmentById(id: number): Signal<Appointment | undefined> {
    return computed(() => id ? this.appointments().find(appointment => appointment.id === id) : undefined);
  }

  /**
   * Selects a consultation by identifier.
   * @param id - Consultation identifier.
   * @returns Reactive selection for the requested consultation.
   */
  getConsultationById(id: number): Signal<Consultation | undefined> {
    return computed(() => id ? this.consultations().find(consultation => consultation.id === id) : undefined);
  }

  /**
   * Sets the currently selected dermatologist profile.
   * @param dermatologistProfile - The dermatologist profile to select.
   */
  selectDermatologist(dermatologistProfile: DermatologistProfile): void {
    this.selectedDermatologistSignal.set(dermatologistProfile);
    this.loadAvailabilities(dermatologistProfile.id);
  }

  /**
   * Sets the currently selected appointment.
   * @param appointment - The appointment to select.
   */
  selectAppointment(appointment: Appointment): void {
    this.selectedAppointmentSignal.set(appointment);
  }

  /**
   * Sets the currently selected consultation.
   * @param consultation - The consultation to select.
   */
  selectConsultation(consultation: Consultation): void {
    this.selectedConsultationSignal.set(consultation);
  }

  /**
   * Creates a new appointment.
   * @param appointment - The appointment to create.
   */
  addAppointment(appointment: Appointment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dermatologyCareApi.createAppointment(appointment).pipe(retry(2)).subscribe({
      next: createdAppointment => {
        this.appointmentsSignal.update(appointments => [...appointments, createdAppointment]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create appointment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Cancels an existing appointment by updating its status and reason.
   * @param appointment - The appointment to cancel with the updated status and reason.
   */
  cancelAppointment(appointment: Appointment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    appointment.status             = AppointmentStatus.Cancelled;
    this.dermatologyCareApi.updateAppointment(appointment).pipe(retry(2)).subscribe({
      next: updatedAppointment => {
        this.appointmentsSignal.update(appointments =>
          appointments.map(existing => existing.id === updatedAppointment.id ? updatedAppointment : existing)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to cancel appointment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates the notes and recommendations of an existing consultation.
   * @param consultation - The consultation with updated notes and recommendations.
   */
  updateConsultation(consultation: Consultation): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dermatologyCareApi.updateConsultation(consultation).pipe(retry(2)).subscribe({
      next: updatedConsultation => {
        this.consultationsSignal.update(consultations =>
          consultations.map(existing => existing.id === updatedConsultation.id ? updatedConsultation : existing)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update consultation'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Creates a new dermatologist availability slot.
   * @param availability - The availability slot to create.
   */
  addAvailability(availability: DermatologistAvailability): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dermatologyCareApi.createDermatologistAvailability(availability).pipe(retry(2)).subscribe({
      next: createdAvailability => {
        this.availabilitiesSignal.update(availabilities => [...availabilities, createdAvailability]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create availability'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing dermatologist profile.
   * @param dermatologistProfile - The profile with updated values.
   */
  updateDermatologistProfile(dermatologistProfile: DermatologistProfile): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dermatologyCareApi.updateDermatologistProfile(dermatologistProfile).pipe(retry(2)).subscribe({
      next: updatedProfile => {
        this.dermatologistProfilesSignal.update(profiles =>
          profiles.map(existing => existing.id === updatedProfile.id ? updatedProfile : existing)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update dermatologist profile'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all dermatologist profiles from the API.
   */
  private loadDermatologistProfiles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dermatologyCareApi.getDermatologistProfiles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: dermatologistProfiles => {
        this.dermatologistProfilesSignal.set(dermatologistProfiles);
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load dermatologist profiles'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads availability slots for a given dermatologist from the API.
   * @param dermatologistId - The ID of the dermatologist whose availabilities to load.
   */
  private loadAvailabilities(dermatologistId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dermatologyCareApi.getDermatologistAvailabilities().pipe(take(1)).subscribe({
      next: availabilities => {
        this.availabilitiesSignal.set(
          availabilities.filter(availability => availability.dermatologistId === dermatologistId)
        );
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load availabilities'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all appointments from the API.
   */
  private loadAppointments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dermatologyCareApi.getAppointments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: appointments => {
        this.appointmentsSignal.set(appointments);
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load appointments'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all consultations from the API.
   */
  private loadConsultations(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dermatologyCareApi.getConsultations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: consultations => {
        this.consultationsSignal.set(consultations);
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load consultations'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Normalizes unknown errors into a display-friendly message.
   * @param error - Source error.
   * @param fallback - Default message when details are unavailable.
   * @returns Normalized message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
