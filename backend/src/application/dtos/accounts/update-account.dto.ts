import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccountTypeEnum } from '@/domain/value-objects/account-type.vo';

/**
 * DTO for updating an existing account
 */
export class UpdateAccountDto {
  @ApiPropertyOptional({
    description: 'Account name',
    example: 'Updated Account Name',
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({
    description: 'Account type',
    enum: AccountTypeEnum,
    example: AccountTypeEnum.SAVINGS,
  })
  @IsOptional()
  @IsEnum(AccountTypeEnum)
  type?: AccountTypeEnum;

  @ApiPropertyOptional({
    description: 'Initial balance (must be >= 0)',
    example: 2000.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialBalance?: number;

  @ApiPropertyOptional({
    description: 'Whether the account is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
