/**
 * Dashboard Module - Main Barrel Export
 */

// Types
export type {
  DashboardSummary,
  MonthlyData,
  CategoryBreakdown,
  RecentTransaction,
  GoalProgress,
  DashboardData,
} from './types/dashboard.types';

// Services
export { dashboardService } from './services/dashboard.service';

// Hooks
export { useDashboard } from './hooks/use-dashboard';

// Components
export { DashboardContainer } from './components/dashboard-container';
export { SummaryCards } from './components/summary-cards';
export { MonthlyChart } from './components/monthly-chart';
export { CategoryPieChart } from './components/category-pie-chart';
export { RecentTransactionsWidget } from './components/recent-transactions-widget';
export { GoalsWidget } from './components/goals-widget';
