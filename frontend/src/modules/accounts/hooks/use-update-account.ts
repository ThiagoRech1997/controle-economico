/**
 * Accounts Module - useUpdateAccount Hook
 * React Query mutation for updating accounts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { UpdateAccountInput, Account } from '../types/account.types';

interface UseUpdateAccountOptions {
  onSuccess?: (data: Account) => void;
  onError?: (error: Error) => void;
}

export function useUpdateAccount(options: UseUpdateAccountOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      data,
    }: {
      accountId: string;
      data: UpdateAccountInput;
    }) => accountService.update(accountId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
