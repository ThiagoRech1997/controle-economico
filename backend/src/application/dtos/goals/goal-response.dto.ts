import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GoalStatus } from '@/domain/entities/goal.entity';

/**
 * Goal Response DTO
 *
 * Data transfer object for goal responses
 */
export class GoalResponseDto {
  @ApiProperty({
    description: 'Unique goal identifier',
    example: 'uuid-here',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who owns the goal',
    example: 'user-uuid-here',
  })
  userId: string;

  @ApiProperty({
    description: 'Goal name',
    example: 'Emergency Fund',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Goal description',
    example: '6 months of expenses saved for emergencies',
  })
  description: string | null;

  @ApiProperty({
    description: 'Target value to achieve',
    example: 10000.0,
  })
  targetValue: number;

  @ApiProperty({
    description: 'Current progress value',
    example: 2500.0,
  })
  currentValue: number;

  @ApiPropertyOptional({
    description: 'Target date to achieve the goal',
    example: '2025-12-31T00:00:00.000Z',
  })
  targetDate: Date | null;

  @ApiProperty({
    description: 'Goal status',
    enum: GoalStatus,
    example: GoalStatus.IN_PROGRESS,
  })
  status: GoalStatus;

  @ApiProperty({
    description: 'Progress percentage (0-100)',
    example: 25.0,
  })
  progressPercentage: number;

  @ApiProperty({
    description: 'Remaining amount to reach goal',
    example: 7500.0,
  })
  remainingAmount: number;

  @ApiProperty({
    description: 'Goal creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Goal last update timestamp',
    example: '2024-01-20T15:45:00.000Z',
  })
  updatedAt: Date;
}

/**
 * Forecast Response DTO
 *
 * Data transfer object for goal achievement forecast
 */
export class GoalForecastDto {
  @ApiProperty({
    description: 'Goal ID',
    example: 'uuid-here',
  })
  goalId: string;

  @ApiProperty({
    description: 'Goal name',
    example: 'Emergency Fund',
  })
  goalName: string;

  @ApiProperty({
    description: 'Current progress percentage',
    example: 25.0,
  })
  progressPercentage: number;

  @ApiProperty({
    description: 'Remaining amount to reach goal',
    example: 7500.0,
  })
  remainingAmount: number;

  @ApiProperty({
    description: 'Average monthly surplus (income - expenses)',
    example: 1500.0,
  })
  averageMonthlySurplus: number;

  @ApiProperty({
    description: 'Estimated months to achieve goal',
    example: 5,
    nullable: true,
  })
  estimatedMonths: number | null;

  @ApiPropertyOptional({
    description: 'Estimated achievement date',
    example: '2025-06-15T00:00:00.000Z',
    nullable: true,
  })
  estimatedDate: Date | null;

  @ApiProperty({
    description: 'Whether the goal is achievable based on current surplus',
    example: true,
  })
  isAchievable: boolean;

  @ApiPropertyOptional({
    description: 'Message about the forecast',
    example: 'At current rate, goal will be achieved in 5 months',
  })
  message: string;
}
