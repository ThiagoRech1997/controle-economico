import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Account } from '@/domain/entities/account.entity';
import {
  AccountRepository,
  ACCOUNT_REPOSITORY,
} from '@/domain/repositories/account.repository.interface';
import { CreateAccountDto } from '@/application/dtos/accounts/create-account.dto';
import { AccountResponseDto } from '@/application/dtos/accounts/account-response.dto';

/**
 * Create Account Use Case
 *
 * Handles account creation with:
 * - Name uniqueness validation per user
 * - Default values assignment
 */
@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(userId: string, dto: CreateAccountDto): Promise<AccountResponseDto> {
    // Check if account name already exists for this user
    const exists = await this.accountRepository.existsByNameAndUserId(
      dto.name,
      userId,
    );

    if (exists) {
      throw new ConflictException('An account with this name already exists');
    }

    // Create account entity
    const account = Account.create({
      id: uuidv4(),
      userId,
      name: dto.name,
      type: dto.type,
      initialBalance: dto.initialBalance,
      currency: dto.currency || 'BRL',
      isActive: dto.isActive ?? true,
    });

    // Persist account
    const savedAccount = await this.accountRepository.create(account);

    return this.mapToResponse(savedAccount);
  }

  private mapToResponse(account: Account): AccountResponseDto {
    return {
      id: account.getId(),
      userId: account.getUserId(),
      name: account.getName(),
      type: account.getTypeValue(),
      initialBalance: account.getInitialBalance(),
      currency: account.getCurrencyValue(),
      isActive: account.getIsActive(),
      createdAt: account.getCreatedAt(),
      updatedAt: account.getUpdatedAt(),
    };
  }
}
