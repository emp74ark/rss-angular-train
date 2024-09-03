import { DestroyRef, inject, Injectable, Signal } from '@angular/core';

import { StationConnections } from '../models/stations';
import { CarriageData } from '../models/carriage';
import { StationsService } from './stations.service';
import { CarriageService } from './carriage';

import { Segment } from '../models/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { AdminExtendedRoute, AdminRoutesResponseStatus, ICombinedRoutes } from '../models/admin.routes';
import { RouteSchedule } from '../models/route';

export const ADMIN_ROUTES_API = '/api/route';

@Injectable({
  providedIn: 'root',
})
export class AdminRidesService {
  combinedSignal: Signal<ICombinedRoutes[]>;
  stationsObjSig: Signal<Record<number, StationConnections>>;
  carriagesSig: Signal<CarriageData[]>;

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private stationsService = inject(StationsService);
  private carriageService = inject(CarriageService);

  private $$extendedRoutesRecord = new BehaviorSubject<Record<string, AdminExtendedRoute>>({});
  $extendedRoutesRecord = this.$$extendedRoutesRecord.asObservable();

  constructor() {}

  getRideByRouteId(id: string) {
    return this.httpClient.get<AdminExtendedRoute>(`${ADMIN_ROUTES_API}/${id}`).pipe(
      switchMap(route => {
        const routesRecord = this.$$extendedRoutesRecord.getValue();
        routesRecord[id] = route;
        this.$$extendedRoutesRecord.next({ ...routesRecord });
        return of({ status: AdminRoutesResponseStatus.OK, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        return of({ status: AdminRoutesResponseStatus.ERROR, error });
      }),
    );
  }

  deleteRide({ routeId, rideId }: { routeId: string; rideId: number }) {
    return this.httpClient.delete(`/api/route/${routeId}/ride/${rideId}`).pipe(
      switchMap(() => {
        return this.getRideByRouteId(routeId);

        //TODO: delete from state without reloading;
      }),
      catchError(({ error }: HttpErrorResponse) => {
        return of({ status: AdminRoutesResponseStatus.ERROR, error });
      }),
    );
  }

  updateRide(
    { routeId, rideId }: { routeId: string; rideId: number },
    body: {
      segments: Segment[];
    },
  ) {
    return this.httpClient.put(`/api/route/${routeId}/ride/${rideId}`, body).pipe(
      switchMap(() => {
        const routesRecord = this.$$extendedRoutesRecord.getValue();
        const route = routesRecord[routeId];

        if (route) {
          const rsm: RouteSchedule[] = route.schedule.map((x: RouteSchedule) => {
            const rs: RouteSchedule = { ...x };
            if (x.rideId === rideId) {
              rs.segments = body.segments;
            }
            return rs;
          });
          const newRoute: AdminExtendedRoute = { ...route, schedule: rsm };
          routesRecord[routeId] = newRoute;
        }

        this.$$extendedRoutesRecord.next({ ...routesRecord });
        return of({ status: AdminRoutesResponseStatus.OK, error: null });

        // return this.getRideByRouteId(routeId);
        //TODO: delete from state without reloading;
      }),
      catchError(({ error }: HttpErrorResponse) => {
        return of({ status: AdminRoutesResponseStatus.ERROR, error });
      }),
    );
  }
}
