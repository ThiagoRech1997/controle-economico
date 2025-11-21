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
 * Complete Goal Use Case
 *
 * Marks a goal as completed manually
 */
@Injectable()
export class CompleteGoalUseCase {
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

    goal.complete();

    const updatedGoal = await this.goalRepository.update(goal);

    return this.mapToResponse(updatedGoal);
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
