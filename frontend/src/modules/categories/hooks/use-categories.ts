/**
 * Categories Module - useCategories Hook
 * React Query hook for fetching categories
 */

import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import type { CategoryFilters, Category } from '../types/category.types';

interface UseCategoriesOptions {
  filters?: CategoryFilters;
  enabled?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { filters, enabled = true } = options;

  return useQuery<Category[], Error>({
    queryKey: ['categories', filters],
    queryFn: () => categoryService.getAll(filters),
    enabled,
    staleTime: 60 * 1000, // 1 minute
  });
}
