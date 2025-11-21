import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Category, CategoryType } from '@/domain/entities/category.entity';

/**
 * Prisma Category Repository Implementation
 *
 * Implements the CategoryRepository interface using Prisma ORM.
 * Maps between Prisma models and domain entities.
 */
@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(category: Category): Promise<Category> {
    const data = category.toObject();

    const prismaCategory = await this.prisma.category.create({
      data: {
        id: data.id,
        userId: data.userId,
        name: data.name,
        icon: data.icon,
        color: data.color,
        isEssential: data.isEssential,
        type: data.type,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return this.toDomain(prismaCategory);
  }

  async findById(id: string): Promise<Category | null> {
    const prismaCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!prismaCategory) {
      return null;
    }

    return this.toDomain(prismaCategory);
  }

  async findByUserId(
    userId: string,
    options?: {
      type?: CategoryType;
      isEssential?: boolean;
      skip?: number;
      take?: number;
    },
  ): Promise<Category[]> {
    const where: Prisma.CategoryWhereInput = {
      userId,
    };

    if (options?.type) {
      where.type = options.type;
    }

    if (options?.isEssential !== undefined) {
      where.isEssential = options.isEssential;
    }

    const prismaCategories = await this.prisma.category.findMany({
      where,
      skip: options?.skip,
      take: options?.take,
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });

    return prismaCategories.map((category) => this.toDomain(category));
  }

  async update(category: Category): Promise<Category> {
    const data = category.toObject();

    const prismaCategory = await this.prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        icon: data.icon,
        color: data.color,
        isEssential: data.isEssential,
        updatedAt: data.updatedAt,
      },
    });

    return this.toDomain(prismaCategory);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }

  async hasTransactions(categoryId: string): Promise<boolean> {
    const count = await this.prisma.transaction.count({
      where: { categoryId },
    });

    return count > 0;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.category.count({
      where: { userId },
    });
  }

  async existsByNameUserIdAndType(
    name: string,
    userId: string,
    type: CategoryType,
  ): Promise<boolean> {
    // SQL Server uses case-insensitive collation by default
    const count = await this.prisma.category.count({
      where: {
        name,
        userId,
        type,
      },
    });

    return count > 0;
  }

  /**
   * Maps Prisma Category model to domain entity
   */
  private toDomain(prismaCategory: {
    id: string;
    userId: string;
    name: string;
    icon: string | null;
    color: string | null;
    isEssential: boolean;
    type: string;
    createdAt: Date;
    updatedAt: Date;
  }): Category {
    return Category.create({
      id: prismaCategory.id,
      userId: prismaCategory.userId,
      name: prismaCategory.name,
      icon: prismaCategory.icon,
      color: prismaCategory.color,
      isEssential: prismaCategory.isEssential,
      type: prismaCategory.type as CategoryType,
      createdAt: prismaCategory.createdAt,
      updatedAt: prismaCategory.updatedAt,
    });
  }
}
