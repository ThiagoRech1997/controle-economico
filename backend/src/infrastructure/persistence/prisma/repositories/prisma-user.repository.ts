import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserRepository } from '@/domain/repositories/user.repository.interface';
import { User } from '@/domain/entities/user.entity';

/**
 * Prisma User Repository Implementation
 *
 * Implements the UserRepository interface using Prisma ORM.
 * Maps between Prisma models and domain entities.
 */
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const data = user.toObject();

    const prismaUser = await this.prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.passwordHash, // Prisma model uses 'password', domain uses 'passwordHash'
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return this.toDomain(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!prismaUser) {
      return null;
    }

    return this.toDomain(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!prismaUser) {
      return null;
    }

    return this.toDomain(prismaUser);
  }

  async update(user: User): Promise<User> {
    const data = user.toObject();

    const prismaUser = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash, // Prisma model uses 'password', domain uses 'passwordHash'
        updatedAt: data.updatedAt,
      },
    });

    return this.toDomain(prismaUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findAll(options?: { skip?: number; take?: number }): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return prismaUsers.map((prismaUser) => this.toDomain(prismaUser));
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.toLowerCase() },
    });

    return count > 0;
  }

  /**
   * Maps Prisma User model to domain entity
   */
  private toDomain(prismaUser: {
    id: string;
    name: string;
    email: string;
    password: string; // Prisma model uses 'password'
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.create({
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      passwordHash: prismaUser.password, // Map to domain's 'passwordHash'
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}
