import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountTypeEnum } from '@/domain/value-objects/account-type.vo';
import { CurrencyEnum } from '@/domain/value-objects/currency.vo';

/**
 * DTO for creating a new account
 */
export class CreateAccountDto {
  @ApiProperty({
    description: 'Account name',
    example: 'Main Checking Account',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Account type',
    enum: AccountTypeEnum,
    example: AccountTypeEnum.CHECKING,
  })
  @IsEnum(AccountTypeEnum)
  @IsNotEmpty()
  type: AccountTypeEnum;

  @ApiProperty({
    description: 'Initial balance (must be >= 0)',
    example: 1000.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  initialBalance: number;

  @ApiPropertyOptional({
    description: 'Currency code (ISO 4217)',
    enum: CurrencyEnum,
    default: CurrencyEnum.BRL,
    example: CurrencyEnum.BRL,
  })
  @IsOptional()
  @IsEnum(CurrencyEnum)
  currency?: CurrencyEnum;

  @ApiPropertyOptional({
    description: 'Whether the account is active',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
