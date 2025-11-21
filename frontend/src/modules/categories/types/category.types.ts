/**
 * Categories Module - Type Definitions
 * Frontend types aligned with backend DTOs
 */

export type CategoryType = 'INCOME' | 'EXPENSE';

/**
 * Category entity returned from API
 */
export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string | null;
  color: string | null;
  isEssential: boolean;
  type: CategoryType;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Input for creating a category
 */
export interface CreateCategoryInput {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  isEssential?: boolean;
}

/**
 * Input for updating a category
 */
export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
  color?: string;
  isEssential?: boolean;
}

/**
 * Filters for listing categories
 */
export interface CategoryFilters {
  type?: CategoryType;
  isEssential?: boolean;
}
