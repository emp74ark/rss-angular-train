import { DestroyRef, inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StationConnections, StationRelations } from '../models/stations';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';
import { ApiStatus } from '../models/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  constructor() {
    this.getStations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private $$stations = new BehaviorSubject<StationConnections[]>([]);

  $stations = this.$$stations.asObservable();

  private $$apiStatus = new BehaviorSubject<ApiStatus>({
    success: false,
    error: null,
  });

  $apiStatus = this.$$apiStatus.asObservable();

  getStations() {
    return this.httpClient.get<StationConnections[]>('/api/station').pipe(
      tap(list => {
        this.$$stations.next(list);
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  getStationById(id: number) {
    return this.$$stations.pipe(
      switchMap(list => {
        return of(list.find(el => el.id === id));
      }),
      catchError(({ error }: HttpErrorResponse) => {
        console.log(error);
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  createStation(body: StationRelations) {
    return this.httpClient.post<{ id: number }>('/api/station', body).pipe(
      tap(() => {
        this.$$apiStatus.next({ success: true, error: null });
      }),
      switchMap(() => {
        return this.getStations();
      }),
      switchMap(() => {
        return of(null);
      }),
      catchError((httpError: HttpErrorResponse) => {
        const { error } = httpError;
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(httpError);
      }),
    );
  }

  deleteStation(id: number) {
    return this.httpClient.delete(`/api/station/${id}`).pipe(
      tap(() => {
        this.$$apiStatus.next({ success: true, error: null });
      }),
      switchMap(() => {
        return this.getStations();
      }),
      switchMap(() => {
        return of(null);
      }),
      catchError((httpError: HttpErrorResponse) => {
        const { error } = httpError;
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(httpError);
      }),
    );
  }
}
