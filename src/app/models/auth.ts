import { HttpErrorResponse } from '@angular/common/http';
import { ApiStatus } from './common';

export type AuthRequest = { email: string; password: string };

export type AuthResponse = {
  token: string;
};

export const enum UserRoles {
  Manager = 'manager',
  User = 'user',
}

export interface ProfileResponse {
  name: string;
  email: string;
  role: UserRoles;
}

export type AuthStatus = { token: string | null; role: UserRoles | null } & ApiStatus;

export enum AuthRoutes {
  Signup = '/api/signup',
  Signin = '/api/signin',
  Logout = '/api/logout',
}

export enum ProfileRoutes {
  Profile = '/api/profile',
}

export const enum AuthResponseStatus {
  OK,
  ERROR,
}

export interface RegisterResponce {
  status: AuthResponseStatus;
  error: HttpErrorResponse | null;
}
