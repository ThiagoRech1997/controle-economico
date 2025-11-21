/**
 * App Module
 * Root module that imports all feature modules
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './infrastructure/modules/transaction.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { AccountModule } from './infrastructure/modules/account.module';
import { CategoryModule } from './infrastructure/modules/category.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Feature modules
    AuthModule,
    AccountModule,
    CategoryModule,
    TransactionModule,

    // Add other modules here:
    // GoalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
