import { HttpErrorResponse } from '@angular/common/http';
import { ApiStatus } from './common';

export type AuthRequest = { email: string; password: string };

export type AuthResponse = {
  token: string;
};

export const enum UserRoles {
  manager = 'manager',
  user = 'user',
}

export interface ProfileResponse {
  name: string;
  email: string;
  role: UserRoles;
}

export type AuthStatus = { token: string | null; role: UserRoles | null } & ApiStatus;

export enum AuthRoutes {
  signup = '/api/signup',
  signin = '/api/signin',
  logout = '/api/logout',
}

export enum ProfileRoutes {
  profile = '/api/profile',
}

export const enum AuthResponseStatus {
  OK,
  ERROR,
}

export interface RegisterResponce {
  status: AuthResponseStatus;
  error: HttpErrorResponse | null;
}
