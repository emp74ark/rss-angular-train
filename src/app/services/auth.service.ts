import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthRequest, AuthResponse, AuthStatus } from '../models/auth';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  constructor(private httpClient: HttpClient) {}

  subscriptions: Subscription[] = [];

  $authStatus = new Subject<AuthStatus>();

  signUp(body: AuthRequest) {
    const signUpSubscription = this.httpClient.post<AuthResponse>('/api/signup', body).subscribe({
      next: (res) => {
        this.$authStatus.next({ token: res.token, success: true, error: null });
      },
      error: (err: HttpErrorResponse) => {
        this.$authStatus.next({ token: null, success: false, error: err.error.message });
      },
    });

    this.subscriptions.push(signUpSubscription);
  }

  signIn(body: AuthRequest) {
    const signInSubscription = this.httpClient.post<AuthResponse>('/api/signin', body).subscribe({
      next: (res) => {
        this.$authStatus.next({ token: res.token, success: true, error: null });
      },
      error: (err: HttpErrorResponse) => {
        this.$authStatus.next({ token: null, success: false, error: err.error.message });
      },
    });

    this.subscriptions.push(signInSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
