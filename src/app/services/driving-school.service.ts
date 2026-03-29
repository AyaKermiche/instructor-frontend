import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DrivingSchool } from '../models/driving-school.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DrivingSchoolService {
  private readonly TABLE = 'driving_school';

  constructor(private apiService: ApiService) {}

  getAll(options?: string): Observable<DrivingSchool[]> {
    return this.apiService.getAll<DrivingSchool>(this.TABLE, options).pipe(
      map((res: any) => res.records || [])
    );
  }

  getById(id: number): Observable<DrivingSchool> {
    return this.apiService.getOne<DrivingSchool>(this.TABLE, id);
  }

  create(data: Omit<DrivingSchool, 'id'>): Observable<number> {
    return this.apiService.create<number>(this.TABLE, data);
  }

  update(id: number, data: Partial<DrivingSchool>): Observable<DrivingSchool> {
    return this.apiService.update<DrivingSchool>(this.TABLE, id, data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }
}