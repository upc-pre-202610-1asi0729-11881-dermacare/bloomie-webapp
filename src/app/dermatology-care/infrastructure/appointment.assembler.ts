import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Appointment, AppointmentStatus} from '../domain/model/appointment.entity';
import {AppointmentResource, AppointmentsResponse} from './appointment.response';

/**
 * Maps Appointment entities to and from API resources.
 */
export class AppointmentAssembler implements BaseAssembler<Appointment, AppointmentResource, AppointmentsResponse> {

  /**
   * Converts an AppointmentsResponse to an array of Appointment entities.
   * @param response - The API response containing appointments.
   * @returns An array of Appointment entities.
   */
  toEntitiesFromResponse(response: AppointmentsResponse): Appointment[] {
    return response.appointments.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts an AppointmentResource to an Appointment entity.
   * @param resource - The resource to convert.
   * @returns The converted Appointment entity.
   */
  toEntityFromResource(resource: AppointmentResource): Appointment {
    return new Appointment({
      id:                 resource.id,
      patientId:          resource.patient_id,
      dermatologistId:    resource.dermatologist_id,
      paymentId:          resource.payment_id,
      scheduledAt:        resource.scheduled_at,
      status:             resource.status as AppointmentStatus,
      cancellationReason: resource.cancellation_reason,
    });
  }

  /**
   * Converts an Appointment entity to an AppointmentResource.
   * @param entity - The entity to convert.
   * @returns The converted AppointmentResource.
   */
  toResourceFromEntity(entity: Appointment): AppointmentResource {
    return {
      id:                  entity.id,
      patient_id:          entity.patientId,
      dermatologist_id:    entity.dermatologistId,
      payment_id:          entity.paymentId,
      scheduled_at:        entity.scheduledAt,
      status:              entity.status,
      cancellation_reason: entity.cancellationReason,
    } as AppointmentResource;
  }
}
