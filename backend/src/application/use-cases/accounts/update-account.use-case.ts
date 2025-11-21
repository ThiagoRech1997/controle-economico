import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

import { Account } from '@/domain/entities/account.entity';
import {
  AccountRepository,
  ACCOUNT_REPOSITORY,
} from '@/domain/repositories/account.repository.interface';
import { UpdateAccountDto } from '@/application/dtos/accounts/update-account.dto';
import { AccountResponseDto } from '@/application/dtos/accounts/account-response.dto';

/**
 * Update Account Use Case
 *
 * Handles account updates with:
 * - Ownership validation
 * - Name uniqueness validation
 */
@Injectable()
export class UpdateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(
    accountId: string,
    userId: string,
    dto: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    // Find account
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Validate ownership
    if (account.getUserId() !== userId) {
      throw new ForbiddenException('You do not have access to this account');
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== account.getName()) {
      const exists = await this.accountRepository.existsByNameAndUserId(
        dto.name,
        userId,
      );

      if (exists) {
        throw new ConflictException('An account with this name already exists');
      }

      account.updateName(dto.name);
    }

    // Update other fields
    if (dto.type) {
      account.updateType(dto.type);
    }

    if (dto.initialBalance !== undefined) {
      account.updateInitialBalance(dto.initialBalance);
    }

    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        account.activate();
      } else {
        account.deactivate();
      }
    }

    // Persist changes
    const updatedAccount = await this.accountRepository.update(account);

    return this.mapToResponse(updatedAccount);
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
