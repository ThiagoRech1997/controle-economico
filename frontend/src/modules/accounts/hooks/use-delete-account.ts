/**
 * Accounts Module - useDeleteAccount Hook
 * React Query mutation for deleting accounts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

interface UseDeleteAccountOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteAccount(options: UseDeleteAccountOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => accountService.delete(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
