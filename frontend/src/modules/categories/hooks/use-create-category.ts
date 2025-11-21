/**
 * Categories Module - useCreateCategory Hook
 * React Query mutation for creating categories
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import type { CreateCategoryInput, Category } from '../types/category.types';

interface UseCreateCategoryOptions {
  onSuccess?: (data: Category) => void;
  onError?: (error: Error) => void;
}

export function useCreateCategory(options: UseCreateCategoryOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => categoryService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
