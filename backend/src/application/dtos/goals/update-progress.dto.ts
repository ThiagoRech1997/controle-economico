import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

/**
 * Update Progress DTO
 *
 * Data transfer object for updating goal progress
 */
export class UpdateProgressDto {
  @ApiProperty({
    description: 'New current value (replaces existing value)',
    example: 2500.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentValue: number;

  @ApiPropertyOptional({
    description: 'Whether to add to current value instead of replacing',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  addToExisting?: boolean;
}
