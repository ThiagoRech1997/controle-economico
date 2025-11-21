/**
 * Goals Module - Service Layer
 * Handles all goal-related API communication
 */

import { apiClient } from '@/shared/lib/api-client';
import type {
  Goal,
  GoalForecast,
  CreateGoalInput,
  UpdateGoalInput,
  UpdateProgressInput,
  GoalFilters,
} from '../types/goal.types';

export const goalService = {
  /**
   * Create a new goal
   */
  async create(data: CreateGoalInput): Promise<Goal> {
    const response = await apiClient.post<Goal>('/goals', data);
    return response.data;
  },

  /**
   * List all goals for the authenticated user
   */
  async getAll(filters?: GoalFilters): Promise<Goal[]> {
    const params = new URLSearchParams();

    if (filters?.status) {
      params.append('status', filters.status);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/goals?${queryString}` : '/goals';

    const response = await apiClient.get<Goal[]>(endpoint);
    return response.data;
  },

  /**
   * Get a single goal by ID
   */
  async getById(goalId: string): Promise<Goal> {
    const response = await apiClient.get<Goal>(`/goals/${goalId}`);
    return response.data;
  },

  /**
   * Update a goal
   */
  async update(goalId: string, data: UpdateGoalInput): Promise<Goal> {
    const response = await apiClient.put<Goal>(`/goals/${goalId}`, data);
    return response.data;
  },

  /**
   * Update goal progress
   */
  async updateProgress(goalId: string, data: UpdateProgressInput): Promise<Goal> {
    const response = await apiClient.put<Goal>(
      `/goals/${goalId}/progress`,
      data
    );
    return response.data;
  },

  /**
   * Mark goal as complete
   */
  async complete(goalId: string): Promise<Goal> {
    const response = await apiClient.put<Goal>(`/goals/${goalId}/complete`, {});
    return response.data;
  },

  /**
   * Cancel a goal
   */
  async cancel(goalId: string): Promise<Goal> {
    const response = await apiClient.put<Goal>(`/goals/${goalId}/cancel`, {});
    return response.data;
  },

  /**
   * Delete a goal
   */
  async delete(goalId: string): Promise<void> {
    await apiClient.delete(`/goals/${goalId}`);
  },

  /**
   * Get goal forecast
   */
  async getForecast(goalId: string): Promise<GoalForecast> {
    const response = await apiClient.get<GoalForecast>(
      `/goals/${goalId}/forecast`
    );
    return response.data;
  },
};
