/**
 * API Client
 * Centralized HTTP client with authentication and token refresh
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const TOKEN_STORAGE_KEY = 'authToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
const USER_STORAGE_KEY = 'authUser';

interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  skipAuth?: boolean;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Subscribe to token refresh completion
   */
  private subscribeToTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notify all subscribers that token has been refreshed
   */
  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Attempt to refresh the access token
   */
  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // Refresh failed, clear tokens
        this.clearTokens();
        return null;
      }

      const data: AuthResponse = await response.json();

      // Store new tokens
      this.setTokens(data.accessToken, data.refreshToken, data.user);

      return data.accessToken;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  /**
   * Handle 401 Unauthorized response
   */
  private async handle401<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<{ data: T } | null> {
    if (this.isRefreshing) {
      // Wait for the token to be refreshed
      return new Promise((resolve) => {
        this.subscribeToTokenRefresh(async (token) => {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
          const result = await this.request<T>(endpoint, {
            ...config,
            skipAuth: true,
          });
          resolve(result);
        });
      });
    }

    this.isRefreshing = true;

    const newToken = await this.refreshAccessToken();

    this.isRefreshing = false;

    if (newToken) {
      this.onTokenRefreshed(newToken);

      // Retry the original request with new token
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${newToken}`,
      };
      return this.request<T>(endpoint, { ...config, skipAuth: true });
    }

    // Refresh failed, redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    return null;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    // Add authentication token if available and not skipped
    if (!config.skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const fetchConfig: RequestInit = {
      method: config.method || 'GET',
      headers,
    };

    if (config.body) {
      fetchConfig.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, fetchConfig);

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && !config.skipAuth) {
      const isAuthEndpoint =
        endpoint.includes('/auth/login') ||
        endpoint.includes('/auth/register') ||
        endpoint.includes('/auth/refresh');

      if (!isAuthEndpoint) {
        const retryResult = await this.handle401<T>(endpoint, config);
        if (retryResult) {
          return retryResult;
        }
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    }
    return null;
  }

  private setTokens(
    accessToken: string,
    refreshToken: string,
    user: AuthResponse['user']
  ): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  async get<T>(endpoint: string): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  async put<T>(endpoint: string, body: any): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  async delete<T>(endpoint: string): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
