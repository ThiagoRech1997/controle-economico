/**
 * Categories Module - Main Barrel Export
 */

// Types
export type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilters,
  CategoryType,
} from './types/category.types';

// Services
export { categoryService } from './services/category.service';

// Hooks
export { useCategories } from './hooks/use-categories';
export { useCreateCategory } from './hooks/use-create-category';
export { useUpdateCategory } from './hooks/use-update-category';
export { useDeleteCategory } from './hooks/use-delete-category';

// Components
export { CategoryForm } from './components/category-form';
export { CategoryBadge } from './components/category-badge';
export { CategoryList } from './components/category-list';
