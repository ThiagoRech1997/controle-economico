import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';
import {
  DashboardResponseDto,
  SummaryDto,
  MonthlyDataDto,
  CategoryBreakdownDto,
  RecentTransactionDto,
  GoalProgressDto,
} from '@/application/dtos/dashboard/dashboard.dto';

/**
 * Get Dashboard Data Use Case
 *
 * Retrieves all data needed for the dashboard in a single query
 */
@Injectable()
export class GetDashboardDataUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<DashboardResponseDto> {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get start of current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    // Get start of 6 months ago for monthly comparison
    const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1);

    // Execute all queries in parallel
    const [
      currentMonthTransactions,
      accounts,
      goals,
      recentTransactions,
      monthlyTransactions,
      pendingCount,
    ] = await Promise.all([
      // Current month transactions for summary
      this.prisma.transaction.findMany({
        where: {
          account: { userId },
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        include: { category: true },
      }),

      // Active accounts with balance calculation
      this.prisma.account.findMany({
        where: { userId, isActive: true },
        include: {
          transactions: {
            select: { type: true, amount: true },
          },
        },
      }),

      // Active goals
      this.prisma.goal.findMany({
        where: { userId, status: 'IN_PROGRESS' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Recent transactions
      this.prisma.transaction.findMany({
        where: { account: { userId } },
        include: {
          category: true,
          account: { select: { name: true } },
        },
        orderBy: { date: 'desc' },
        take: 10,
      }),

      // Transactions for last 6 months
      this.prisma.transaction.findMany({
        where: {
          account: { userId },
          date: { gte: sixMonthsAgo },
        },
        select: {
          type: true,
          amount: true,
          date: true,
        },
      }),

      // Pending transactions count
      this.prisma.transaction.count({
        where: {
          account: { userId },
          isPaid: false,
        },
      }),
    ]);

    // Calculate summary
    const summary = this.calculateSummary(
      currentMonthTransactions,
      accounts,
      goals.length,
      pendingCount,
    );

    // Calculate monthly data
    const monthlyData = this.calculateMonthlyData(monthlyTransactions, currentYear, currentMonth);

    // Calculate expenses by category
    const expensesByCategory = this.calculateCategoryBreakdown(currentMonthTransactions);

    // Format recent transactions
    const formattedRecentTransactions = this.formatRecentTransactions(recentTransactions);

    // Format active goals
    const activeGoals = this.formatGoals(goals);

    return {
      summary,
      monthlyData,
      expensesByCategory,
      recentTransactions: formattedRecentTransactions,
      activeGoals,
    };
  }

  private calculateSummary(
    transactions: any[],
    accounts: any[],
    activeGoalsCount: number,
    pendingCount: number,
  ): SummaryDto {
    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalAccountsBalance = accounts.reduce((sum, acc) => {
      const transactionsSum = acc.transactions.reduce((tSum: number, t: any) => {
        return t.type === 'INCOME'
          ? tSum + Number(t.amount)
          : tSum - Number(t.amount);
      }, 0);
      return sum + Number(acc.initialBalance) + transactionsSum;
    }, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      totalAccountsBalance,
      activeAccounts: accounts.length,
      activeGoals: activeGoalsCount,
      pendingTransactions: pendingCount,
    };
  }

  private calculateMonthlyData(
    transactions: any[],
    currentYear: number,
    currentMonth: number,
  ): MonthlyDataDto[] {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const months: MonthlyDataDto[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
      });

      const income = monthTransactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = monthTransactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      months.push({
        month: month + 1,
        year,
        monthName: monthNames[month],
        income,
        expenses,
        balance: income - expenses,
      });
    }

    return months;
  }

  private calculateCategoryBreakdown(transactions: any[]): CategoryBreakdownDto[] {
    const expenses = transactions.filter((t) => t.type === 'EXPENSE');
    const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

    const categoryMap = new Map<string, {
      categoryId: string;
      categoryName: string;
      icon: string | null;
      color: string | null;
      total: number;
      count: number;
    }>();

    expenses.forEach((t) => {
      const existing = categoryMap.get(t.categoryId);
      if (existing) {
        existing.total += Number(t.amount);
        existing.count += 1;
      } else {
        categoryMap.set(t.categoryId, {
          categoryId: t.categoryId,
          categoryName: t.category?.name || 'Unknown',
          icon: t.category?.icon || null,
          color: t.category?.color || null,
          total: Number(t.amount),
          count: 1,
        });
      }
    });

    return Array.from(categoryMap.values())
      .map((cat) => ({
        categoryId: cat.categoryId,
        categoryName: cat.categoryName,
        icon: cat.icon,
        color: cat.color,
        total: cat.total,
        percentage: totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0,
        transactionCount: cat.count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }

  private formatRecentTransactions(transactions: any[]): RecentTransactionDto[] {
    return transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      currency: t.currency,
      description: t.description,
      date: t.date,
      isPaid: t.isPaid,
      categoryName: t.category?.name || 'Unknown',
      categoryIcon: t.category?.icon || null,
      accountName: t.account?.name || 'Unknown',
    }));
  }

  private formatGoals(goals: any[]): GoalProgressDto[] {
    return goals.map((g) => {
      const targetValue = Number(g.targetValue);
      const currentValue = Number(g.currentValue);
      const progressPercentage = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;

      return {
        id: g.id,
        name: g.name,
        targetValue,
        currentValue,
        progressPercentage: Math.min(100, progressPercentage),
        targetDate: g.targetDate,
      };
    });
  }
}
