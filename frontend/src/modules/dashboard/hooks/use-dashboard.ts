/**
 * Dashboard Module - useDashboard Hook
 * React Query hook for fetching dashboard data
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardData } from '../types/dashboard.types';

interface UseDashboardOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const { enabled = true, refetchInterval } = options;

  return useQuery<DashboardData, Error>({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getData(),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval,
  });
}
