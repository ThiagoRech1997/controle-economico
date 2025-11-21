import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import {
  GoalRepository,
  GOAL_REPOSITORY,
} from '@/domain/repositories/goal.repository.interface';

/**
 * Delete Goal Use Case
 *
 * Permanently deletes a goal
 */
@Injectable()
export class DeleteGoalUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: GoalRepository,
  ) {}

  async execute(goalId: string, userId: string): Promise<void> {
    const goal = await this.goalRepository.findById(goalId);

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.getUserId() !== userId) {
      throw new ForbiddenException('You do not have access to this goal');
    }

    await this.goalRepository.delete(goalId);
  }
}
