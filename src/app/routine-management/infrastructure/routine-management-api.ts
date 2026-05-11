import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Routine } from '../domain/model/routine.entity';
import { RoutineItem } from '../domain/model/routine-item.entity';
import { DailyTracking } from '../domain/model/daily-tracking.entity';
import { RoutinesApiEndpoint } from './routines-api-endpoint';
import { RoutineItemsApiEndpoint } from './routine-items-api-endpoint';
import { DailyTrackingsApiEndpoint } from './daily-trackings-api-endpoint';

/**
 * Infrastructure facade for routine management endpoint operations.
 */
@Injectable({providedIn: 'root'})
export class RoutineManagementApi extends BaseApi {

  private readonly routinesEndpoint:       RoutinesApiEndpoint;
  private readonly routineItemsEndpoint:   RoutineItemsApiEndpoint;
  private readonly dailyTrackingsEndpoint: DailyTrackingsApiEndpoint;

  /**
   * Creates an instance of RoutineManagementApi.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super();
    this.routinesEndpoint       = new RoutinesApiEndpoint(http);
    this.routineItemsEndpoint   = new RoutineItemsApiEndpoint(http);
    this.dailyTrackingsEndpoint = new DailyTrackingsApiEndpoint(http);
  }

  /**
   * Retrieves all routines.
   * @returns Stream with the routine collection.
   */
  getRoutines(): Observable<Routine[]> {
    return this.routinesEndpoint.getAll();
  }

  /**
   * Retrieves a single routine by ID.
   * @param id - The ID of the routine.
   * @returns Stream with the matched Routine entity.
   */
  getRoutine(id: number): Observable<Routine> {
    return this.routinesEndpoint.getById(id);
  }

  /**
   * Creates a new routine.
   * @param routine - The routine to create.
   * @returns Stream with the created Routine entity.
   */
  createRoutine(routine: Routine): Observable<Routine> {
    return this.routinesEndpoint.create(routine);
  }

  /**
   * Updates an existing routine.
   * @param routine - The routine to update.
   * @returns Stream with the updated Routine entity.
   */
  updateRoutine(routine: Routine): Observable<Routine> {
    return this.routinesEndpoint.update(routine, routine.id);
  }

  /**
   * Retrieves all routine items.
   * @returns Stream with the routine item collection.
   */
  getRoutineItems(): Observable<RoutineItem[]> {
    return this.routineItemsEndpoint.getAll();
  }

  /**
   * Creates a new routine item.
   * @param routineItem - The routine item to create.
   * @returns Stream with the created RoutineItem entity.
   */
  createRoutineItem(routineItem: RoutineItem): Observable<RoutineItem> {
    return this.routineItemsEndpoint.create(routineItem);
  }

  /**
   * Updates an existing routine item.
   * @param routineItem - The routine item to update.
   * @returns Stream with the updated RoutineItem entity.
   */
  updateRoutineItem(routineItem: RoutineItem): Observable<RoutineItem> {
    return this.routineItemsEndpoint.update(routineItem, routineItem.id);
  }

  /**
   * Retrieves all daily tracking records.
   * @returns Stream with the daily tracking collection.
   */
  getDailyTrackings(): Observable<DailyTracking[]> {
    return this.dailyTrackingsEndpoint.getAll();
  }

  /**
   * Creates a new daily tracking record.
   * @param dailyTracking - The daily tracking record to create.
   * @returns Stream with the created DailyTracking entity.
   */
  createDailyTracking(dailyTracking: DailyTracking): Observable<DailyTracking> {
    return this.dailyTrackingsEndpoint.create(dailyTracking);
  }

  /**
   * Updates an existing daily tracking record.
   * @param dailyTracking - The daily tracking record to update.
   * @returns Stream with the updated DailyTracking entity.
   */
  updateDailyTracking(dailyTracking: DailyTracking): Observable<DailyTracking> {
    return this.dailyTrackingsEndpoint.update(dailyTracking, dailyTracking.id);
  }

  /**
   * Marks a daily tracking record as completed.
   * @param routineId - The routine identifier.
   * @param date - The date string for the tracking entry (e.g. '2026-05-11').
   * @returns Stream with the updated DailyTracking entity.
   */
  markDayCompleted(routineId: number, date: string): Observable<DailyTracking> {
    const tracking = new DailyTracking({
      id:        0,
      routineId,
      userId:    0,
      date,
      status:    'COMPLETED' as any,
    });
    return this.dailyTrackingsEndpoint.create(tracking);
  }

  /**
   * Marks a daily tracking record as not completed.
   * @param routineId - The routine identifier.
   * @param date - The date string for the tracking entry (e.g. '2026-05-11').
   * @returns Stream with the updated DailyTracking entity.
   */
  markDayNotCompleted(routineId: number, date: string): Observable<DailyTracking> {
    const tracking = new DailyTracking({
      id:        0,
      routineId,
      userId:    0,
      date,
      status:    'NOT_COMPLETED' as any,
    });
    return this.dailyTrackingsEndpoint.create(tracking);
  }
}
