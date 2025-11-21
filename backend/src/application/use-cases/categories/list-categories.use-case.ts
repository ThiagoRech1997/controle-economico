import { Inject, Injectable } from '@nestjs/common';

import { Category, CategoryType } from '@/domain/entities/category.entity';
import {
  CategoryRepository,
  CATEGORY_REPOSITORY,
} from '@/domain/repositories/category.repository.interface';
import { CategoryResponseDto } from '@/application/dtos/categories/category-response.dto';

/**
 * List Categories Use Case
 *
 * Lists all categories for a user with optional filters
 */
@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    userId: string,
    options?: {
      type?: CategoryType;
      isEssential?: boolean;
    },
  ): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findByUserId(userId, {
      type: options?.type,
      isEssential: options?.isEssential,
    });

    return categories.map((category) => this.mapToResponse(category));
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
