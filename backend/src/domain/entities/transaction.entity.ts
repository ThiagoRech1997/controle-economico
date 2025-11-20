/**
 * Transaction Entity (Domain Model)
 * Pure TypeScript - No framework dependencies
 * Represents the business logic for financial transactions
 */
import { Money } from '../value-objects/money.vo';
import { TransactionType } from '../value-objects/transaction-type.vo';

export interface TransactionProps {
  id: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: Money;
  description?: string;
  date: Date;
  isPaid: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Transaction {
  private readonly _id: string;
  private _accountId: string;
  private _categoryId: string;
  private _type: TransactionType;
  private _amount: Money;
  private _description?: string;
  private _date: Date;
  private _isPaid: boolean;
  private _notes?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: TransactionProps) {
    this._id = props.id;
    this._accountId = props.accountId;
    this._categoryId = props.categoryId;
    this._type = props.type;
    this._amount = props.amount;
    this._description = props.description;
    this._date = props.date;
    this._isPaid = props.isPaid;
    this._notes = props.notes;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Factory method to create a new transaction
   */
  static create(
    id: string,
    accountId: string,
    categoryId: string,
    type: TransactionType,
    amount: Money,
    date: Date,
    isPaid: boolean = true,
    description?: string,
    notes?: string,
  ): Transaction {
    // Business rule: Amount must be positive
    if (amount.amount <= 0) {
      throw new Error('Transaction amount must be greater than zero');
    }

    // Business rule: Date cannot be in the future (more than 1 day)
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    if (date > oneDayFromNow) {
      throw new Error('Transaction date cannot be more than 1 day in the future');
    }

    return new Transaction({
      id,
      accountId,
      categoryId,
      type,
      amount,
      description,
      date,
      isPaid,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Factory method to reconstruct from persistence
   */
  static reconstruct(props: TransactionProps): Transaction {
    return new Transaction(props);
  }

  // ============================================
  // Business Methods
  // ============================================

  /**
   * Mark transaction as paid
   */
  markAsPaid(): void {
    if (this._isPaid) {
      throw new Error('Transaction is already paid');
    }
    this._isPaid = true;
    this._updatedAt = new Date();
  }

  /**
   * Mark transaction as pending
   */
  markAsPending(): void {
    if (!this._isPaid) {
      throw new Error('Transaction is already pending');
    }
    this._isPaid = false;
    this._updatedAt = new Date();
  }

  /**
   * Update transaction amount
   */
  updateAmount(newAmount: Money): void {
    if (newAmount.amount <= 0) {
      throw new Error('Transaction amount must be greater than zero');
    }

    if (!newAmount.equals(this._amount)) {
      this._amount = newAmount;
      this._updatedAt = new Date();
    }
  }

  /**
   * Update transaction description
   */
  updateDescription(description?: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  /**
   * Update transaction notes
   */
  updateNotes(notes?: string): void {
    this._notes = notes;
    this._updatedAt = new Date();
  }

  /**
   * Update transaction date
   */
  updateDate(date: Date): void {
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    if (date > oneDayFromNow) {
      throw new Error('Transaction date cannot be more than 1 day in the future');
    }

    this._date = date;
    this._updatedAt = new Date();
  }

  /**
   * Update category
   */
  updateCategory(categoryId: string): void {
    if (categoryId !== this._categoryId) {
      this._categoryId = categoryId;
      this._updatedAt = new Date();
    }
  }

  /**
   * Check if transaction affects account balance
   */
  affectsBalance(): boolean {
    return this._isPaid;
  }

  // ============================================
  // Getters
  // ============================================

  get id(): string {
    return this._id;
  }

  get accountId(): string {
    return this._accountId;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get type(): TransactionType {
    return this._type;
  }

  get amount(): Money {
    return this._amount;
  }

  get description(): string | undefined {
    return this._description;
  }

  get date(): Date {
    return this._date;
  }

  get isPaid(): boolean {
    return this._isPaid;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
