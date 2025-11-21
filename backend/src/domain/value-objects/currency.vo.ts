/**
 * Currency Value Object
 *
 * Represents a currency code following ISO 4217.
 * Immutable value object following DDD principles.
 */
export enum CurrencyEnum {
  BRL = 'BRL', // Brazilian Real
  USD = 'USD', // US Dollar
  EUR = 'EUR', // Euro
}

export class Currency {
  private readonly value: CurrencyEnum;

  private constructor(currency: CurrencyEnum) {
    this.value = currency;
  }

  static create(currency: string): Currency {
    if (!currency) {
      throw new Error('Currency cannot be empty');
    }

    const upperCurrency = currency.toUpperCase();

    if (!Object.values(CurrencyEnum).includes(upperCurrency as CurrencyEnum)) {
      throw new Error(
        `Invalid currency: ${currency}. Valid currencies are: ${Object.values(CurrencyEnum).join(', ')}`,
      );
    }

    return new Currency(upperCurrency as CurrencyEnum);
  }

  static brl(): Currency {
    return new Currency(CurrencyEnum.BRL);
  }

  static usd(): Currency {
    return new Currency(CurrencyEnum.USD);
  }

  static eur(): Currency {
    return new Currency(CurrencyEnum.EUR);
  }

  static default(): Currency {
    return Currency.brl();
  }

  getValue(): CurrencyEnum {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Currency): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  getSymbol(): string {
    switch (this.value) {
      case CurrencyEnum.BRL:
        return 'R$';
      case CurrencyEnum.USD:
        return '$';
      case CurrencyEnum.EUR:
        return '€';
      default:
        return this.value;
    }
  }

  getLocale(): string {
    switch (this.value) {
      case CurrencyEnum.BRL:
        return 'pt-BR';
      case CurrencyEnum.USD:
        return 'en-US';
      case CurrencyEnum.EUR:
        return 'de-DE';
      default:
        return 'en-US';
    }
  }
}
