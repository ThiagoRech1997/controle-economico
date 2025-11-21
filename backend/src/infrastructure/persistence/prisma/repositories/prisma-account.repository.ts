import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { AccountRepository } from '@/domain/repositories/account.repository.interface';
import { Account } from '@/domain/entities/account.entity';

/**
 * Prisma Account Repository Implementation
 *
 * Implements the AccountRepository interface using Prisma ORM.
 * Maps between Prisma models and domain entities.
 */
@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(account: Account): Promise<Account> {
    const data = account.toObject();

    const prismaAccount = await this.prisma.account.create({
      data: {
        id: data.id,
        userId: data.userId,
        name: data.name,
        type: data.type,
        initialBalance: new Prisma.Decimal(data.initialBalance),
        currency: data.currency,
        isActive: data.isActive,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return this.toDomain(prismaAccount);
  }

  async findById(id: string): Promise<Account | null> {
    const prismaAccount = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!prismaAccount) {
      return null;
    }

    return this.toDomain(prismaAccount);
  }

  async findByUserId(
    userId: string,
    options?: {
      isActive?: boolean;
      skip?: number;
      take?: number;
    },
  ): Promise<Account[]> {
    const where: Prisma.AccountWhereInput = {
      userId,
    };

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    const prismaAccounts = await this.prisma.account.findMany({
      where,
      skip: options?.skip,
      take: options?.take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return prismaAccounts.map((account) => this.toDomain(account));
  }

  async update(account: Account): Promise<Account> {
    const data = account.toObject();

    const prismaAccount = await this.prisma.account.update({
      where: { id: data.id },
      data: {
        name: data.name,
        type: data.type,
        initialBalance: new Prisma.Decimal(data.initialBalance),
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      },
    });

    return this.toDomain(prismaAccount);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.account.delete({
      where: { id },
    });
  }

  async hasTransactions(accountId: string): Promise<boolean> {
    const count = await this.prisma.transaction.count({
      where: { accountId },
    });

    return count > 0;
  }

  async getBalance(accountId: string): Promise<number> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { initialBalance: true },
    });

    if (!account) {
      return 0;
    }

    // Get sum of income transactions
    const incomeResult = await this.prisma.transaction.aggregate({
      where: {
        accountId,
        type: 'INCOME',
        isPaid: true,
      },
      _sum: {
        amount: true,
      },
    });

    // Get sum of expense transactions
    const expenseResult = await this.prisma.transaction.aggregate({
      where: {
        accountId,
        type: 'EXPENSE',
        isPaid: true,
      },
      _sum: {
        amount: true,
      },
    });

    const initialBalance = account.initialBalance.toNumber();
    const totalIncome = incomeResult._sum.amount?.toNumber() || 0;
    const totalExpense = expenseResult._sum.amount?.toNumber() || 0;

    return initialBalance + totalIncome - totalExpense;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.account.count({
      where: { userId },
    });
  }

  async existsByNameAndUserId(name: string, userId: string): Promise<boolean> {
    // SQL Server uses case-insensitive collation by default
    // So we just do a direct comparison
    const count = await this.prisma.account.count({
      where: {
        name,
        userId,
      },
    });

    return count > 0;
  }

  /**
   * Maps Prisma Account model to domain entity
   */
  private toDomain(prismaAccount: {
    id: string;
    userId: string;
    name: string;
    type: string;
    initialBalance: Prisma.Decimal;
    currency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Account {
    return Account.create({
      id: prismaAccount.id,
      userId: prismaAccount.userId,
      name: prismaAccount.name,
      type: prismaAccount.type,
      initialBalance: prismaAccount.initialBalance.toNumber(),
      currency: prismaAccount.currency,
      isActive: prismaAccount.isActive,
      createdAt: prismaAccount.createdAt,
      updatedAt: prismaAccount.updatedAt,
    });
  }
}
