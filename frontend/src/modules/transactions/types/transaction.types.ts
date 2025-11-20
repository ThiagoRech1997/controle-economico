/**
 * Transaction Module - Type Definitions
 * Frontend types aligned with backend DTOs
 */

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  date: Date | string;
  isPaid: boolean;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateTransactionInput {
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  currency?: string;
  description?: string;
  date: Date | string;
  isPaid?: boolean;
  notes?: string;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  startDate?: Date;
  endDate?: Date;
  isPaid?: boolean;
}

export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
