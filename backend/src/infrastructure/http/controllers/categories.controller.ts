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

import { CategoryType } from '@/domain/entities/category.entity';
import { CreateCategoryDto } from '@/application/dtos/categories/create-category.dto';
import { UpdateCategoryDto } from '@/application/dtos/categories/update-category.dto';
import { CategoryResponseDto } from '@/application/dtos/categories/category-response.dto';
import { CreateCategoryUseCase } from '@/application/use-cases/categories/create-category.use-case';
import { UpdateCategoryUseCase } from '@/application/use-cases/categories/update-category.use-case';
import { DeleteCategoryUseCase } from '@/application/use-cases/categories/delete-category.use-case';
import { ListCategoriesUseCase } from '@/application/use-cases/categories/list-categories.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Categories Controller
 *
 * Handles all category-related HTTP endpoints:
 * - Create category
 * - List categories
 * - Update category
 * - Delete category
 */
@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new category',
    description: 'Creates a new transaction category for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Category name already exists for this type',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(
    @Request() req: any,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.createCategoryUseCase.execute(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all categories',
    description: 'Lists all categories for the authenticated user',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: CategoryType,
    description: 'Filter by category type (INCOME or EXPENSE)',
  })
  @ApiQuery({
    name: 'isEssential',
    required: false,
    type: Boolean,
    description: 'Filter by essential status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    type: [CategoryResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async list(
    @Request() req: any,
    @Query('type') type?: CategoryType,
    @Query('isEssential') isEssential?: string,
  ): Promise<CategoryResponseDto[]> {
    return this.listCategoriesUseCase.execute(req.user.id, {
      type,
      isEssential: isEssential !== undefined ? isEssential === 'true' : undefined,
    });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update category',
    description: 'Updates an existing category',
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not category owner',
  })
  @ApiResponse({
    status: 409,
    description: 'Category name already exists for this type',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.updateCategoryUseCase.execute(id, req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete category',
    description: 'Deletes a category (only if it has no transactions)',
  })
  @ApiResponse({
    status: 204,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not category owner',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete category with transactions',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async delete(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.deleteCategoryUseCase.execute(id, req.user.id);
  }
}
