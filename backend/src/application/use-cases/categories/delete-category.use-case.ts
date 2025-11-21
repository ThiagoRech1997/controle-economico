import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

import {
  CategoryRepository,
  CATEGORY_REPOSITORY,
} from '@/domain/repositories/category.repository.interface';

/**
 * Delete Category Use Case
 *
 * Handles category deletion with:
 * - Ownership validation
 * - Transaction existence check
 */
@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(categoryId: string, userId: string): Promise<void> {
    // Find category
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Validate ownership
    if (category.getUserId() !== userId) {
      throw new ForbiddenException('You do not have access to this category');
    }

    // Check if category has transactions
    const hasTransactions =
      await this.categoryRepository.hasTransactions(categoryId);

    if (!category.canBeDeleted(hasTransactions)) {
      throw new ConflictException(
        'Cannot delete category with existing transactions. Please reassign transactions first.',
      );
    }

    // Delete category
    await this.categoryRepository.delete(categoryId);
  }
}
