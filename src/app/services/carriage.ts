import { DestroyRef, inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';

import { CarriageBody, CarriageData, CarriagePostResponse, CarriageResponseStatus } from '../models/carriage';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const CARRIAGE_API = '/api/carriage';

@Injectable({
  providedIn: 'root',
})
export class CarriageService {
  private http = inject(HttpClient);
  private $$carriages = new BehaviorSubject<Array<CarriageData>>([]);
  private destroyRef = inject(DestroyRef);
  $carriages = this.$$carriages.asObservable();

  constructor() {
    this.get().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  get() {
    return this.http.get<Array<CarriageData>>(CARRIAGE_API).pipe(
      switchMap(data => {
        this.$$carriages.next(data);
        //TODO: need to check and change to error:null
        return of({ status: CarriageResponseStatus.OK, data });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        return of({ status: CarriageResponseStatus.ERROR, error });
      }),
    );
  }

  post(body: CarriageBody) {
    return this.http.post<CarriagePostResponse>(CARRIAGE_API, body).pipe(
      switchMap(data => {
        this.$$carriages.next([{ ...body, code: data.code }, ...this.$$carriages.getValue()]);
        return of({ status: CarriageResponseStatus.OK, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        return of({ status: CarriageResponseStatus.ERROR, error });
      }),
    );
  }

  put(body: CarriageBody, code: string) {
    return this.http.put<CarriagePostResponse>(`${CARRIAGE_API}/${code}`, body).pipe(
      switchMap(() => {
        this.$$carriages.next([...this.$$carriages.getValue().map(x => (x.code === code ? { ...body, code } : x))]);
        return of({ status: CarriageResponseStatus.OK, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        return of({ status: CarriageResponseStatus.ERROR, error });
      }),
    );
  }

  delete(code: string) {
    return this.http.delete<CarriagePostResponse>(`${CARRIAGE_API}/${code}`).pipe(
      switchMap(() => {
        this.$$carriages.next([...this.$$carriages.getValue().filter(x => x.code !== code)]);
        return of({ status: CarriageResponseStatus.OK, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$carriages.next([...this.$$carriages.getValue()]);
        return of({ status: CarriageResponseStatus.ERROR, error });
      }),
    );
  }
}
