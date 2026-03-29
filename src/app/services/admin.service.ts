import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Admin } from '../models/admin.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly TABLE = 'admin';

  constructor(private apiService: ApiService) {}

  getAllAdmins(options?: string): Observable<Admin[]> {
    return this.apiService.getAll<Admin>(this.TABLE, options).pipe(
      map((result: any) => {
        return result.records || [];
      })
    );
  }

  getAdmin(id: number): Observable<Admin> {
    return this.apiService.getOne<Admin>(this.TABLE, id);
  }

  createAdmin(admin: Omit<Admin, 'id'>): Observable<number> {
    return this.apiService.create<number>(this.TABLE, admin);
  }

  updateAdmin(id: number, admin: Partial<Admin>): Observable<Admin> {
    return this.apiService.update<Admin>(this.TABLE, id, admin);
  }

  deleteAdmin(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }
}