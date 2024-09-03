import { computed, DestroyRef, inject, Injectable, Signal } from '@angular/core';

import { StationConnections } from '../models/stations';
import { CarriageData } from '../models/carriage';
import { StationsService } from './stations.service';
import { CarriageService } from './carriage';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { Route } from '../models/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { AdminRoutesResponseStatus, ICombinedRoutes } from '../models/admin.routes';

export const ADMIN_ROUTES_API = '/api/route';

@Injectable({
  providedIn: 'root',
})
export class AdminRoutesService {
  combinedSignal: Signal<ICombinedRoutes[]>;
  stationsObjSig: Signal<Record<number, StationConnections>>;
  carriagesObjSig: Signal<Record<string, CarriageData>>;
  carriagesSig: Signal<CarriageData[]>;
  stationsSig: Signal<StationConnections[]>;

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private stationsService = inject(StationsService);
  private carriageService = inject(CarriageService);

  private $$routes = new BehaviorSubject<Route[]>([]);
  $routes = this.$$routes.asObservable();

  constructor() {
    this.getAllRoutes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    const routesSig = toSignal(this.$$routes, { initialValue: [] });
    this.stationsSig = toSignal(this.stationsService.$stations, { initialValue: [] });
    this.carriagesSig = toSignal(this.carriageService.$carriages, { initialValue: [] });

    this.stationsObjSig = computed(() => {
      return this.stationsSig().reduce((acc, c) => ({ ...acc, [c.id]: c }), {} as Record<number, StationConnections>);
    });
    this.carriagesObjSig = computed(() => {
      return this.carriagesSig().reduce((acc, s) => ({ ...acc, [s.code]: s }), {} as Record<string, CarriageData>);
    });

    this.combinedSignal = computed(() => {
      const routes = routesSig();
      const stationsObj = this.stationsObjSig();
      const carriagesObj = this.carriagesObjSig();

      return routes.map(route => {
        return {
          id: route.id,
          path: route.path.map(p => stationsObj[p] ?? { id: 0, city: '', latitude: '', longitude: '' }),
          carriages: route.carriages.map(
            p => carriagesObj[p] ?? { code: p, name: '', rows: 1, leftSeats: 1, rightSeats: 1 },
          ),
        };
      });
    });
  }

  getAllRoutes() {
    return this.httpClient.get<Route[]>(ADMIN_ROUTES_API).pipe(
      switchMap(routes => {
        this.$$routes.next(routes);
        return of({ status: AdminRoutesResponseStatus.OK, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        return of({ status: AdminRoutesResponseStatus.ERROR, error });
      }),
    );
  }

  postRoute(body: Omit<Route, 'id'>) {
    return this.httpClient.post<{ id: number }>(ADMIN_ROUTES_API, body).pipe(
      switchMap(data => {
        this.$$routes.next([...this.$$routes.getValue(), { ...body, id: data.id }]);
        return of({ status: AdminRoutesResponseStatus.OK, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        return of({ status: AdminRoutesResponseStatus.ERROR, error });
      }),
    );
  }

  putRoute(body: Omit<Route, 'id'>, id: number) {
    return this.httpClient.put<{ id: number }>(`${ADMIN_ROUTES_API}/${id}`, body).pipe(
      switchMap(() => {
        this.$$routes.next([...this.$$routes.getValue().map(x => (x.id === id ? { ...body, id } : x))]);
        return of({ status: AdminRoutesResponseStatus.OK, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        return of({ status: AdminRoutesResponseStatus.ERROR, error });
      }),
    );
  }

  deleteRoute(id: number) {
    return this.httpClient.delete(`/api/route/${id}`).pipe(
      switchMap(() => {
        const updatedRoutes = this.$$routes.value.filter(route => route.id !== id);
        this.$$routes.next(updatedRoutes);
        return of({ status: AdminRoutesResponseStatus.OK, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        return of({ status: AdminRoutesResponseStatus.ERROR, error });
      }),
    );
  }
}
