import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { ApiStatus, SearchResult } from '../models/common';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private httpClient: HttpClient) {}

  private $$searchResults = new BehaviorSubject<SearchResult | null>(null);

  $searchResults = this.$$searchResults.asObservable();

  private $$apiStatus = new BehaviorSubject<ApiStatus>({
    success: false,
    error: null,
  });

  $apiStatus = this.$$apiStatus.asObservable();

  search(searchParams: {
    fromLatitude: number;
    fromLongitude: number;
    toLatitude: number;
    toLongitude: number;
    time?: string;
  }) {
    console.log('search');
    return this.httpClient
      .get<SearchResult>('/api/search', {
        params: searchParams,
      })
      .pipe(
        tap(result => {
          this.$$searchResults.next(result);
          this.$$apiStatus.next({ success: true, error: null });
          console.log('result', result);
        }),
        catchError(({ error }: HttpErrorResponse) => {
          this.$$searchResults.next(null);
          this.$$apiStatus.next({ success: false, error: error.message });
          return of(error);
        }),
      );
  }

  searchRide(rideId: number) {
    return this.httpClient.get(`/api/search/${rideId}`).pipe(
      tap(() => {
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$searchResults.next(null);
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }
}
