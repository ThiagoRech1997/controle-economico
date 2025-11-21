import { Inject, Injectable } from '@nestjs/common';

import { Account } from '@/domain/entities/account.entity';
import {
  AccountRepository,
  ACCOUNT_REPOSITORY,
} from '@/domain/repositories/account.repository.interface';
import { AccountWithBalanceResponseDto } from '@/application/dtos/accounts/account-response.dto';

/**
 * List Accounts Use Case
 *
 * Lists all accounts for a user with optional filters
 */
@Injectable()
export class ListAccountsUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(
    userId: string,
    options?: {
      isActive?: boolean;
      includeBalance?: boolean;
    },
  ): Promise<AccountWithBalanceResponseDto[]> {
    const accounts = await this.accountRepository.findByUserId(userId, {
      isActive: options?.isActive,
    });

    // If balance is requested, fetch it for each account
    if (options?.includeBalance) {
      return Promise.all(
        accounts.map(async (account) => {
          const currentBalance = await this.accountRepository.getBalance(
            account.getId(),
          );
          return this.mapToResponseWithBalance(account, currentBalance);
        }),
      );
    }

    return accounts.map((account) =>
      this.mapToResponseWithBalance(account, account.getInitialBalance()),
    );
  }

  private mapToResponseWithBalance(
    account: Account,
    currentBalance: number,
  ): AccountWithBalanceResponseDto {
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
      currentBalance,
    };
  }
}
