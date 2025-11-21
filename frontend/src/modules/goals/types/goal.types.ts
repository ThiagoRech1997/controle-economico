/**
 * Goals Module - Type Definitions
 * Frontend types aligned with backend DTOs
 */

export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

/**
 * Goal entity returned from API
 */
export interface Goal {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  targetValue: number;
  currentValue: number;
  targetDate: Date | string | null;
  status: GoalStatus;
  progressPercentage: number;
  remainingAmount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Goal forecast response
 */
export interface GoalForecast {
  goalId: string;
  goalName: string;
  progressPercentage: number;
  remainingAmount: number;
  averageMonthlySurplus: number;
  estimatedMonths: number | null;
  estimatedDate: Date | string | null;
  isAchievable: boolean;
  message: string;
}

/**
 * Input for creating a goal
 */
export interface CreateGoalInput {
  name: string;
  description?: string;
  targetValue: number;
  currentValue?: number;
  targetDate?: string;
}

/**
 * Input for updating a goal
 */
export interface UpdateGoalInput {
  name?: string;
  description?: string;
  targetValue?: number;
  targetDate?: string;
}

/**
 * Input for updating goal progress
 */
export interface UpdateProgressInput {
  currentValue: number;
}

/**
 * Filters for listing goals
 */
export interface GoalFilters {
  status?: GoalStatus;
}
