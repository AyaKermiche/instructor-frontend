import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Payment } from '../models/payment.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly TABLE = 'payment';

  constructor(private apiService: ApiService) {}

  getAll(options?: string): Observable<Payment[]> {
    return this.apiService.getAll<Payment>(this.TABLE, options).pipe(
      map((res: any) => res.records || [])
    );
  }

  getById(id: number): Observable<Payment> {
    return this.apiService.getOne<Payment>(this.TABLE, id);
  }

  create(data: Omit<Payment, 'id'>): Observable<number> {
    return this.apiService.create<number>(this.TABLE, data);
  }

  update(id: number, data: Partial<Payment>): Observable<Payment> {
    return this.apiService.update<Payment>(this.TABLE, id, data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }
}