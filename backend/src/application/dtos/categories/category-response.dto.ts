import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for category response
 */
export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID (owner)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Groceries',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Icon identifier',
    example: '🛒',
    nullable: true,
  })
  icon: string | null;

  @ApiPropertyOptional({
    description: 'Color in hex format',
    example: '#4CAF50',
    nullable: true,
  })
  color: string | null;

  @ApiProperty({
    description: 'Whether this is an essential (fixed cost) category',
    example: false,
  })
  isEssential: boolean;

  @ApiProperty({
    description: 'Category type (INCOME or EXPENSE)',
    example: 'EXPENSE',
  })
  type: string;

  @ApiProperty({
    description: 'Category creation timestamp',
    example: '2025-01-20T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Category last update timestamp',
    example: '2025-01-20T10:00:00.000Z',
  })
  updatedAt: Date;
}
