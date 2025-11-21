/**
 * Accounts Module - Service Layer
 * Handles all account-related API communication
 */

import { apiClient } from '@/shared/lib/api-client';
import type {
  Account,
  AccountWithBalance,
  AccountBalance,
  CreateAccountInput,
  UpdateAccountInput,
  AccountFilters,
} from '../types/account.types';

export const accountService = {
  /**
   * Create a new account
   */
  async create(data: CreateAccountInput): Promise<Account> {
    const response = await apiClient.post<Account>('/accounts', data);
    return response.data;
  },

  /**
   * List all accounts for the authenticated user
   */
  async getAll(filters?: AccountFilters): Promise<AccountWithBalance[]> {
    const params = new URLSearchParams();

    if (filters?.isActive !== undefined) {
      params.append('isActive', String(filters.isActive));
    }
    if (filters?.includeBalance) {
      params.append('includeBalance', 'true');
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/accounts?${queryString}` : '/accounts';

    const response = await apiClient.get<AccountWithBalance[]>(endpoint);
    return response.data;
  },

  /**
   * Get account balance
   */
  async getBalance(accountId: string): Promise<AccountBalance> {
    const response = await apiClient.get<AccountBalance>(
      `/accounts/${accountId}/balance`
    );
    return response.data;
  },

  /**
   * Update an account
   */
  async update(accountId: string, data: UpdateAccountInput): Promise<Account> {
    const response = await apiClient.put<Account>(
      `/accounts/${accountId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete an account
   */
  async delete(accountId: string): Promise<void> {
    await apiClient.delete(`/accounts/${accountId}`);
  },
};
