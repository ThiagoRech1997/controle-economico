/**
 * Auth Module - Type Definitions
 * Frontend types aligned with backend DTOs
 */

/**
 * User entity returned from API
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date | string;
}

/**
 * Input for user login
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Input for user registration
 */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Response from authentication endpoints (login/register/refresh)
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

/**
 * Input for token refresh
 */
export interface RefreshTokenInput {
  refreshToken: string;
}

/**
 * Auth state for Zustand store
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth actions for Zustand store
 */
export interface AuthActions {
  setAuth: (response: AuthResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
}

/**
 * Combined auth store type
 */
export type AuthStore = AuthState & AuthActions;
