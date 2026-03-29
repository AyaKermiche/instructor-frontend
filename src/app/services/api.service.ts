import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getAll<T>(table: string, options: string = ''): Observable<T[]> {
    return this.http.get<T[]>(
      `${API_CONFIG.apiUrl}/records/${table}?${options}`,
      { withCredentials: true }
    );
  }

  count<T>(
    table: string,
    options: string = ''
  ): Observable<{ results: number }> {
    return this.http.get<{ results: number }>(
      `${API_CONFIG.apiUrl}/records/${table}?page=1,0&${options}`,
      { withCredentials: true }
    );
  }

  getOne<T>(table: string, id: number, options?: string): Observable<T> {
    return this.http.get<T>(
      `${API_CONFIG.apiUrl}/records/${table}/${id}?${options}`,
      { withCredentials: true }
    );
  }

  create<T>(table: string, data: any): Observable<T> {
    return this.http.post<T>(`${API_CONFIG.apiUrl}/records/${table}`, data, {
      withCredentials: true,
    });
  }

  update<T>(table: string, id: number, data: any): Observable<T> {
    return this.http.put<T>(
      `${API_CONFIG.apiUrl}/records/${table}/${id}`,
      data,
      { withCredentials: true }
    );
  }

  delete(table: string, id: number): Observable<void> {
    return this.http.delete<void>(
      `${API_CONFIG.apiUrl}/records/${table}/${id}`,
      { withCredentials: true }
    );
  }

  addFile<T>(api: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${API_CONFIG.apiUrl}/${api}`, formData, {
      withCredentials: true,
    });
  }

  getStat<T>(date1: string = '', date2: string = ''): Observable<T> {
    return this.http.get<T>(
      `${API_CONFIG.apiUrl}/dashboard-stat/${date1}/${date2}`,
      { withCredentials: true }
    );
  }

  exportStat(type: string = '', date1: string = '', date2: string = '') {
    //go to url in new tab
    window.open(
      `${API_CONFIG.apiUrl}/export-stat/${type}/${date1}/${date2}`,
      '_blank'
    );
  }
}
