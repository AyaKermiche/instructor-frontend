import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = API_CONFIG.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 1. LOGIN: Save the token returned by the server
 login(email: string, password: string): Observable<any> {
  return this.http
    .post<any>(`${this.apiUrl}/api/auth/login`, { email, password })
    .pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.currentUserSubject.next(res.user);
        }
      })
    );
}

getCurrentUser(): Observable<any> {
  const token = localStorage.getItem('token');

  if (!token) {
    this.currentUserSubject.next(null);
    return of(null);
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http
    .get(`${this.apiUrl}/auth/me`, { headers })
    .pipe(
      tap((user: any) => this.currentUserSubject.next(user)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
}

  /*login(email: string, password: string): Observable<any> {
    const payload = { email, password }; // Backend expects 'email'

    return this.http
      .post(`${this.apiUrl}/api/auth/login`, payload) // Removed withCredentials
      .pipe(
        tap((res: any) => {
          if (res.token) {
            localStorage.setItem('token', res.token); // Store JWT
          }
        }),
        switchMap(() => this.getCurrentUser())
      );
  }

  // 2. GET USER: Manually send the Authorization Header
  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');
    
    // If no token, don't even try the request
    if (!token) {
      this.currentUserSubject.next(null);
      return of(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http
      .get(`${this.apiUrl}/api/auth/me`, { headers }) // Ensure this path matches your back route
      .pipe(
        tap((user: any) => {
          this.currentUserSubject.next(user);
        }),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }*/

  // 3. LOGOUT: Clear local storage
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => !!user));
  }
}

/*import { Injectable } from '@angular/core';
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
      .post(`${this.apiUrl}/api/auth/login`, payload, {
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
}*/