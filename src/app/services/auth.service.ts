import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthRequest, AuthResponse, AuthStatus } from '../models/auth';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  constructor(private httpClient: HttpClient) {}

  subscriptions: Subscription[] = [];

  $authStatus = new BehaviorSubject<AuthStatus>({
    token: null, // todo: get data from the local storage
    success: false,
    error: null,
  });

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
      //   todo: save token to the localstorage
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
