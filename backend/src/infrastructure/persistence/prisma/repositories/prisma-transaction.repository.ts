/**
 * Prisma Transaction Repository (Adapter)
 * Implements the ITransactionRepository port using Prisma ORM
 * Infrastructure layer - Framework specific
 */
import { PrismaClient } from '@prisma/client';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import {
  ITransactionRepository,
  TransactionFilters,
  PaginationParams,
  PaginatedResult,
  MonthlySurplus,
} from '../../../../domain/repositories/transaction.repository.interface';
import { TransactionMapper } from '../mappers/transaction.mapper';

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(transaction: Transaction): Promise<Transaction> {
    const data = TransactionMapper.toPrisma(transaction);

    const saved = await this.prisma.transaction.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return TransactionMapper.toDomain(saved);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const data = TransactionMapper.toPrisma(transaction);

    const updated = await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return TransactionMapper.toDomain(updated);
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return null;
    }

    return TransactionMapper.toDomain(transaction);
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { accountId },
      orderBy: { date: 'desc' },
    });

    return TransactionMapper.toDomainList(transactions);
  }

  async findWithFilters(
    filters: TransactionFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Transaction>> {
    const where: any = {};

    if (filters.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.isPaid !== undefined) {
      where.isPaid = filters.isPaid;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: TransactionMapper.toDomainList(transactions),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }

  async calculateAverageMonthlySurplus(
    userId: string,
    monthsToAnalyze: number,
  ): Promise<MonthlySurplus> {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsToAnalyze);

    // Get all user accounts
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    const accountIds = accounts.map((a) => a.id);

    if (accountIds.length === 0) {
      return {
        averageMonthlySurplus: 0,
        monthsAnalyzed: 0,
      };
    }

    // Get transactions for the period
    const transactions = await this.prisma.transaction.findMany({
      where: {
        accountId: { in: accountIds },
        date: {
          gte: startDate,
          lte: endDate,
        },
        isPaid: true,
      },
    });

    // Calculate total income and expenses
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const transaction of transactions) {
      const amount = Number(transaction.amount);
      if (transaction.type === 'INCOME') {
        totalIncome += amount;
      } else if (transaction.type === 'EXPENSE') {
        totalExpenses += amount;
      }
    }

    // Calculate average monthly surplus
    const totalSurplus = totalIncome - totalExpenses;
    const averageMonthlySurplus = totalSurplus / monthsToAnalyze;

    return {
      averageMonthlySurplus,
      monthsAnalyzed: monthsToAnalyze,
    };
  }

  async getTotalIncome(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        accountId,
        type: 'INCOME',
        isPaid: true,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getTotalExpenses(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        accountId,
        type: 'EXPENSE',
        isPaid: true,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getEssentialExpenses(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        accountId,
        type: 'EXPENSE',
        isPaid: true,
        date: {
          gte: startDate,
          lte: endDate,
        },
        category: {
          isEssential: true,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getNonEssentialExpenses(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        accountId,
        type: 'EXPENSE',
        isPaid: true,
        date: {
          gte: startDate,
          lte: endDate,
        },
        category: {
          isEssential: false,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }
}
