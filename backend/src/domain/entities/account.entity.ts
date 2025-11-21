import { AccountType } from '../value-objects/account-type.vo';
import { Currency } from '../value-objects/currency.vo';

/**
 * Account Entity
 *
 * Represents a financial account (bank account, wallet, etc.)
 * Pure domain entity with no framework dependencies.
 */
export class Account {
  private id: string;
  private userId: string;
  private name: string;
  private type: AccountType;
  private initialBalance: number;
  private currency: Currency;
  private isActive: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(props: {
    id: string;
    userId: string;
    name: string;
    type: AccountType;
    initialBalance: number;
    currency: Currency;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.type = props.type;
    this.initialBalance = props.initialBalance;
    this.currency = props.currency;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Account entity
   */
  static create(props: {
    id: string;
    userId: string;
    name: string;
    type: string | AccountType;
    initialBalance: number;
    currency?: string | Currency;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): Account {
    // Validate userId
    if (!props.userId) {
      throw new Error('User ID is required');
    }

    // Validate name
    if (!props.name || props.name.trim().length < 2) {
      throw new Error('Account name must be at least 2 characters long');
    }

    // Validate initial balance
    if (props.initialBalance < 0) {
      throw new Error('Initial balance cannot be negative');
    }

    // Ensure type is a value object
    const type =
      typeof props.type === 'string'
        ? AccountType.create(props.type)
        : props.type;

    // Ensure currency is a value object (default to BRL)
    const currency = props.currency
      ? typeof props.currency === 'string'
        ? Currency.create(props.currency)
        : props.currency
      : Currency.default();

    const now = new Date();

    return new Account({
      id: props.id,
      userId: props.userId,
      name: props.name.trim(),
      type,
      initialBalance: props.initialBalance,
      currency,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now,
    });
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getName(): string {
    return this.name;
  }

  getType(): AccountType {
    return this.type;
  }

  getTypeValue(): string {
    return this.type.getValue();
  }

  getInitialBalance(): number {
    return this.initialBalance;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  getCurrencyValue(): string {
    return this.currency.getValue();
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  updateName(newName: string): void {
    if (!newName || newName.trim().length < 2) {
      throw new Error('Account name must be at least 2 characters long');
    }
    this.name = newName.trim();
    this.updatedAt = new Date();
  }

  updateType(newType: string | AccountType): void {
    this.type =
      typeof newType === 'string' ? AccountType.create(newType) : newType;
    this.updatedAt = new Date();
  }

  updateInitialBalance(newBalance: number): void {
    if (newBalance < 0) {
      throw new Error('Initial balance cannot be negative');
    }
    this.initialBalance = newBalance;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Checks if the account can be deleted
   * Business rule: accounts with transactions cannot be deleted
   */
  canBeDeleted(hasTransactions: boolean): boolean {
    return !hasTransactions;
  }

  /**
   * Converts entity to plain object for persistence
   */
  toObject(): {
    id: string;
    userId: string;
    name: string;
    type: string;
    initialBalance: number;
    currency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      type: this.type.getValue(),
      initialBalance: this.initialBalance,
      currency: this.currency.getValue(),
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
