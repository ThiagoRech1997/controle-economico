import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { GoalRepository } from '@/domain/repositories/goal.repository.interface';
import { Goal, GoalStatus } from '@/domain/entities/goal.entity';

/**
 * Prisma Goal Repository Implementation
 *
 * Implements the GoalRepository interface using Prisma ORM.
 * Maps between Prisma models and domain entities.
 */
@Injectable()
export class PrismaGoalRepository implements GoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(goal: Goal): Promise<Goal> {
    const data = goal.toObject();

    const prismaGoal = await this.prisma.goal.create({
      data: {
        id: data.id,
        userId: data.userId,
        name: data.name,
        description: data.description,
        targetValue: new Prisma.Decimal(data.targetValue),
        currentValue: new Prisma.Decimal(data.currentValue),
        targetDate: data.targetDate,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return this.toDomain(prismaGoal);
  }

  async findById(id: string): Promise<Goal | null> {
    const prismaGoal = await this.prisma.goal.findUnique({
      where: { id },
    });

    if (!prismaGoal) {
      return null;
    }

    return this.toDomain(prismaGoal);
  }

  async findByUserId(
    userId: string,
    options?: {
      status?: GoalStatus;
      skip?: number;
      take?: number;
    },
  ): Promise<Goal[]> {
    const where: Prisma.GoalWhereInput = {
      userId,
    };

    if (options?.status) {
      where.status = options.status;
    }

    const prismaGoals = await this.prisma.goal.findMany({
      where,
      skip: options?.skip,
      take: options?.take,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });

    return prismaGoals.map((goal) => this.toDomain(goal));
  }

  async update(goal: Goal): Promise<Goal> {
    const data = goal.toObject();

    const prismaGoal = await this.prisma.goal.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        targetValue: new Prisma.Decimal(data.targetValue),
        currentValue: new Prisma.Decimal(data.currentValue),
        targetDate: data.targetDate,
        status: data.status,
        updatedAt: data.updatedAt,
      },
    });

    return this.toDomain(prismaGoal);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.goal.delete({
      where: { id },
    });
  }

  async countByUserId(userId: string, status?: GoalStatus): Promise<number> {
    const where: Prisma.GoalWhereInput = { userId };

    if (status) {
      where.status = status;
    }

    return this.prisma.goal.count({ where });
  }

  /**
   * Maps Prisma Goal model to domain entity
   */
  private toDomain(prismaGoal: {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    targetValue: Prisma.Decimal;
    currentValue: Prisma.Decimal;
    targetDate: Date | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): Goal {
    return Goal.create({
      id: prismaGoal.id,
      userId: prismaGoal.userId,
      name: prismaGoal.name,
      description: prismaGoal.description,
      targetValue: prismaGoal.targetValue.toNumber(),
      currentValue: prismaGoal.currentValue.toNumber(),
      targetDate: prismaGoal.targetDate,
      status: prismaGoal.status as GoalStatus,
      createdAt: prismaGoal.createdAt,
      updatedAt: prismaGoal.updatedAt,
    });
  }
}
