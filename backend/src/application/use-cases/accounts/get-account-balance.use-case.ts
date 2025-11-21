import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import {
  AccountRepository,
  ACCOUNT_REPOSITORY,
} from '@/domain/repositories/account.repository.interface';
import { AccountBalanceResponseDto } from '@/application/dtos/accounts/account-response.dto';

/**
 * Get Account Balance Use Case
 *
 * Calculates and returns the current balance of an account
 * Balance = initialBalance + sum(income) - sum(expenses)
 */
@Injectable()
export class GetAccountBalanceUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(
    accountId: string,
    userId: string,
  ): Promise<AccountBalanceResponseDto> {
    // Find account
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Validate ownership
    if (account.getUserId() !== userId) {
      throw new ForbiddenException('You do not have access to this account');
    }

    // Calculate current balance
    const currentBalance = await this.accountRepository.getBalance(accountId);

    return {
      accountId: account.getId(),
      initialBalance: account.getInitialBalance(),
      currentBalance,
      currency: account.getCurrencyValue(),
    };
  }
}
