/**
 * Goals Module - useCreateGoal Hook
 * React Query mutation for creating goals
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService } from '../services/goal.service';
import type { CreateGoalInput, Goal } from '../types/goal.types';

interface UseCreateGoalOptions {
  onSuccess?: (data: Goal) => void;
  onError?: (error: Error) => void;
}

export function useCreateGoal(options: UseCreateGoalOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalInput) => goalService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
