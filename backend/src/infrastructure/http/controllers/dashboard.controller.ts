import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetDashboardDataUseCase } from '@/application/use-cases/dashboard/get-dashboard-data.use-case';
import { DashboardResponseDto } from '@/application/dtos/dashboard/dashboard.dto';

/**
 * Dashboard Controller
 *
 * Provides aggregated dashboard data for the authenticated user
 */
@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardDataUseCase: GetDashboardDataUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get dashboard data',
    description: 'Returns aggregated financial data for the dashboard including summary, charts, and recent activity',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: DashboardResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getDashboard(@Request() req: any): Promise<DashboardResponseDto> {
    return this.getDashboardDataUseCase.execute(req.user.id);
  }
}
