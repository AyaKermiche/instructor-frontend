import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = API_CONFIG.apiUrl;
  private currentUserSubject = new BehaviorSubject<any | undefined>(undefined);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const payload = {
      username: username,
      password: password,
    };

    return this.http
      .post(`${this.apiUrl}/login`, payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(switchMap(() => this.getCurrentUser()));
  }

  getCurrentUser(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/me`, {
        withCredentials: true,
      })
      .pipe(
        tap((user: any) => {
          this.currentUserSubject.next(user);
        }),
        catchError(() => {
          this.currentUserSubject.next(null);
          return of(null);
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => !!user));
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
        })
      );
  }
}