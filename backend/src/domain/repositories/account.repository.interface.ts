import { Account } from '../entities/account.entity';

/**
 * Account Repository Interface (Port)
 *
 * Defines the contract for account persistence operations.
 * Implementation is done in the infrastructure layer.
 */
export interface AccountRepository {
  /**
   * Creates a new account in the database
   */
  create(account: Account): Promise<Account>;

  /**
   * Finds an account by ID
   * Returns null if not found
   */
  findById(id: string): Promise<Account | null>;

  /**
   * Finds all accounts for a specific user
   */
  findByUserId(
    userId: string,
    options?: {
      isActive?: boolean;
      skip?: number;
      take?: number;
    },
  ): Promise<Account[]>;

  /**
   * Updates an existing account
   */
  update(account: Account): Promise<Account>;

  /**
   * Deletes an account by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Checks if an account has any transactions
   */
  hasTransactions(accountId: string): Promise<boolean>;

  /**
   * Gets the current balance of an account
   * (initialBalance + sum of income transactions - sum of expense transactions)
   */
  getBalance(accountId: string): Promise<number>;

  /**
   * Counts total accounts for a user
   */
  countByUserId(userId: string): Promise<number>;

  /**
   * Checks if account name already exists for a user
   */
  existsByNameAndUserId(name: string, userId: string): Promise<boolean>;
}

/**
 * Token to inject the repository implementation
 */
export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');
