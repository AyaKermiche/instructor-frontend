import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Candidate } from '../models/candidate.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private readonly TABLE = 'candidate';

  constructor(private apiService: ApiService) {}

  getAllCandidates(options?: string): Observable<Candidate[]> {
    return this.apiService.getAll<Candidate>(this.TABLE, options).pipe(
      map((result: any) => {
        return result.records || [];
      })
    );
  }

  getCandidate(id: number): Observable<Candidate> {
    return this.apiService.getOne<Candidate>(this.TABLE, id);
  }

  createCandidate(candidate: Omit<Candidate, 'id'>): Observable<number> {
    return this.apiService.create<number>(this.TABLE, candidate);
  }

  updateCandidate(id: number, candidate: Partial<Candidate>): Observable<Candidate> {
    return this.apiService.update<Candidate>(this.TABLE, id, candidate);
  }

  deleteCandidate(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }
}