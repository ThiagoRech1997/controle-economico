/**
 * Email Value Object
 *
 * Represents a valid email address with validation rules.
 * Immutable value object following DDD principles.
 */
export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  /**
   * Creates an Email instance with validation
   * @throws Error if email is invalid
   */
  static create(email: string): Email {
    if (!email) {
      throw new Error('Email cannot be empty');
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!Email.isValid(trimmedEmail)) {
      throw new Error('Invalid email format');
    }

    return new Email(trimmedEmail);
  }

  /**
   * Validates email format using RFC 5322 simplified regex
   */
  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Returns the email value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compares two email value objects
   */
  equals(other: Email): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this.value;
  }
}
