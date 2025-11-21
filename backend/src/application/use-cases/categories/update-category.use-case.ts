import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

import { Category } from '@/domain/entities/category.entity';
import {
  CategoryRepository,
  CATEGORY_REPOSITORY,
} from '@/domain/repositories/category.repository.interface';
import { UpdateCategoryDto } from '@/application/dtos/categories/update-category.dto';
import { CategoryResponseDto } from '@/application/dtos/categories/category-response.dto';

/**
 * Update Category Use Case
 *
 * Handles category updates with:
 * - Ownership validation
 * - Name uniqueness validation
 */
@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    categoryId: string,
    userId: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Find category
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Validate ownership
    if (category.getUserId() !== userId) {
      throw new ForbiddenException('You do not have access to this category');
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== category.getName()) {
      const exists = await this.categoryRepository.existsByNameUserIdAndType(
        dto.name,
        userId,
        category.getType(),
      );

      if (exists) {
        throw new ConflictException(
          `A ${category.getType().toLowerCase()} category with this name already exists`,
        );
      }

      category.updateName(dto.name);
    }

    // Update other fields
    if (dto.icon !== undefined) {
      category.updateIcon(dto.icon);
    }

    if (dto.color !== undefined) {
      category.updateColor(dto.color);
    }

    if (dto.isEssential !== undefined) {
      if (dto.isEssential) {
        category.markAsEssential();
      } else {
        category.markAsNonEssential();
      }
    }

    // Persist changes
    const updatedCategory = await this.categoryRepository.update(category);

    return this.mapToResponse(updatedCategory);
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
