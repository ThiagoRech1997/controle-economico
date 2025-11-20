/**
 * Money Value Object
 * Encapsulates monetary value with validation
 * Pure TypeScript - No framework dependencies
 */
export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'BRL') {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }

    if (!currency || currency.length !== 3) {
      throw new Error('Invalid currency code');
    }

    this._amount = Math.round(amount * 100) / 100; // Round to 2 decimals
    this._currency = currency.toUpperCase();
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    if (this._amount < other._amount) {
      throw new Error('Resulting amount would be negative');
    }
    return new Money(this._amount - other._amount, this._currency);
  }

  isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount > other._amount;
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  private ensureSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error('Cannot operate on different currencies');
    }
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }
}
