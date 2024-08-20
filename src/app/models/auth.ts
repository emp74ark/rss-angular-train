import { ApiStatus } from './common';

export type AuthRequest = { email: string; password: string };

export type AuthResponse = {
  token: string;
};

export type AuthStatus = { token: string | null } & ApiStatus;
