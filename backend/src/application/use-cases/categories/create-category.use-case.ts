import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Category } from '@/domain/entities/category.entity';
import {
  CategoryRepository,
  CATEGORY_REPOSITORY,
} from '@/domain/repositories/category.repository.interface';
import { CreateCategoryDto } from '@/application/dtos/categories/create-category.dto';
import { CategoryResponseDto } from '@/application/dtos/categories/category-response.dto';

/**
 * Create Category Use Case
 *
 * Handles category creation with:
 * - Name uniqueness validation per user and type
 */
@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    userId: string,
    dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Check if category name already exists for this user and type
    const exists = await this.categoryRepository.existsByNameUserIdAndType(
      dto.name,
      userId,
      dto.type,
    );

    if (exists) {
      throw new ConflictException(
        `A ${dto.type.toLowerCase()} category with this name already exists`,
      );
    }

    // Create category entity
    const category = Category.create({
      id: uuidv4(),
      userId,
      name: dto.name,
      type: dto.type,
      icon: dto.icon,
      color: dto.color,
      isEssential: dto.isEssential ?? false,
    });

    // Persist category
    const savedCategory = await this.categoryRepository.create(category);

    return this.mapToResponse(savedCategory);
  }

  private mapToResponse(category: Category): CategoryResponseDto {
    return {
      id: category.getId(),
      userId: category.getUserId(),
      name: category.getName(),
      icon: category.getIcon(),
      color: category.getColor(),
      isEssential: category.getIsEssential(),
      type: category.getType(),
      createdAt: category.getCreatedAt(),
      updatedAt: category.getUpdatedAt(),
    };
  }
}
