/**
 * Goals Module - Main Barrel Export
 */

// Types
export type {
  Goal,
  GoalForecast,
  CreateGoalInput,
  UpdateGoalInput,
  UpdateProgressInput,
  GoalFilters,
  GoalStatus,
} from './types/goal.types';

// Services
export { goalService } from './services/goal.service';

// Hooks
export { useGoals } from './hooks/use-goals';
export { useCreateGoal } from './hooks/use-create-goal';
export { useGoalForecast } from './hooks/use-goal-forecast';
export {
  useUpdateGoal,
  useUpdateProgress,
  useCompleteGoal,
  useCancelGoal,
  useDeleteGoal,
} from './hooks/use-goal-mutations';

// Components
export { GoalForm } from './components/goal-form';
export { GoalCard } from './components/goal-card';
export { GoalList } from './components/goal-list';
export { GoalProgressBar } from './components/goal-progress-bar';
