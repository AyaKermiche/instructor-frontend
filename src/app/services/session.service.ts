import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Session } from '../models/session.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly TABLE = 'session';

  constructor(private apiService: ApiService) {}

  // ======================
  // EXISTING CRUD (KEEP)
  // ======================

  getAll(options?: string): Observable<Session[]> {
    return this.apiService.getAll<Session>(this.TABLE, options).pipe(
      map((res: any) => res.records || [])
    );
  }

  getById(id: number): Observable<Session> {
    return this.apiService.getOne<Session>(this.TABLE, id);
  }

  create(data: Omit<Session, 'id'>): Observable<number> {
    return this.apiService.create<number>(this.TABLE, data);
  }

  update(id: number, data: Partial<Session>): Observable<Session> {
    return this.apiService.update<Session>(this.TABLE, id, data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }

  // ======================
  // NEW BACKEND FUNCTIONS
  // ======================

  /**
   * Get today's sessions for logged instructor
   * Backend: GET /api/sessions/today
   */
  getTodaySessions(): Observable<Session[]> {
    return this.apiService.getCustom<Session[]>('session/today');
  }

  /**
   * Update session (presence, status, etc.)
   * Backend: PUT /api/sessions/:id
   */
  updateSession(id: number, data: Partial<Session>): Observable<Session> {
    return this.apiService.putCustom<Session>(`session/${id}`, data);
  }

  getByInstructor(id: number): Observable<any[]> {
  return this.apiService
    .getCustom<any[]>(`session/instructor/${id}`);
}
}