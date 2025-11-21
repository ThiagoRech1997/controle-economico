/**
 * Categories Module - useDeleteCategory Hook
 * React Query mutation for deleting categories
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';

interface UseDeleteCategoryOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteCategory(options: UseDeleteCategoryOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => categoryService.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
