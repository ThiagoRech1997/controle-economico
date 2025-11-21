import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Goal } from '@/domain/entities/goal.entity';
import {
  GoalRepository,
  GOAL_REPOSITORY,
} from '@/domain/repositories/goal.repository.interface';
import { CreateGoalDto } from '@/application/dtos/goals/create-goal.dto';
import { GoalResponseDto } from '@/application/dtos/goals/goal-response.dto';

/**
 * Create Goal Use Case
 *
 * Creates a new financial goal for a user
 */
@Injectable()
export class CreateGoalUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: GoalRepository,
  ) {}

  async execute(userId: string, dto: CreateGoalDto): Promise<GoalResponseDto> {
    const goal = Goal.create({
      id: uuidv4(),
      userId,
      name: dto.name,
      description: dto.description,
      targetValue: dto.targetValue,
      currentValue: dto.currentValue ?? 0,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
    });

    const savedGoal = await this.goalRepository.create(goal);

    return this.mapToResponse(savedGoal);
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
