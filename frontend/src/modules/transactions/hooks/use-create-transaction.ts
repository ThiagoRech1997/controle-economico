/**
 * useCreateTransaction Hook
 * React Query mutation hook for creating transactions
 * Handles optimistic updates and cache invalidation
 */
import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { Transaction, CreateTransactionInput } from '../types/transaction.types';

interface UseCreateTransactionOptions {
  onSuccess?: (data: Transaction) => void;
  onError?: (error: Error) => void;
}

export const useCreateTransaction = ({
  onSuccess,
  onError,
}: UseCreateTransactionOptions = {}): UseMutationResult<
  Transaction,
  Error,
  CreateTransactionInput
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionInput) => transactionService.create(data),
    onSuccess: (data) => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // Also invalidate account balance if needed
      queryClient.invalidateQueries({ queryKey: ['accounts'] });

      // Call custom success handler
      onSuccess?.(data);
    },
    onError: (error) => {
      // Call custom error handler
      onError?.(error);
    },
  });
};
