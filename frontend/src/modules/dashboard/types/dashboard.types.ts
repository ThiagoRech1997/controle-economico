/**
 * Dashboard Module - Type Definitions
 * Frontend types aligned with backend DTOs
 */

/**
 * Summary data for dashboard cards
 */
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  totalAccountsBalance: number;
  activeAccounts: number;
  activeGoals: number;
  pendingTransactions: number;
}

/**
 * Monthly data for charts
 */
export interface MonthlyData {
  month: number;
  year: number;
  monthName: string;
  income: number;
  expenses: number;
  balance: number;
}

/**
 * Category breakdown for pie chart
 */
export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  icon: string | null;
  color: string | null;
  total: number;
  percentage: number;
  transactionCount: number;
}

/**
 * Recent transaction for dashboard list
 */
export interface RecentTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  currency: string;
  description: string | null;
  date: Date | string;
  isPaid: boolean;
  categoryName: string;
  categoryIcon: string | null;
  accountName: string;
}

/**
 * Goal progress for dashboard
 */
export interface GoalProgress {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  progressPercentage: number;
  targetDate: Date | string | null;
}

/**
 * Complete dashboard response
 */
export interface DashboardData {
  summary: DashboardSummary;
  monthlyData: MonthlyData[];
  expensesByCategory: CategoryBreakdown[];
  recentTransactions: RecentTransaction[];
  activeGoals: GoalProgress[];
}
