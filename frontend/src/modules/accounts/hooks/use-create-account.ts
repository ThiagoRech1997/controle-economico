/**
 * Accounts Module - useCreateAccount Hook
 * React Query mutation for creating accounts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { CreateAccountInput, Account } from '../types/account.types';

interface UseCreateAccountOptions {
  onSuccess?: (data: Account) => void;
  onError?: (error: Error) => void;
}

export function useCreateAccount(options: UseCreateAccountOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountInput) => accountService.create(data),
    onSuccess: (data) => {
      // Invalidate accounts query to refetch
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
