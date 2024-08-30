import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';
import { Order, OrderBody, User } from '../models/order';
import { ApiStatus } from '../models/common';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  private $$orders = new BehaviorSubject<Order[]>([]);

  $orders = this.$$orders.asObservable();

  private $$users = new BehaviorSubject<User[]>([]);

  $users = this.$$users.asObservable();

  private $$apiStatus = new BehaviorSubject<ApiStatus>({
    success: false,
    error: null,
  });

  $apiStatus = this.$$apiStatus.asObservable();

  getOrders(all: boolean = false) {
    return this.httpClient.get<Order[]>('/api/order', { params: { all: all.toString() } }).pipe(
      tap(orders => {
        this.$$orders.next(orders);
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(null);
      }),
    );
  }

  getUsers() {
    return this.httpClient.get<User[]>('/api/users').pipe(
      tap(users => {
        this.$$users.next(users);
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(null);
      }),
    );
  }

  cancelOrder(orderId: number) {
    return this.httpClient.delete<void>(`/api/order/${orderId}`).pipe(
      tap(() => {
        this.$$apiStatus.next({ success: true, error: null });
      }),
      switchMap(() => {
        return this.getOrders();
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(null);
      }),
    );
  }

  createOrder(order: OrderBody) {
    return this.httpClient.post<{ orderId: number }>('/api/order', order).pipe(
      tap(() => {
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(null);
      }),
    );
  }
}
