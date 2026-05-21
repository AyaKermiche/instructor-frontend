import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = API_CONFIG.apiUrl;

  constructor(private http: HttpClient) {}

  // ================= HEADERS =================
  private getHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');

  return new HttpHeaders({
    Authorization: token ? `Bearer ${token}` : ''
  });
}

  // ================= SAFE QUERY BUILDER =================
  private buildUrl(table: string, extra = ''): string {
    const url = `${this.baseUrl}/api/${table}`;
    return extra ? `${url}?${extra}` : url;
  }

  // ================= CRUD =================
  getAll<T>(table: string, options: string = ''): Observable<T[]> {
    return this.http.get<T[]>(this.buildUrl(table, options), {
      withCredentials: true
    });
  }

  getOne<T>(table: string, id: number, options?: string): Observable<T> {
  const url = options
    ? `${this.baseUrl}/api/${table}/${id}?${options}`
    : `${this.baseUrl}/api/${table}/${id}`;

  return this.http.get<T>(url, {
    withCredentials: true,
    headers: this.getHeaders()   // ✅ ADD THIS
  });
}

  create<T>(table: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/api/${table}`, data, {
      withCredentials: true,
    });
  }

  update<T>(table: string, id: number, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/api/${table}/${id}`, data, {
      withCredentials: true,
      headers: this.getHeaders()
    });
  }

  delete(table: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/${table}/${id}`, {
      withCredentials: true,
    });
  }

  // ================= CUSTOM =================
  getCustom<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/api/${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  putCustom<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/api/${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }


patchCustom<T>(endpoint: string, data: any): Observable<T> {
  return this.http.patch<T>(`${this.baseUrl}/api/${endpoint}`, data, {
    headers: this.getHeaders()
  });
}

}