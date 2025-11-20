/**
 * Forecast Result DTO (Output Port)
 * Pure TypeScript - No framework dependencies
 * Represents the output for goal forecasting calculations
 */
export interface ForecastResultDto {
  goalId: string;
  goalName: string;
  targetValue: number;
  currentValue: number;
  remainingValue: number;
  averageMonthlySurplus: number;
  monthsToAchieve: number;
  estimatedAchievementDate: Date;
  isAchievable: boolean;
  message: string;
}
