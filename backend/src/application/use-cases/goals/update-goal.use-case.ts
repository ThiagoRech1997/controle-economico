import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { Goal, GoalStatus } from '@/domain/entities/goal.entity';
import {
  GoalRepository,
  GOAL_REPOSITORY,
} from '@/domain/repositories/goal.repository.interface';
import { UpdateGoalDto } from '@/application/dtos/goals/update-goal.dto';
import { GoalResponseDto } from '@/application/dtos/goals/goal-response.dto';

/**
 * Update Goal Use Case
 *
 * Updates an existing financial goal
 */
@Injectable()
export class UpdateGoalUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: GoalRepository,
  ) {}

  async execute(
    goalId: string,
    userId: string,
    dto: UpdateGoalDto,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalRepository.findById(goalId);

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.getUserId() !== userId) {
      throw new ForbiddenException('You do not have access to this goal');
    }

    if (goal.getStatus() !== GoalStatus.IN_PROGRESS) {
      throw new ForbiddenException('Cannot update a completed or cancelled goal');
    }

    goal.update({
      name: dto.name,
      description: dto.description,
      targetValue: dto.targetValue,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
    });

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
