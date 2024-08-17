import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthRequest, AuthResponse, AuthStatus } from '../models/auth';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  constructor(private httpClient: HttpClient) {}

  signUpSubscription: Subscription;
  signInSubscription: Subscription;

  $authStatus = new BehaviorSubject<AuthStatus>({
    token: localStorage.getItem('rsToken') || null,
    success: false,
    error: null,
  });

  signUp(body: AuthRequest) {
    this.signUpSubscription = this.httpClient.post<AuthResponse>('/api/signup', body).subscribe({
      next: (res) => {
        this.$authStatus.next({ token: res.token, success: true, error: null });
      },
      error: (err: HttpErrorResponse) => {
        this.$authStatus.next({ token: null, success: false, error: err.error.message });
      },
    });
  }

  signIn(body: AuthRequest) {
    this.signInSubscription = this.httpClient.post<AuthResponse>('/api/signin', body).subscribe({
      next: (res) => {
        this.$authStatus.next({ token: res.token, success: true, error: null });
        localStorage.setItem('rsToken', res.token);
      },
      error: (err: HttpErrorResponse) => {
        this.$authStatus.next({ token: null, success: false, error: err.error.message });
      },
    });
  }

  logOut() {
    this.$authStatus.next({ token: null, success: false, error: null });
    localStorage.removeItem('rsToken');
  }

  ngOnDestroy() {
    if (this.signUpSubscription) {
      this.signInSubscription.unsubscribe();
    }

    if (this.signInSubscription) {
      this.signInSubscription.unsubscribe();
    }
  }
}
