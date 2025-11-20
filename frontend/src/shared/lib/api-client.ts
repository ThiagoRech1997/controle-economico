/**
 * API Client
 * Centralized HTTP client using fetch or axios
 * Handles authentication, error handling, and base configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    // Add authentication token if available
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchConfig: RequestInit = {
      method: config.method || 'GET',
      headers,
    };

    if (config.body) {
      fetchConfig.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, fetchConfig);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  private getAuthToken(): string | null {
    // Implement token retrieval from localStorage, cookies, or auth store
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
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
