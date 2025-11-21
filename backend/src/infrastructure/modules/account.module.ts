import { Module } from '@nestjs/common';

import { ACCOUNT_REPOSITORY } from '@/domain/repositories/account.repository.interface';
import { PrismaAccountRepository } from '@/infrastructure/persistence/prisma/repositories/prisma-account.repository';
import { PrismaModule } from '@/infrastructure/persistence/prisma/prisma.module';
import { AuthModule } from './auth.module';

import { CreateAccountUseCase } from '@/application/use-cases/accounts/create-account.use-case';
import { UpdateAccountUseCase } from '@/application/use-cases/accounts/update-account.use-case';
import { DeleteAccountUseCase } from '@/application/use-cases/accounts/delete-account.use-case';
import { ListAccountsUseCase } from '@/application/use-cases/accounts/list-accounts.use-case';
import { GetAccountBalanceUseCase } from '@/application/use-cases/accounts/get-account-balance.use-case';

import { AccountsController } from '@/infrastructure/http/controllers/accounts.controller';

/**
 * Account Module
 *
 * Configures account management with:
 * - Repository implementations
 * - Use cases
 * - Controllers
 * - Authentication guard (from AuthModule)
 */
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AccountsController],
  providers: [
    // Repository
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: PrismaAccountRepository,
    },

    // Use Cases
    CreateAccountUseCase,
    UpdateAccountUseCase,
    DeleteAccountUseCase,
    ListAccountsUseCase,
    GetAccountBalanceUseCase,
  ],
  exports: [ACCOUNT_REPOSITORY],
})
export class AccountModule {}
