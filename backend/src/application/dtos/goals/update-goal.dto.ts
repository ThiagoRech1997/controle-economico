import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';

/**
 * Update Goal DTO
 *
 * Data transfer object for updating an existing goal
 */
export class UpdateGoalDto {
  @ApiPropertyOptional({
    description: 'Goal name',
    example: 'Emergency Fund 2025',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Goal description',
    example: '6 months of expenses saved for emergencies',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Target value to achieve',
    example: 15000.0,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0.01)
  targetValue?: number;

  @ApiPropertyOptional({
    description: 'Target date to achieve the goal (ISO 8601 format)',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  targetDate?: string;
}
