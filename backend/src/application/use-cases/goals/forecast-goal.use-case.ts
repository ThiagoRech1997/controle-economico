import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { GoalStatus } from '@/domain/entities/goal.entity';
import {
  GoalRepository,
  GOAL_REPOSITORY,
} from '@/domain/repositories/goal.repository.interface';
import { ITransactionRepository } from '@/domain/repositories/transaction.repository.interface';
import { GoalForecastDto } from '@/application/dtos/goals/goal-response.dto';

/**
 * Forecast Goal Achievement Use Case
 *
 * Calculates when a goal will be achieved based on average monthly surplus
 *
 * Algorithm:
 * 1. Calculate average monthly surplus: AVG(monthly_income - monthly_expenses)
 * 2. Calculate remaining amount: goalTarget - currentValue
 * 3. Estimate months: remainingAmount / avgMonthlySurplus
 * 4. Return achievement date or "not achievable" if surplus <= 0
 */
@Injectable()
export class ForecastGoalUseCase {
  // Number of months to analyze for surplus calculation
  private readonly MONTHS_TO_ANALYZE = 6;

  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: GoalRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(goalId: string, userId: string): Promise<GoalForecastDto> {
    const goal = await this.goalRepository.findById(goalId);

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.getUserId() !== userId) {
      throw new ForbiddenException('You do not have access to this goal');
    }

    // If goal is already completed or cancelled, return current state
    if (goal.getStatus() !== GoalStatus.IN_PROGRESS) {
      return {
        goalId: goal.getId(),
        goalName: goal.getName(),
        progressPercentage: goal.getProgressPercentage(),
        remainingAmount: goal.getRemainingAmount(),
        averageMonthlySurplus: 0,
        estimatedMonths: null,
        estimatedDate: null,
        isAchievable: goal.getStatus() === GoalStatus.COMPLETED,
        message:
          goal.getStatus() === GoalStatus.COMPLETED
            ? 'Goal has been achieved!'
            : 'Goal has been cancelled',
      };
    }

    // Calculate average monthly surplus
    const surplusData = await this.transactionRepository.calculateAverageMonthlySurplus(
      userId,
      this.MONTHS_TO_ANALYZE,
    );

    const remainingAmount = goal.getRemainingAmount();

    // If already achieved
    if (remainingAmount <= 0) {
      return {
        goalId: goal.getId(),
        goalName: goal.getName(),
        progressPercentage: 100,
        remainingAmount: 0,
        averageMonthlySurplus: surplusData.averageMonthlySurplus,
        estimatedMonths: 0,
        estimatedDate: new Date(),
        isAchievable: true,
        message: 'Goal target has been reached!',
      };
    }

    // If no surplus or negative surplus
    if (surplusData.averageMonthlySurplus <= 0) {
      return {
        goalId: goal.getId(),
        goalName: goal.getName(),
        progressPercentage: goal.getProgressPercentage(),
        remainingAmount,
        averageMonthlySurplus: surplusData.averageMonthlySurplus,
        estimatedMonths: null,
        estimatedDate: null,
        isAchievable: false,
        message:
          surplusData.monthsAnalyzed === 0
            ? 'Not enough transaction data to forecast. Add more transactions.'
            : 'Current spending exceeds income. Goal cannot be achieved at current rate.',
      };
    }

    // Calculate estimated months and date
    const estimatedMonths = Math.ceil(remainingAmount / surplusData.averageMonthlySurplus);
    const estimatedDate = new Date();
    estimatedDate.setMonth(estimatedDate.getMonth() + estimatedMonths);

    // Check if target date is set and compare
    const targetDate = goal.getTargetDate();
    let message = `At current savings rate, goal will be achieved in approximately ${estimatedMonths} month${estimatedMonths > 1 ? 's' : ''}`;

    if (targetDate) {
      if (estimatedDate > targetDate) {
        const monthsBehind = this.getMonthsDifference(targetDate, estimatedDate);
        message += `. Warning: This is ${monthsBehind} month${monthsBehind > 1 ? 's' : ''} after your target date.`;
      } else {
        const monthsAhead = this.getMonthsDifference(estimatedDate, targetDate);
        if (monthsAhead > 0) {
          message += `. You're on track to achieve this ${monthsAhead} month${monthsAhead > 1 ? 's' : ''} ahead of schedule!`;
        } else {
          message += `. You're on track to meet your target date!`;
        }
      }
    }

    return {
      goalId: goal.getId(),
      goalName: goal.getName(),
      progressPercentage: goal.getProgressPercentage(),
      remainingAmount,
      averageMonthlySurplus: surplusData.averageMonthlySurplus,
      estimatedMonths,
      estimatedDate,
      isAchievable: true,
      message,
    };
  }

  private getMonthsDifference(date1: Date, date2: Date): number {
    const months =
      (date2.getFullYear() - date1.getFullYear()) * 12 +
      (date2.getMonth() - date1.getMonth());
    return Math.abs(months);
  }
}
