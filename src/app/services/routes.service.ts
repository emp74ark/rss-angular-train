import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { ApiStatus, Route } from '../models/common';
import { RouteSchedule } from '../models/route';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  constructor(private httpClient: HttpClient) {}

  private $$routes = new BehaviorSubject<Route[]>([]);
  $routes = this.$$routes.asObservable();

  private $$apiStatus = new BehaviorSubject<ApiStatus>({
    success: false,
    error: null,
  });
  $apiStatus = this.$$apiStatus.asObservable();

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
    return this.httpClient.post<Route>('/api/route', body).pipe(
      tap(route => {
        this.$$routes.next([...(this.$$routes.value || []), route]);
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  updateRoute(id: number, body: Omit<Route, 'id'>) {
    return this.httpClient.put<Route>(`/api/route/${id}`, body).pipe(
      tap(updatedRoute => {
        const updatedRoutes = (this.$$routes.value || []).map(route => (route.id === id ? updatedRoute : route));
        this.$$routes.next(updatedRoutes);
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
    return this.httpClient.get<Route>(`/api/route/${id}`).pipe(
      tap(route => {
        this.$$routes.next([...(this.$$routes.value || []), route]);
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  createRide(routeId: number, body: RouteSchedule) {
    return this.httpClient.post(`/api/route/${routeId}/ride`, body).pipe(
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
}
