/**
 * Accounts Module - Type Definitions
 * Frontend types aligned with backend DTOs
 */

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CASH' | 'INVESTMENT';
export type Currency = 'BRL' | 'USD' | 'EUR';

/**
 * Account entity returned from API
 */
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  currency: Currency;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Account with calculated balance
 */
export interface AccountWithBalance extends Account {
  currentBalance: number;
}

/**
 * Account balance response
 */
export interface AccountBalance {
  accountId: string;
  initialBalance: number;
  currentBalance: number;
  currency: Currency;
}

/**
 * Input for creating an account
 */
export interface CreateAccountInput {
  name: string;
  type: AccountType;
  initialBalance: number;
  currency?: Currency;
  isActive?: boolean;
}

/**
 * Input for updating an account
 */
export interface UpdateAccountInput {
  name?: string;
  type?: AccountType;
  isActive?: boolean;
}

/**
 * Filters for listing accounts
 */
export interface AccountFilters {
  isActive?: boolean;
  includeBalance?: boolean;
}
