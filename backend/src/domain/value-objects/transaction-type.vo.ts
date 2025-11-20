/**
 * Transaction Type Value Object
 * Ensures type safety for transaction types
 * Pure TypeScript - No framework dependencies
 */
export enum TransactionTypeEnum {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class TransactionType {
  private readonly _value: TransactionTypeEnum;

  private constructor(value: TransactionTypeEnum) {
    this._value = value;
  }

  static income(): TransactionType {
    return new TransactionType(TransactionTypeEnum.INCOME);
  }

  static expense(): TransactionType {
    return new TransactionType(TransactionTypeEnum.EXPENSE);
  }

  static fromString(value: string): TransactionType {
    const upperValue = value.toUpperCase();

    if (upperValue === TransactionTypeEnum.INCOME) {
      return TransactionType.income();
    }

    if (upperValue === TransactionTypeEnum.EXPENSE) {
      return TransactionType.expense();
    }

    throw new Error(`Invalid transaction type: ${value}`);
  }

  get value(): string {
    return this._value;
  }

  isIncome(): boolean {
    return this._value === TransactionTypeEnum.INCOME;
  }

  isExpense(): boolean {
    return this._value === TransactionTypeEnum.EXPENSE;
  }

  equals(other: TransactionType): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
