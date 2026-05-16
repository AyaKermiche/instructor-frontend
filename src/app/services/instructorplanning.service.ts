import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class InstructorPlanningService {
  // This matches the prefix in your Express router
  private readonly TABLE = 'planning';

  constructor(private apiService: ApiService) {}

  // Uses getOne because your backend route is /api/instructor-planning/:instructorId
  getSchedulesByInstructor(instructorId: number): Observable<any[]> {
    return this.apiService.getOne<any[]>(this.TABLE, instructorId).pipe(
      map((res: any) => res || [])
    );
  }

  // Uses getAll for the /api/instructor-planning endpoint
  getAllSchedules(): Observable<any[]> {
    return this.apiService.getAll<any[]>(this.TABLE).pipe(
      map((res: any) => res || [])
    );
  }

  createSchedule(data: any): Observable<any> {
    return this.apiService.create<any>(this.TABLE, data);
  }

  updateSchedule(id: number, data: any): Observable<any> {
    return this.apiService.update<any>(this.TABLE, id, data);
  }

  deleteSchedule(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }
}