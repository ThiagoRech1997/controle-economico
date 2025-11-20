/**
 * Transaction Repository Interface (Port)
 * Pure TypeScript - No framework dependencies
 * Defines the contract for data access
 */
import { Transaction } from '../entities/transaction.entity';

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  isPaid?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MonthlySurplus {
  averageMonthlySurplus: number;
  monthsAnalyzed: number;
}

/**
 * Repository port for Transaction aggregate
 * This is an interface (Port) that will be implemented by adapters in the infrastructure layer
 */
export abstract class ITransactionRepository {
  /**
   * Save a new transaction
   */
  abstract save(transaction: Transaction): Promise<Transaction>;

  /**
   * Update an existing transaction
   */
  abstract update(transaction: Transaction): Promise<Transaction>;

  /**
   * Find transaction by ID
   */
  abstract findById(id: string): Promise<Transaction | null>;

  /**
   * Find all transactions for a specific account
   */
  abstract findByAccountId(accountId: string): Promise<Transaction[]>;

  /**
   * Find transactions with filters and pagination
   */
  abstract findWithFilters(
    filters: TransactionFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Transaction>>;

  /**
   * Delete a transaction
   */
  abstract delete(id: string): Promise<void>;

  /**
   * Calculate average monthly surplus (Income - Expenses) for a user
   * Used by forecasting logic
   */
  abstract calculateAverageMonthlySurplus(
    userId: string,
    monthsToAnalyze: number,
  ): Promise<MonthlySurplus>;

  /**
   * Get total income for a period
   */
  abstract getTotalIncome(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number>;

  /**
   * Get total expenses for a period
   */
  abstract getTotalExpenses(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number>;

  /**
   * Get essential expenses for a period
   */
  abstract getEssentialExpenses(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number>;

  /**
   * Get non-essential expenses for a period
   */
  abstract getNonEssentialExpenses(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number>;
}
