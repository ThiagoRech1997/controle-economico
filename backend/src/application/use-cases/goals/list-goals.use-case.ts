import { Inject, Injectable } from '@nestjs/common';

import { Goal, GoalStatus } from '@/domain/entities/goal.entity';
import {
  GoalRepository,
  GOAL_REPOSITORY,
} from '@/domain/repositories/goal.repository.interface';
import { GoalResponseDto } from '@/application/dtos/goals/goal-response.dto';

/**
 * List Goals Use Case
 *
 * Lists all goals for a user with optional filtering
 */
@Injectable()
export class ListGoalsUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: GoalRepository,
  ) {}

  async execute(
    userId: string,
    options?: {
      status?: GoalStatus;
    },
  ): Promise<GoalResponseDto[]> {
    const goals = await this.goalRepository.findByUserId(userId, {
      status: options?.status,
    });

    return goals.map((goal) => this.mapToResponse(goal));
  }

  private mapToResponse(goal: Goal): GoalResponseDto {
    return {
      id: goal.getId(),
      userId: goal.getUserId(),
      name: goal.getName(),
      description: goal.getDescription(),
      targetValue: goal.getTargetValue(),
      currentValue: goal.getCurrentValue(),
      targetDate: goal.getTargetDate(),
      status: goal.getStatus(),
      progressPercentage: goal.getProgressPercentage(),
      remainingAmount: goal.getRemainingAmount(),
      createdAt: goal.getCreatedAt(),
      updatedAt: goal.getUpdatedAt(),
    };
  }
}
