import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Profile } from '../models/profile';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { ApiStatus } from '../models/common';

@Injectable({
  providedIn: 'root',
})

export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  private $$profile = new BehaviorSubject<Profile | null>(null);

  $profile = this.$$profile.asObservable();

  private $$apiStatus = new BehaviorSubject<ApiStatus>({
    success: false,
    error: null,
  });

  $apiStatus = this.$$apiStatus.asObservable();

  loadProfile() {
    return this.httpClient.get<Profile>('/api/profile').pipe(
      tap((profile) => {
        this.$$profile.next(profile);
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  updateProfile(body: Omit<Profile, 'role'>) {
    return this.httpClient.put<Profile>('/api/profile', body).pipe(
      tap((profile) => {
        this.$$profile.next(profile);
        this.$$apiStatus.next({ success: true, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$apiStatus.next({ success: false, error: error.message });
        return of(error);
      }),
    );
  }

  updatePassword(body: { password: string }) {
    return this.httpClient.put('/api/profile/password', body).pipe(
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
