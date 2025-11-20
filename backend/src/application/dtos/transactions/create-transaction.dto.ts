/**
 * Create Transaction DTO (Input Port)
 * Pure TypeScript - No framework dependencies
 * Represents the contract for creating a transaction
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Account ID where the transaction belongs',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  accountId: string;

  @ApiProperty({
    description: 'Category ID of the transaction',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Transaction type',
    enum: ['INCOME', 'EXPENSE'],
    example: 'EXPENSE',
  })
  type: 'INCOME' | 'EXPENSE';

  @ApiProperty({
    description: 'Transaction amount',
    example: 150.50,
    type: Number,
  })
  amount: number;

  @ApiPropertyOptional({
    description: 'Currency code (ISO 4217)',
    example: 'BRL',
    default: 'BRL',
  })
  currency?: string;

  @ApiPropertyOptional({
    description: 'Brief description of the transaction',
    example: 'Grocery shopping at supermarket',
  })
  description?: string;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-15T10:30:00Z',
    type: String,
  })
  date: Date | string;

  @ApiPropertyOptional({
    description: 'Whether the transaction is paid or pending',
    example: true,
    default: true,
  })
  isPaid?: boolean;

  @ApiPropertyOptional({
    description: 'Additional notes about the transaction',
    example: 'Paid with credit card',
  })
  notes?: string;
}
