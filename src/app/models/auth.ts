export type AuthRequest = { email: string; password: string };

export type AuthResponse = {
  token: string;
};

export type AuthStatus = {
  token: string | null;
  success: boolean;
  error: string | null;
};
