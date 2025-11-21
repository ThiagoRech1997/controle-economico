/**
 * Accounts Module - useAccounts Hook
 * React Query hook for fetching accounts
 */

import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import type { AccountFilters, AccountWithBalance } from '../types/account.types';

interface UseAccountsOptions {
  filters?: AccountFilters;
  enabled?: boolean;
}

export function useAccounts(options: UseAccountsOptions = {}) {
  const { filters = { includeBalance: true }, enabled = true } = options;

  return useQuery<AccountWithBalance[], Error>({
    queryKey: ['accounts', filters],
    queryFn: () => accountService.getAll(filters),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
}
