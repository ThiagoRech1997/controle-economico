/**
 * Transaction Response DTO (Output Port)
 * Pure TypeScript - No framework dependencies
 * Represents the output format for transaction data
 */
export interface TransactionResponseDto {
  id: string;
  accountId: string;
  categoryId: string;
  type: string;
  amount: number;
  currency: string;
  description?: string;
  date: Date;
  isPaid: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
