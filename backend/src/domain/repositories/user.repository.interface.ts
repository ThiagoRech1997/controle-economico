import { User } from '../entities/user.entity';

/**
 * User Repository Interface (Port)
 *
 * Defines the contract for user persistence operations.
 * Implementation is done in the infrastructure layer.
 */
export interface UserRepository {
  /**
   * Creates a new user in the database
   */
  create(user: User): Promise<User>;

  /**
   * Finds a user by ID
   * Returns null if not found
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by email
   * Returns null if not found
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Updates an existing user
   */
  update(user: User): Promise<User>;

  /**
   * Deletes a user by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Lists all users (with optional pagination)
   */
  findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<User[]>;

  /**
   * Checks if a user exists by email
   */
  existsByEmail(email: string): Promise<boolean>;
}

/**
 * Token to inject the repository implementation
 */
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
