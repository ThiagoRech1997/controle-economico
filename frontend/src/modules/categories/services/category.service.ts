/**
 * Categories Module - Service Layer
 * Handles all category-related API communication
 */

import { apiClient } from '@/shared/lib/api-client';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilters,
} from '../types/category.types';

export const categoryService = {
  /**
   * Create a new category
   */
  async create(data: CreateCategoryInput): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  /**
   * List all categories for the authenticated user
   */
  async getAll(filters?: CategoryFilters): Promise<Category[]> {
    const params = new URLSearchParams();

    if (filters?.type) {
      params.append('type', filters.type);
    }
    if (filters?.isEssential !== undefined) {
      params.append('isEssential', String(filters.isEssential));
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/categories?${queryString}` : '/categories';

    const response = await apiClient.get<Category[]>(endpoint);
    return response.data;
  },

  /**
   * Update a category
   */
  async update(categoryId: string, data: UpdateCategoryInput): Promise<Category> {
    const response = await apiClient.put<Category>(
      `/categories/${categoryId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a category
   */
  async delete(categoryId: string): Promise<void> {
    await apiClient.delete(`/categories/${categoryId}`);
  },
};
