/**
 * Forecast Goal Achievement Use Case
 * Pure TypeScript - No framework dependencies
 * Calculates when a financial goal will be achieved based on average monthly surplus
 */
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository.interface';
import { ForecastResultDto } from '../../dtos/goals/forecast-result.dto';

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetValue: number;
  currentValue: number;
}

/**
 * Use Case: Forecast when a goal will be achieved
 *
 * Business Logic:
 * 1. Calculate average monthly surplus (Income - Expenses) from transaction history
 * 2. Calculate remaining amount needed
 * 3. Estimate months to achieve goal
 * 4. Return estimated achievement date
 */
export class ForecastGoalAchievementUseCase {
  private readonly DEFAULT_MONTHS_TO_ANALYZE = 6;

  constructor(
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(goal: Goal): Promise<ForecastResultDto> {
    // 1. Calculate average monthly surplus
    const surplusData = await this.transactionRepository.calculateAverageMonthlySurplus(
      goal.userId,
      this.DEFAULT_MONTHS_TO_ANALYZE,
    );

    // 2. Calculate remaining value
    const remainingValue = goal.targetValue - goal.currentValue;

    // 3. Check if surplus is positive
    if (surplusData.averageMonthlySurplus <= 0) {
      return {
        goalId: goal.id,
        goalName: goal.name,
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
        remainingValue,
        averageMonthlySurplus: surplusData.averageMonthlySurplus,
        monthsToAchieve: -1,
        estimatedAchievementDate: new Date(),
        isAchievable: false,
        message: 'Goal is not achievable. Your monthly expenses exceed your income. Consider reducing expenses or increasing income.',
      };
    }

    // 4. Check if goal is already achieved
    if (remainingValue <= 0) {
      return {
        goalId: goal.id,
        goalName: goal.name,
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
        remainingValue: 0,
        averageMonthlySurplus: surplusData.averageMonthlySurplus,
        monthsToAchieve: 0,
        estimatedAchievementDate: new Date(),
        isAchievable: true,
        message: 'Congratulations! Your goal has already been achieved.',
      };
    }

    // 5. Calculate months to achieve
    const monthsToAchieve = Math.ceil(remainingValue / surplusData.averageMonthlySurplus);

    // 6. Calculate estimated achievement date
    const estimatedDate = new Date();
    estimatedDate.setMonth(estimatedDate.getMonth() + monthsToAchieve);

    // 7. Return forecast result
    return {
      goalId: goal.id,
      goalName: goal.name,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      remainingValue,
      averageMonthlySurplus: surplusData.averageMonthlySurplus,
      monthsToAchieve,
      estimatedAchievementDate: estimatedDate,
      isAchievable: true,
      message: `Based on your average monthly surplus of ${surplusData.averageMonthlySurplus.toFixed(2)}, you will achieve your goal in approximately ${monthsToAchieve} month(s).`,
    };
  }
}
