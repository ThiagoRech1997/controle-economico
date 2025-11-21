import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

import {
  AccountRepository,
  ACCOUNT_REPOSITORY,
} from '@/domain/repositories/account.repository.interface';

/**
 * Delete Account Use Case
 *
 * Handles account deletion with:
 * - Ownership validation
 * - Transaction existence check
 */
@Injectable()
export class DeleteAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(accountId: string, userId: string): Promise<void> {
    // Find account
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Validate ownership
    if (account.getUserId() !== userId) {
      throw new ForbiddenException('You do not have access to this account');
    }

    // Check if account has transactions
    const hasTransactions =
      await this.accountRepository.hasTransactions(accountId);

    if (!account.canBeDeleted(hasTransactions)) {
      throw new ConflictException(
        'Cannot delete account with existing transactions. Please delete or transfer transactions first.',
      );
    }

    // Delete account
    await this.accountRepository.delete(accountId);
  }
}
