/**
 * Transaction Module
 * NestJS Module - Dependency Injection Container
 * Infrastructure layer - Glues everything together
 */
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Controllers (HTTP Adapters)
import { TransactionsController } from '../http/controllers/transactions.controller';

// Use Cases (Application Layer)
import { CreateTransactionUseCase } from '../../application/use-cases/transactions/create-transaction.use-case';

// Repositories (Infrastructure Adapters)
import { PrismaTransactionRepository } from '../persistence/prisma/repositories/prisma-transaction.repository';

// Repository Interface (Domain Port)
import { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';

/**
 * Transaction Module
 *
 * This module demonstrates the Hexagonal Architecture wiring:
 * 1. Domain layer defines the port (ITransactionRepository interface)
 * 2. Application layer uses the port (CreateTransactionUseCase)
 * 3. Infrastructure layer provides the adapter (PrismaTransactionRepository)
 * 4. NestJS DI container injects the adapter into the use case
 */
@Module({
  controllers: [TransactionsController],
  providers: [
    // Prisma Client
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },

    // Repository Implementation (Adapter)
    {
      provide: ITransactionRepository,
      useFactory: (prisma: PrismaClient) => {
        return new PrismaTransactionRepository(prisma);
      },
      inject: [PrismaClient],
    },

    // Use Cases (Application Layer)
    {
      provide: CreateTransactionUseCase,
      useFactory: (repository: ITransactionRepository) => {
        return new CreateTransactionUseCase(repository);
      },
      inject: [ITransactionRepository],
    },

    // Add other use cases here:
    // UpdateTransactionUseCase,
    // DeleteTransactionUseCase,
    // ListTransactionsUseCase,
  ],
  exports: [
    // Export repository if needed by other modules
    ITransactionRepository,
  ],
})
export class TransactionModule {}
