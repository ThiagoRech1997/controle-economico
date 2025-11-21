/**
 * Goals Module - Goal Mutations Hooks
 * React Query mutations for goal operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService } from '../services/goal.service';
import type { UpdateGoalInput, UpdateProgressInput, Goal } from '../types/goal.types';

interface UseMutationOptions {
  onSuccess?: (data?: Goal) => void;
  onError?: (error: Error) => void;
}

export function useUpdateGoal(options: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      goalId,
      data,
    }: {
      goalId: string;
      data: UpdateGoalInput;
    }) => goalService.update(goalId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}

export function useUpdateProgress(options: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      goalId,
      data,
    }: {
      goalId: string;
      data: UpdateProgressInput;
    }) => goalService.updateProgress(goalId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}

export function useCompleteGoal(options: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => goalService.complete(goalId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}

export function useCancelGoal(options: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => goalService.cancel(goalId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}

export function useDeleteGoal(options: UseMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => goalService.delete(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
