import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';

/**
 * Create Goal DTO
 *
 * Data transfer object for creating a new financial goal
 */
export class CreateGoalDto {
  @ApiProperty({
    description: 'Goal name',
    example: 'Emergency Fund',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Goal description',
    example: '6 months of expenses saved for emergencies',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Target value to achieve',
    example: 10000.0,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  targetValue: number;

  @ApiPropertyOptional({
    description: 'Initial current value (defaults to 0)',
    example: 500.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  currentValue?: number;

  @ApiPropertyOptional({
    description: 'Target date to achieve the goal (ISO 8601 format)',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  targetDate?: string;
}
