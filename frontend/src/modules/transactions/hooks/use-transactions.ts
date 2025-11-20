/**
 * useTransactions Hook
 * React Query hook for fetching transactions
 * Encapsulates server state management
 */
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { PaginatedTransactions, TransactionFilters } from '../types/transaction.types';

interface UseTransactionsOptions {
  filters?: TransactionFilters;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export const useTransactions = ({
  filters,
  page = 1,
  limit = 10,
  enabled = true,
}: UseTransactionsOptions = {}): UseQueryResult<PaginatedTransactions, Error> => {
  return useQuery({
    queryKey: ['transactions', filters, page, limit],
    queryFn: () => transactionService.getAll(filters, page, limit),
    enabled,
    staleTime: 30000, // 30 seconds
  });
};
