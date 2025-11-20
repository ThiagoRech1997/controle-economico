/**
 * Create Transaction DTO (Input Port)
 * Pure TypeScript - No framework dependencies
 * Represents the contract for creating a transaction
 */
export interface CreateTransactionDto {
  accountId: string;
  categoryId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  currency?: string;
  description?: string;
  date: Date | string;
  isPaid?: boolean;
  notes?: string;
}
