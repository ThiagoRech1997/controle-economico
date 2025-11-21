import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { Goal } from '@/domain/entities/goal.entity';
import {
  GoalRepository,
  GOAL_REPOSITORY,
} from '@/domain/repositories/goal.repository.interface';
import { GoalResponseDto } from '@/application/dtos/goals/goal-response.dto';

/**
 * Get Goal Use Case
 *
 * Retrieves a single goal by ID
 */
@Injectable()
export class GetGoalUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: GoalRepository,
  ) {}

  async execute(goalId: string, userId: string): Promise<GoalResponseDto> {
    const goal = await this.goalRepository.findById(goalId);

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.getUserId() !== userId) {
      throw new ForbiddenException('You do not have access to this goal');
    }

    return this.mapToResponse(goal);
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
