/**
 * Goals Module - useGoalForecast Hook
 * React Query hook for fetching goal forecast
 */

import { useQuery } from '@tanstack/react-query';
import { goalService } from '../services/goal.service';
import type { GoalForecast } from '../types/goal.types';

interface UseGoalForecastOptions {
  goalId: string;
  enabled?: boolean;
}

export function useGoalForecast({ goalId, enabled = true }: UseGoalForecastOptions) {
  return useQuery<GoalForecast, Error>({
    queryKey: ['goals', goalId, 'forecast'],
    queryFn: () => goalService.getForecast(goalId),
    enabled: enabled && !!goalId,
    staleTime: 60 * 1000, // 1 minute
  });
}
