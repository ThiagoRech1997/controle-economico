import { Module } from '@nestjs/common';

import { CATEGORY_REPOSITORY } from '@/domain/repositories/category.repository.interface';
import { PrismaCategoryRepository } from '@/infrastructure/persistence/prisma/repositories/prisma-category.repository';
import { PrismaModule } from '@/infrastructure/persistence/prisma/prisma.module';
import { AuthModule } from './auth.module';

import { CreateCategoryUseCase } from '@/application/use-cases/categories/create-category.use-case';
import { UpdateCategoryUseCase } from '@/application/use-cases/categories/update-category.use-case';
import { DeleteCategoryUseCase } from '@/application/use-cases/categories/delete-category.use-case';
import { ListCategoriesUseCase } from '@/application/use-cases/categories/list-categories.use-case';

import { CategoriesController } from '@/infrastructure/http/controllers/categories.controller';

/**
 * Category Module
 *
 * Configures category management with:
 * - Repository implementations
 * - Use cases
 * - Controllers
 * - Authentication guard (from AuthModule)
 */
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CategoriesController],
  providers: [
    // Repository
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },

    // Use Cases
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    ListCategoriesUseCase,
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoryModule {}
