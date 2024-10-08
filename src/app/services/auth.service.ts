import { DestroyRef, inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  AuthRequest,
  AuthResponse,
  AuthResponseStatus,
  AuthStatus,
  ProfileResponse,
  ProfileRoutes,
} from '../models/auth';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';
import { AuthRoutes } from '../models/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private $$authStatus = new BehaviorSubject<AuthStatus>({
    token: localStorage.getItem('rsToken') || null,
    success: false,
    error: null,
    role: null,
  });

  $authStatus = this.$$authStatus.asObservable();

  constructor(private httpClient: HttpClient) {
    if (this.$$authStatus.getValue().token) {
      this.getRole().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
  }

  signUp(body: AuthRequest) {
    return this.httpClient.post<AuthResponse>(AuthRoutes.Signup, body).pipe(
      switchMap(() => {
        this.$$authStatus.next({ token: null, success: true, error: null, role: null });
        return of({ status: AuthResponseStatus.OK, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$authStatus.next({ token: null, success: false, error: error.message, role: null });
        return of({ status: AuthResponseStatus.ERROR, error });
      }),
    );
  }

  signIn(body: AuthRequest) {
    this.cleanToken();
    return this.httpClient.post<AuthResponse>(AuthRoutes.Signin, body).pipe(
      switchMap(res => {
        this.$$authStatus.next({ token: res.token, success: true, error: null, role: null });
        localStorage.setItem('rsToken', res.token);
        return this.getRole();
      }),
      catchError((a: HttpErrorResponse) => {
        const { error } = a;
        this.$$authStatus.next({ token: null, success: false, error: error.message, role: null });
        return of({ status: AuthResponseStatus.ERROR, error });
      }),
    );
  }

  getRole() {
    return this.httpClient.get<ProfileResponse>(ProfileRoutes.Profile).pipe(
      switchMap(res => {
        const resStatus: AuthStatus = {
          ...this.$$authStatus.getValue(),
          role: res.role,
        };
        this.$$authStatus.next(resStatus);
        return of({ status: AuthResponseStatus.OK, error: null });
      }),
      catchError(({ error }: HttpErrorResponse) => {
        this.$$authStatus.next({ token: null, success: false, error: error.message, role: null });
        return of({ status: AuthResponseStatus.ERROR, error });
      }),
    );
  }

  logOut() {
    this.httpClient
      .delete(AuthRoutes.Logout)
      .pipe(
        catchError(({ error }: HttpErrorResponse) => {
          return of({ status: AuthResponseStatus.ERROR, error });
        }),
      )
      .pipe(
        tap(() => {
          this.cleanToken();
          this.router.navigate(['/']);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private cleanToken() {
    this.$$authStatus.next({ token: null, success: false, error: null, role: null });
    localStorage.removeItem('rsToken');
  }
}
