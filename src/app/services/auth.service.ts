import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthRequest, AuthResponse, AuthStatus } from '../models/auth';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  private $$authStatus = new BehaviorSubject<AuthStatus>({
    token: localStorage.getItem('rsToken') || null,
    success: false,
    error: null,
  });

  $authStatus = this.$$authStatus.asObservable();

  signUp(body: AuthRequest) {
    return this.httpClient.post<AuthResponse>('/api/signup', body).pipe(
      switchMap(() => {
        return this.signIn(body);
      }),
      catchError((err: HttpErrorResponse) => {
        this.$$authStatus.next({ token: null, success: false, error: err.error.message });
        return of(err);
      }),
    );
  }

  signIn(body: AuthRequest) {
    return this.httpClient.post<AuthResponse>('/api/signin', body).pipe(
      tap((res) => {
        this.$$authStatus.next({ token: res.token, success: true, error: null });
        localStorage.setItem('rsToken', res.token);
      }),
      catchError((err: HttpErrorResponse) => {
        this.$$authStatus.next({ token: null, success: false, error: err.error.message });
        return of(err);
      }),
    );
  }

  logOut() {
    this.$$authStatus.next({ token: null, success: false, error: null });
    localStorage.removeItem('rsToken');
  }
}
