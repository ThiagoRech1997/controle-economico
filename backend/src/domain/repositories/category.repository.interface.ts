import { Category, CategoryType } from '../entities/category.entity';

/**
 * Category Repository Interface (Port)
 *
 * Defines the contract for category persistence operations.
 * Implementation is done in the infrastructure layer.
 */
export interface CategoryRepository {
  /**
   * Creates a new category in the database
   */
  create(category: Category): Promise<Category>;

  /**
   * Finds a category by ID
   * Returns null if not found
   */
  findById(id: string): Promise<Category | null>;

  /**
   * Finds all categories for a specific user
   */
  findByUserId(
    userId: string,
    options?: {
      type?: CategoryType;
      isEssential?: boolean;
      skip?: number;
      take?: number;
    },
  ): Promise<Category[]>;

  /**
   * Updates an existing category
   */
  update(category: Category): Promise<Category>;

  /**
   * Deletes a category by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Checks if a category has any transactions
   */
  hasTransactions(categoryId: string): Promise<boolean>;

  /**
   * Counts total categories for a user
   */
  countByUserId(userId: string): Promise<number>;

  /**
   * Checks if category name already exists for a user (within the same type)
   */
  existsByNameUserIdAndType(
    name: string,
    userId: string,
    type: CategoryType,
  ): Promise<boolean>;
}

/**
 * Token to inject the repository implementation
 */
export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');
