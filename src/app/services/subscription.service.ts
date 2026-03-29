/*import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Subscription } from '../models/Subscription.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private readonly TABLE = 'napolitana_subscription_store';

  constructor(private apiService: ApiService) { }

  getAllSubscriptions(options?: string): Observable<Subscription[]> {
    return this.apiService.getAll<Subscription>(this.TABLE, options).pipe(
      map((result: any) => {
        return result.records || [];
      })
    );
  }

  getSubscription(id: number): Observable<Subscription> {
    return this.apiService.getOne<Subscription>(this.TABLE, id);
  }

  createSubscription(user: Omit<Subscription, 'id'>): Observable<number> {
    return this.apiService.create<number>(this.TABLE, user);
  }

  updateSubscription(id: number, user: Partial<Subscription>): Observable<Subscription> {
    return this.apiService.update<Subscription>(this.TABLE, id, user);
  }

  deleteSubscription(id: number): Observable<void> {
    return this.apiService.delete(this.TABLE, id);
  }
}*/
