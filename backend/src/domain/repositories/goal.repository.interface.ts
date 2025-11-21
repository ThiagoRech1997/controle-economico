import { Goal, GoalStatus } from '@/domain/entities/goal.entity';

/**
 * Goal Repository Interface
 *
 * Port for goal persistence operations.
 * Infrastructure layer must implement this interface.
 */
export interface GoalRepository {
  /**
   * Create a new goal
   */
  create(goal: Goal): Promise<Goal>;

  /**
   * Find a goal by ID
   */
  findById(id: string): Promise<Goal | null>;

  /**
   * Find all goals for a user with optional filters
   */
  findByUserId(
    userId: string,
    options?: {
      status?: GoalStatus;
      skip?: number;
      take?: number;
    },
  ): Promise<Goal[]>;

  /**
   * Update an existing goal
   */
  update(goal: Goal): Promise<Goal>;

  /**
   * Delete a goal by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Count goals for a user
   */
  countByUserId(userId: string, status?: GoalStatus): Promise<number>;
}

/**
 * Injection token for Goal Repository
 */
export const GOAL_REPOSITORY = Symbol('GOAL_REPOSITORY');
