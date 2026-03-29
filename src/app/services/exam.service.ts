import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Exam } from '../models/exam.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private readonly TABLE = 'exam';

  constructor(private apiService: ApiService) {}

  getAll(options?: string): Observable<Exam[]> {
    return this.apiService.getAll<Exam>(this.TABLE, options).pipe(
      map((res: any) => res.records || [])
    );
  }

  getById(id: number): Observable<Exam> {
    return this.apiService.getOne<Exam>(this.TABLE, id);
  }

  create(data: Omit<Exam, 'id'>): Observable<number> {
    return this.apiService.create<number>(this.TABLE, data);
  }

  update(id: number, data: Partial<Exam>): Observable<Exam> {
    return this.apiService.update<Exam>(this.TABLE, id, data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }
}