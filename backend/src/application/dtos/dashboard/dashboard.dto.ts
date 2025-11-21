import { ApiProperty } from '@nestjs/swagger';

/**
 * Summary Card DTO
 */
export class SummaryDto {
  @ApiProperty({ description: 'Total income for the period', example: 5000.0 })
  totalIncome: number;

  @ApiProperty({ description: 'Total expenses for the period', example: 3500.0 })
  totalExpenses: number;

  @ApiProperty({ description: 'Balance (income - expenses)', example: 1500.0 })
  balance: number;

  @ApiProperty({ description: 'Total across all accounts', example: 15000.0 })
  totalAccountsBalance: number;

  @ApiProperty({ description: 'Number of active accounts', example: 3 })
  activeAccounts: number;

  @ApiProperty({ description: 'Number of active goals', example: 2 })
  activeGoals: number;

  @ApiProperty({ description: 'Number of pending transactions', example: 5 })
  pendingTransactions: number;
}

/**
 * Monthly Data DTO for charts
 */
export class MonthlyDataDto {
  @ApiProperty({ description: 'Month (1-12)', example: 1 })
  month: number;

  @ApiProperty({ description: 'Year', example: 2025 })
  year: number;

  @ApiProperty({ description: 'Month name', example: 'January' })
  monthName: string;

  @ApiProperty({ description: 'Total income', example: 5000.0 })
  income: number;

  @ApiProperty({ description: 'Total expenses', example: 3500.0 })
  expenses: number;

  @ApiProperty({ description: 'Balance', example: 1500.0 })
  balance: number;
}

/**
 * Category Breakdown DTO
 */
export class CategoryBreakdownDto {
  @ApiProperty({ description: 'Category ID' })
  categoryId: string;

  @ApiProperty({ description: 'Category name', example: 'Groceries' })
  categoryName: string;

  @ApiProperty({ description: 'Category icon', example: '🛒' })
  icon: string | null;

  @ApiProperty({ description: 'Category color', example: '#4CAF50' })
  color: string | null;

  @ApiProperty({ description: 'Total amount', example: 800.0 })
  total: number;

  @ApiProperty({ description: 'Percentage of total', example: 22.5 })
  percentage: number;

  @ApiProperty({ description: 'Number of transactions', example: 15 })
  transactionCount: number;
}

/**
 * Recent Transaction DTO
 */
export class RecentTransactionDto {
  @ApiProperty({ description: 'Transaction ID' })
  id: string;

  @ApiProperty({ description: 'Transaction type', example: 'EXPENSE' })
  type: string;

  @ApiProperty({ description: 'Amount', example: 150.0 })
  amount: number;

  @ApiProperty({ description: 'Currency', example: 'BRL' })
  currency: string;

  @ApiProperty({ description: 'Description', example: 'Grocery shopping' })
  description: string | null;

  @ApiProperty({ description: 'Transaction date' })
  date: Date;

  @ApiProperty({ description: 'Is paid', example: true })
  isPaid: boolean;

  @ApiProperty({ description: 'Category name', example: 'Groceries' })
  categoryName: string;

  @ApiProperty({ description: 'Category icon', example: '🛒' })
  categoryIcon: string | null;

  @ApiProperty({ description: 'Account name', example: 'Main Checking' })
  accountName: string;
}

/**
 * Goal Progress DTO
 */
export class GoalProgressDto {
  @ApiProperty({ description: 'Goal ID' })
  id: string;

  @ApiProperty({ description: 'Goal name', example: 'Emergency Fund' })
  name: string;

  @ApiProperty({ description: 'Target value', example: 10000.0 })
  targetValue: number;

  @ApiProperty({ description: 'Current value', example: 2500.0 })
  currentValue: number;

  @ApiProperty({ description: 'Progress percentage', example: 25.0 })
  progressPercentage: number;

  @ApiProperty({ description: 'Target date', nullable: true })
  targetDate: Date | null;
}

/**
 * Complete Dashboard Response DTO
 */
export class DashboardResponseDto {
  @ApiProperty({ type: SummaryDto })
  summary: SummaryDto;

  @ApiProperty({ type: [MonthlyDataDto] })
  monthlyData: MonthlyDataDto[];

  @ApiProperty({ type: [CategoryBreakdownDto] })
  expensesByCategory: CategoryBreakdownDto[];

  @ApiProperty({ type: [RecentTransactionDto] })
  recentTransactions: RecentTransactionDto[];

  @ApiProperty({ type: [GoalProgressDto] })
  activeGoals: GoalProgressDto[];
}
