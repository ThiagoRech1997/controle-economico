/**
 * Transaction Response DTO (Output Port)
 * Pure TypeScript - No framework dependencies
 * Represents the output format for transaction data
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Transaction unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  id: string;

  @ApiProperty({
    description: 'Account ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  accountId: string;

  @ApiProperty({
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Transaction type',
    enum: ['INCOME', 'EXPENSE'],
    example: 'EXPENSE',
  })
  type: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 150.50,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'BRL',
  })
  currency: string;

  @ApiPropertyOptional({
    description: 'Transaction description',
    example: 'Grocery shopping at supermarket',
  })
  description?: string;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-15T10:30:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Payment status',
    example: true,
  })
  isPaid: boolean;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Paid with credit card',
  })
  notes?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}
