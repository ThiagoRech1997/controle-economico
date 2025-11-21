/**
 * Dashboard Container Component
 * Main dashboard view that aggregates all widgets
 */
'use client';

import { useDashboard } from '../hooks/use-dashboard';
import { SummaryCards } from './summary-cards';
import { MonthlyChart } from './monthly-chart';
import { CategoryPieChart } from './category-pie-chart';
import { RecentTransactionsWidget } from './recent-transactions-widget';
import { GoalsWidget } from './goals-widget';

export function DashboardContainer() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold mb-2">Error loading dashboard</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-muted-foreground text-center">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <SummaryCards summary={data.summary} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart data={data.monthlyData} />
        <CategoryPieChart data={data.expensesByCategory} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactionsWidget transactions={data.recentTransactions} />
        <GoalsWidget goals={data.activeGoals} />
      </div>
    </div>
  );
}
