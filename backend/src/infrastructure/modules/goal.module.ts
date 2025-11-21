import { Module } from '@nestjs/common';

import { GOAL_REPOSITORY } from '@/domain/repositories/goal.repository.interface';
import { PrismaGoalRepository } from '@/infrastructure/persistence/prisma/repositories/prisma-goal.repository';
import { PrismaModule } from '@/infrastructure/persistence/prisma/prisma.module';
import { AuthModule } from './auth.module';
import { TransactionModule } from './transaction.module';

import { CreateGoalUseCase } from '@/application/use-cases/goals/create-goal.use-case';
import { UpdateGoalUseCase } from '@/application/use-cases/goals/update-goal.use-case';
import { UpdateProgressUseCase } from '@/application/use-cases/goals/update-progress.use-case';
import { CompleteGoalUseCase } from '@/application/use-cases/goals/complete-goal.use-case';
import { CancelGoalUseCase } from '@/application/use-cases/goals/cancel-goal.use-case';
import { DeleteGoalUseCase } from '@/application/use-cases/goals/delete-goal.use-case';
import { ListGoalsUseCase } from '@/application/use-cases/goals/list-goals.use-case';
import { GetGoalUseCase } from '@/application/use-cases/goals/get-goal.use-case';
import { ForecastGoalUseCase } from '@/application/use-cases/goals/forecast-goal.use-case';

import { GoalsController } from '@/infrastructure/http/controllers/goals.controller';

/**
 * Goal Module
 *
 * Configures goal management with:
 * - Repository implementations
 * - Use cases (including forecasting)
 * - Controllers
 * - Authentication guard (from AuthModule)
 * - Transaction repository (for forecasting calculations)
 */
@Module({
  imports: [PrismaModule, AuthModule, TransactionModule],
  controllers: [GoalsController],
  providers: [
    // Repository
    {
      provide: GOAL_REPOSITORY,
      useClass: PrismaGoalRepository,
    },

    // Use Cases
    CreateGoalUseCase,
    UpdateGoalUseCase,
    UpdateProgressUseCase,
    CompleteGoalUseCase,
    CancelGoalUseCase,
    DeleteGoalUseCase,
    ListGoalsUseCase,
    GetGoalUseCase,
    ForecastGoalUseCase,
  ],
  exports: [GOAL_REPOSITORY],
})
export class GoalModule {}
