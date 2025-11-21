/**
 * Account Type Value Object
 *
 * Represents the type of financial account.
 * Immutable value object following DDD principles.
 */
export enum AccountTypeEnum {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CASH = 'CASH',
  INVESTMENT = 'INVESTMENT',
}

export class AccountType {
  private readonly value: AccountTypeEnum;

  private constructor(type: AccountTypeEnum) {
    this.value = type;
  }

  static create(type: string): AccountType {
    if (!type) {
      throw new Error('Account type cannot be empty');
    }

    const upperType = type.toUpperCase();

    if (!Object.values(AccountTypeEnum).includes(upperType as AccountTypeEnum)) {
      throw new Error(
        `Invalid account type: ${type}. Valid types are: ${Object.values(AccountTypeEnum).join(', ')}`,
      );
    }

    return new AccountType(upperType as AccountTypeEnum);
  }

  static checking(): AccountType {
    return new AccountType(AccountTypeEnum.CHECKING);
  }

  static savings(): AccountType {
    return new AccountType(AccountTypeEnum.SAVINGS);
  }

  static cash(): AccountType {
    return new AccountType(AccountTypeEnum.CASH);
  }

  static investment(): AccountType {
    return new AccountType(AccountTypeEnum.INVESTMENT);
  }

  getValue(): AccountTypeEnum {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: AccountType): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  isChecking(): boolean {
    return this.value === AccountTypeEnum.CHECKING;
  }

  isSavings(): boolean {
    return this.value === AccountTypeEnum.SAVINGS;
  }

  isCash(): boolean {
    return this.value === AccountTypeEnum.CASH;
  }

  isInvestment(): boolean {
    return this.value === AccountTypeEnum.INVESTMENT;
  }
}
