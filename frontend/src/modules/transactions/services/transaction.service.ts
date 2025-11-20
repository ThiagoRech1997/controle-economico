/**
 * Transaction Service
 * Handles API communication for transactions
 * Uses the shared API client
 */
import { apiClient } from '@/shared/lib/api-client';
import {
  Transaction,
  CreateTransactionInput,
  TransactionFilters,
  PaginatedTransactions,
} from '../types/transaction.types';

const TRANSACTIONS_ENDPOINT = '/transactions';

export const transactionService = {
  /**
   * Create a new transaction
   */
  async create(data: CreateTransactionInput): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(TRANSACTIONS_ENDPOINT, data);
    return response.data;
  },

  /**
   * Get all transactions with filters
   */
  async getAll(
    filters?: TransactionFilters,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedTransactions> {
    const params = new URLSearchParams();

    if (filters?.accountId) params.append('accountId', filters.accountId);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters?.isPaid !== undefined) params.append('isPaid', String(filters.isPaid));

    params.append('page', String(page));
    params.append('limit', String(limit));

    const response = await apiClient.get<PaginatedTransactions>(
      `${TRANSACTIONS_ENDPOINT}?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * Get a single transaction by ID
   */
  async getById(id: string): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`${TRANSACTIONS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Update a transaction
   */
  async update(id: string, data: Partial<CreateTransactionInput>): Promise<Transaction> {
    const response = await apiClient.put<Transaction>(`${TRANSACTIONS_ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a transaction
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${TRANSACTIONS_ENDPOINT}/${id}`);
  },
};
