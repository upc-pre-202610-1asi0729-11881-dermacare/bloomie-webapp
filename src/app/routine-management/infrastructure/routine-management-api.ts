import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Routine } from '../domain/model/routine.entity';
import { DailyTracking } from '../domain/model/daily-tracking.entity';
import { RoutinesApiEndpoint } from './routines-api-endpoint';
import { DailyTrackingsApiEndpoint } from './daily-trackings-api-endpoint';

/**
 * Infrastructure facade for routine management endpoint operations.
 */
@Injectable({ providedIn: 'root' })
export class RoutineManagementApi extends BaseApi {

  private readonly routinesEndpoint:       RoutinesApiEndpoint;
  private readonly dailyTrackingsEndpoint: DailyTrackingsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.routinesEndpoint       = new RoutinesApiEndpoint(http);
    this.dailyTrackingsEndpoint = new DailyTrackingsApiEndpoint(http);
  }

  /**
   * Retrieves the active routine for a patient.
   */
  getRoutineByPatientId(patientId: number): Observable<Routine> {
    return this.routinesEndpoint.getByPatientId(patientId);
  }

  /**
   * Retrieves a routine by its identifier.
   */
  getRoutineById(id: number): Observable<Routine> {
    return this.routinesEndpoint.getById(id);
  }

  /**
   * Retrieves 4 recommended replacement product options for a routine item.
   */
  getReplacementOptions(routineId: number, routineItemId: number): Observable<string[]> {
    return this.routinesEndpoint.getReplacementOptions(routineId, routineItemId);
  }

  /**
   * Removes an optional product step from a routine.
   * Returns the updated routine.
   */
  removeRoutineItem(routineId: number, routineItemId: number): Observable<Routine> {
    return this.routinesEndpoint.removeItem(routineId, routineItemId);
  }

  /**
   * Replaces the product recommendation for a routine item.
   * Returns the updated routine.
   */
  replaceProduct(routineId: number, routineItemId: number, newProductRecommendation: string): Observable<Routine> {
    return this.routinesEndpoint.replaceProduct(routineId, routineItemId, newProductRecommendation);
  }

  /**
   * Retrieves all daily tracking records for a patient.
   */
  getDailyTrackingsByPatientId(patientId: number): Observable<DailyTracking[]> {
    return this.dailyTrackingsEndpoint.getByPatientId(patientId);
  }

  /**
   * Marks a routine as completed for a specific date.
   * Returns the ID of the created tracking entry.
   */
  markRoutineAsCompleted(patientId: number, routineId: number, date: string): Observable<number> {
    return this.dailyTrackingsEndpoint.markAsCompleted(patientId, routineId, date);
  }
}
