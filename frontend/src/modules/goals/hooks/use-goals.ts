/**
 * Goals Module - useGoals Hook
 * React Query hook for fetching goals
 */

import { useQuery } from '@tanstack/react-query';
import { goalService } from '../services/goal.service';
import type { GoalFilters, Goal } from '../types/goal.types';

interface UseGoalsOptions {
  filters?: GoalFilters;
  enabled?: boolean;
}

export function useGoals(options: UseGoalsOptions = {}) {
  const { filters, enabled = true } = options;

  return useQuery<Goal[], Error>({
    queryKey: ['goals', filters],
    queryFn: () => goalService.getAll(filters),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
}
