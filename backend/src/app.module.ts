/**
 * App Module
 * Root module that imports all feature modules
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './infrastructure/modules/transaction.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Feature modules
    TransactionModule,

    // Add other modules here:
    // GoalModule,
    // AccountModule,
    // CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
