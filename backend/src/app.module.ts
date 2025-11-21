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
import { GoalModule } from './infrastructure/modules/goal.module';
import { DashboardModule } from './infrastructure/modules/dashboard.module';

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
    GoalModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
