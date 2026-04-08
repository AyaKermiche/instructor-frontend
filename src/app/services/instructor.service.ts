
/*import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Instructor } from '../models/instructor.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {

  // ⚠️ Keep for admin-style endpoints if needed
  private readonly TABLE = 'instructor';

  // 🔥 NEW: instructor API base
  private readonly BASE = 'instructor-api';

  constructor(private apiService: ApiService) {}

  // ================= ADMIN-STYLE (optional keep) =================

  getAll(options?: string): Observable<Instructor[]> {
    return this.apiService.getAll<Instructor>(this.TABLE, options).pipe(
      map((res: any) => res.records || [])
    );
  }

  getById(id: number): Observable<Instructor> {
    return this.apiService.getOne<Instructor>(this.TABLE, id);
  }

  create(data: Omit<Instructor, 'id'>): Observable<number> {
    return this.apiService.create<number>(this.TABLE, data);
  }

  update(id: number, data: Partial<Instructor>): Observable<Instructor> {
    return this.apiService.update<Instructor>(this.TABLE, id, data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }

  // ================= 🔥 INSTRUCTOR API (REAL USE) =================

  // GET current instructor
  getMe(): Observable<Instructor> {
    return this.apiService.customGet<Instructor>(`${this.BASE}/me`);
  }

  // UPDATE profile
  updateProfile(data: Partial<Instructor>): Observable<Instructor> {
    return this.apiService.customPut<Instructor>(`${this.BASE}/me`, data);
  }

  // UPDATE password
  updatePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.apiService.customPut(`${this.BASE}/me/password`, data);
  }
}

/*import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Instructor } from '../models/instructor.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {

  private readonly TABLE = 'instructor';

  constructor(private apiService: ApiService) {}

  // ================= GET ALL =================
  getAll(options?: string): Observable<Instructor[]> {
    return this.apiService.getAll<Instructor>(this.TABLE, options).pipe(
      map((res: any) => res?.records || [])
    );
  }

  // ================= GET BY ID =================
  getById(id: number): Observable<Instructor> {
    return this.apiService.getOne<any>(this.TABLE, id).pipe(
      map((res: any) => {
        // Handle both possible formats
        if (res?.records && res.records.length > 0) {
          return res.records[0];
        }
        return res;
      })
    );
  }

  // ================= CREATE =================
  create(data: Omit<Instructor, 'id'>): Observable<number> {
    return this.apiService.create<number>(this.TABLE, data);
  }

  // ================= UPDATE PROFILE =================
  update(id: number, data: Partial<Instructor>): Observable<Instructor> {
    return this.apiService.update<Instructor>(this.TABLE, id, data);
  }

  // ================= DELETE =================
  delete(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }

  // ================= UPDATE PASSWORD =================
  updatePassword(id: number, data: any): Observable<any> {
    /**
     * IMPORTANT:
     * Since your API is LIMITED and likely DOES NOT support:
     * PUT /instructor/:id/password
     *
     * We fallback to updating password like this.
     *
     * BUT we still pass currentPassword for future compatibility.
     */

    /*const payload = {
      password: data.newPassword,
      currentPassword: data.currentPassword // may be ignored by API
    };

    return this.apiService.update(this.TABLE, id, payload);
  }
}*/

import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Instructor } from '../models/instructor.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private readonly TABLE = 'instructor';

  constructor(private apiService: ApiService) {}

  getAll(options?: string): Observable<Instructor[]> {
    return this.apiService.getAll<Instructor>(this.TABLE, options).pipe(
      map((res: any) => res.records || [])
    );
  }

  getById(id: number): Observable<Instructor> {
    return this.apiService.getOne<Instructor>(this.TABLE, id);
  }

  create(data: Omit<Instructor, 'id'>): Observable<number> {
    return this.apiService.create<number>(this.TABLE, data);
  }

  update(id: number, data: Partial<Instructor>): Observable<Instructor> {
    return this.apiService.update<Instructor>(this.TABLE, id, data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }

  updatePassword(id: number, data: any): Observable<any> {
    return this.apiService.update(this.TABLE, id, { password: data.newPassword });
  }
}