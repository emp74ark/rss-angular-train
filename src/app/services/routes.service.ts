import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { ApiStatus, Route } from '../models/common';
import { ExtendedRoute, RouteSchedule } from '../models/route';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  private $$routes = new BehaviorSubject<Route[]>([]);
  $routes = this.$$routes.asObservable();

  private $$apiStatus = new BehaviorSubject<ApiStatus>({
    success: false,
    error: null,
  });
  $apiStatus = this.$$apiStatus.asObservable();

  constructor() {
    this.retrieveRoutes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  retrieveRoutes() {
    return this.httpClient.get<Route[]>('/api/route').pipe(
      tap(routes => {
        this.$$routes.next(routes);
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  createRoute(body: Omit<Route, 'id'>) {
    return this.httpClient.post<{ id: number }>('/api/route', body).pipe(
      tap(() => {
        this.retrieveRoutes();
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  updateRoute(id: number, body: Omit<Route, 'id'>) {
    return this.httpClient.put<{ id: number }>(`/api/route/${id}`, body).pipe(
      tap(() => {
        this.retrieveRoutes();
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  deleteRoute(id: number) {
    return this.httpClient.delete(`/api/route/${id}`).pipe(
      tap(() => {
        const updatedRoutes = (this.$$routes.value || []).filter(route => route.id !== id);
        this.$$routes.next(updatedRoutes);
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  retrieveRouteInfo(id: number) {
    return this.httpClient.get<ExtendedRoute[]>(`/api/route/${id}`).pipe(
      tap(() => {
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  createRide(routeId: number, body: RouteSchedule) {
    return this.httpClient.post<{ rideId: number }>(`/api/route/${routeId}/ride`, body).pipe(
      tap(() => {
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  updateRide(routeId: number, rideId: number, body: RouteSchedule) {
    return this.httpClient.put(`/api/route/${routeId}/ride/${rideId}`, body).pipe(
      tap(() => {
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  deleteRide(routeId: number, rideId: number) {
    return this.httpClient.delete(`/api/route/${routeId}/ride/${rideId}`).pipe(
      tap(() => {
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }
}
