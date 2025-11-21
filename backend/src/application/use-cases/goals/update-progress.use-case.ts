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
import { UpdateProgressDto } from '@/application/dtos/goals/update-progress.dto';
import { GoalResponseDto } from '@/application/dtos/goals/goal-response.dto';

/**
 * Update Progress Use Case
 *
 * Updates the current progress of a goal
 */
@Injectable()
export class UpdateProgressUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: GoalRepository,
  ) {}

  async execute(
    goalId: string,
    userId: string,
    dto: UpdateProgressDto,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalRepository.findById(goalId);

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.getUserId() !== userId) {
      throw new ForbiddenException('You do not have access to this goal');
    }

    if (goal.getStatus() === GoalStatus.CANCELLED) {
      throw new ForbiddenException('Cannot update progress of a cancelled goal');
    }

    if (goal.getStatus() === GoalStatus.COMPLETED) {
      throw new ForbiddenException('Goal is already completed');
    }

    if (dto.addToExisting) {
      goal.addProgress(dto.currentValue);
    } else {
      goal.updateProgress(dto.currentValue);
    }

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
