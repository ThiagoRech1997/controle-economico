import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { GoalStatus } from '@/domain/entities/goal.entity';
import { CreateGoalDto } from '@/application/dtos/goals/create-goal.dto';
import { UpdateGoalDto } from '@/application/dtos/goals/update-goal.dto';
import { UpdateProgressDto } from '@/application/dtos/goals/update-progress.dto';
import {
  GoalResponseDto,
  GoalForecastDto,
} from '@/application/dtos/goals/goal-response.dto';
import { CreateGoalUseCase } from '@/application/use-cases/goals/create-goal.use-case';
import { UpdateGoalUseCase } from '@/application/use-cases/goals/update-goal.use-case';
import { UpdateProgressUseCase } from '@/application/use-cases/goals/update-progress.use-case';
import { CompleteGoalUseCase } from '@/application/use-cases/goals/complete-goal.use-case';
import { CancelGoalUseCase } from '@/application/use-cases/goals/cancel-goal.use-case';
import { DeleteGoalUseCase } from '@/application/use-cases/goals/delete-goal.use-case';
import { ListGoalsUseCase } from '@/application/use-cases/goals/list-goals.use-case';
import { GetGoalUseCase } from '@/application/use-cases/goals/get-goal.use-case';
import { ForecastGoalUseCase } from '@/application/use-cases/goals/forecast-goal.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Goals Controller
 *
 * Handles all goal-related HTTP endpoints:
 * - Create goal
 * - List goals
 * - Get single goal
 * - Update goal
 * - Update progress
 * - Complete goal
 * - Cancel goal
 * - Delete goal
 * - Forecast achievement
 */
@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(
    private readonly createGoalUseCase: CreateGoalUseCase,
    private readonly updateGoalUseCase: UpdateGoalUseCase,
    private readonly updateProgressUseCase: UpdateProgressUseCase,
    private readonly completeGoalUseCase: CompleteGoalUseCase,
    private readonly cancelGoalUseCase: CancelGoalUseCase,
    private readonly deleteGoalUseCase: DeleteGoalUseCase,
    private readonly listGoalsUseCase: ListGoalsUseCase,
    private readonly getGoalUseCase: GetGoalUseCase,
    private readonly forecastGoalUseCase: ForecastGoalUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new goal',
    description: 'Creates a new financial goal for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Goal created successfully',
    type: GoalResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(
    @Request() req: any,
    @Body() dto: CreateGoalDto,
  ): Promise<GoalResponseDto> {
    return this.createGoalUseCase.execute(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all goals',
    description: 'Lists all goals for the authenticated user',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: GoalStatus,
    description: 'Filter by goal status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of goals',
    type: [GoalResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async list(
    @Request() req: any,
    @Query('status') status?: GoalStatus,
  ): Promise<GoalResponseDto[]> {
    return this.listGoalsUseCase.execute(req.user.id, { status });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get goal by ID',
    description: 'Retrieves a single goal by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Goal details',
    type: GoalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goal not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not goal owner',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getById(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<GoalResponseDto> {
    return this.getGoalUseCase.execute(id, req.user.id);
  }

  @Get(':id/forecast')
  @ApiOperation({
    summary: 'Forecast goal achievement',
    description: 'Calculates when the goal will be achieved based on average monthly surplus',
  })
  @ApiResponse({
    status: 200,
    description: 'Goal forecast',
    type: GoalForecastDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goal not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not goal owner',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async forecast(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<GoalForecastDto> {
    return this.forecastGoalUseCase.execute(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update goal',
    description: 'Updates goal details (name, description, target value, target date)',
  })
  @ApiResponse({
    status: 200,
    description: 'Goal updated successfully',
    type: GoalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goal not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not goal owner or goal not in progress',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateGoalDto,
  ): Promise<GoalResponseDto> {
    return this.updateGoalUseCase.execute(id, req.user.id, dto);
  }

  @Patch(':id/progress')
  @ApiOperation({
    summary: 'Update goal progress',
    description: 'Updates the current value of the goal',
  })
  @ApiResponse({
    status: 200,
    description: 'Progress updated successfully',
    type: GoalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goal not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not goal owner or goal completed/cancelled',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateProgress(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProgressDto,
  ): Promise<GoalResponseDto> {
    return this.updateProgressUseCase.execute(id, req.user.id, dto);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete goal',
    description: 'Marks a goal as completed manually',
  })
  @ApiResponse({
    status: 200,
    description: 'Goal completed successfully',
    type: GoalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goal not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not goal owner or goal already cancelled',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async complete(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<GoalResponseDto> {
    return this.completeGoalUseCase.execute(id, req.user.id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel goal',
    description: 'Cancels an in-progress goal',
  })
  @ApiResponse({
    status: 200,
    description: 'Goal cancelled successfully',
    type: GoalResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goal not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not goal owner or goal already completed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async cancel(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<GoalResponseDto> {
    return this.cancelGoalUseCase.execute(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete goal',
    description: 'Permanently deletes a goal',
  })
  @ApiResponse({
    status: 204,
    description: 'Goal deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Goal not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not goal owner',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async delete(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.deleteGoalUseCase.execute(id, req.user.id);
  }
}
