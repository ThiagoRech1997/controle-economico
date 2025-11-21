/**
 * Auth Module - Service Layer
 * Handles all authentication-related API communication
 */

import { apiClient } from '@/shared/lib/api-client';
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
  RefreshTokenInput,
  User,
} from '../types/auth.types';

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Login with email and password
   */
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(data: RefreshTokenInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', data);
    return response.data;
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },
};
