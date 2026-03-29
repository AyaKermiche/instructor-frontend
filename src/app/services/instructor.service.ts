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
}