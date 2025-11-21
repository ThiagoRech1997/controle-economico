/**
 * Categories Module - useUpdateCategory Hook
 * React Query mutation for updating categories
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import type { UpdateCategoryInput, Category } from '../types/category.types';

interface UseUpdateCategoryOptions {
  onSuccess?: (data: Category) => void;
  onError?: (error: Error) => void;
}

export function useUpdateCategory(options: UseUpdateCategoryOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategoryInput;
    }) => categoryService.update(categoryId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
