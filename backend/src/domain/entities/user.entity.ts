import { Email } from '../value-objects/email.vo';

/**
 * User Entity
 *
 * Represents a user in the system with authentication capabilities.
 * Pure domain entity with no framework dependencies.
 */
export class User {
  private id: string;
  private name: string;
  private email: Email;
  private passwordHash: string;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(props: {
    id: string;
    name: string;
    email: Email;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new User entity
   */
  static create(props: {
    id: string;
    name: string;
    email: string | Email;
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    // Validate name
    if (!props.name || props.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    // Ensure email is a value object
    const email = typeof props.email === 'string'
      ? Email.create(props.email)
      : props.email;

    // Validate password hash
    if (!props.passwordHash || props.passwordHash.length < 10) {
      throw new Error('Invalid password hash');
    }

    const now = new Date();

    return new User({
      id: props.id,
      name: props.name.trim(),
      email,
      passwordHash: props.passwordHash,
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now,
    });
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getEmailValue(): string {
    return this.email.getValue();
  }

  getPasswordHash(): string {
    return this.passwordHash;
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
      throw new Error('Name must be at least 2 characters long');
    }
    this.name = newName.trim();
    this.updatedAt = new Date();
  }

  updateEmail(newEmail: string | Email): void {
    this.email = typeof newEmail === 'string'
      ? Email.create(newEmail)
      : newEmail;
    this.updatedAt = new Date();
  }

  updatePassword(newPasswordHash: string): void {
    if (!newPasswordHash || newPasswordHash.length < 10) {
      throw new Error('Invalid password hash');
    }
    this.passwordHash = newPasswordHash;
    this.updatedAt = new Date();
  }

  /**
   * Validates if a user can be deleted
   * Add business rules here (e.g., check for related data)
   */
  canBeDeleted(): boolean {
    // Business rule: users can always be deleted
    // In the future, might check for active subscriptions, etc.
    return true;
  }

  /**
   * Converts entity to plain object for persistence
   */
  toObject(): {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getValue(),
      passwordHash: this.passwordHash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
