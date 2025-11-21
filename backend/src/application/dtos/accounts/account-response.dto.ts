import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for account response
 */
export class AccountResponseDto {
  @ApiProperty({
    description: 'Account ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID (owner)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string;

  @ApiProperty({
    description: 'Account name',
    example: 'Main Checking Account',
  })
  name: string;

  @ApiProperty({
    description: 'Account type',
    example: 'CHECKING',
  })
  type: string;

  @ApiProperty({
    description: 'Initial balance',
    example: 1000.0,
  })
  initialBalance: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'BRL',
  })
  currency: string;

  @ApiProperty({
    description: 'Whether the account is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2025-01-20T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Account last update timestamp',
    example: '2025-01-20T10:00:00.000Z',
  })
  updatedAt: Date;
}

/**
 * DTO for account with balance response
 */
export class AccountWithBalanceResponseDto extends AccountResponseDto {
  @ApiProperty({
    description: 'Current balance (initialBalance + transactions)',
    example: 1500.0,
  })
  currentBalance: number;
}

/**
 * DTO for account balance response
 */
export class AccountBalanceResponseDto {
  @ApiProperty({
    description: 'Account ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  accountId: string;

  @ApiProperty({
    description: 'Initial balance',
    example: 1000.0,
  })
  initialBalance: number;

  @ApiProperty({
    description: 'Current balance (initialBalance + transactions)',
    example: 1500.0,
  })
  currentBalance: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'BRL',
  })
  currency: string;
}
