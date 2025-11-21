import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Service
 *
 * Manages the Prisma Client lifecycle and database connections.
 * Implements NestJS lifecycle hooks for proper initialization and cleanup.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  /**
   * Initialize Prisma Client when module is initialized
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnect Prisma Client when module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
