import { Module } from '@nestjs/common';
import { DashboardController } from '../http/controllers/dashboard.controller';
import { GetDashboardDataUseCase } from '@/application/use-cases/dashboard/get-dashboard-data.use-case';

/**
 * Dashboard Module
 *
 * Provides dashboard functionality with aggregated data
 */
@Module({
  controllers: [DashboardController],
  providers: [GetDashboardDataUseCase],
  exports: [GetDashboardDataUseCase],
})
export class DashboardModule {}
