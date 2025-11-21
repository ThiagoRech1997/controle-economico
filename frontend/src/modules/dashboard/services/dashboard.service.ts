/**
 * Dashboard Module - Service Layer
 * Handles dashboard API communication
 */

import { apiClient } from '@/shared/lib/api-client';
import type { DashboardData } from '../types/dashboard.types';

export const dashboardService = {
  /**
   * Get all dashboard data
   */
  async getData(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>('/dashboard');
    return response.data;
  },
};
