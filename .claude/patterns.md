# Design Patterns Quick Reference

This file contains quick reference templates and patterns for the controle-economico project.

## Clean Architecture Pattern (Backend)

### 1. Domain Entity Template

```typescript
// backend/src/domain/entities/<entity-name>.entity.ts
export class EntityName {
  constructor(
    public readonly id: string,
    public readonly property1: string,
    public readonly property2: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Business logic methods go here
  public validateBusinessRule(): boolean {
    // Pure domain logic
    return true;
  }

  // Factory method
  static create(props: Omit<EntityName, 'id' | 'createdAt' | 'updatedAt'>): EntityName {
    return new EntityName(
      crypto.randomUUID(),
      props.property1,
      props.property2,
      new Date(),
      new Date(),
    );
  }
}
```

### 2. Repository Interface Template

```typescript
// backend/src/domain/repositories/<entity-name>.repository.interface.ts
import { EntityName } from '../entities/<entity-name>.entity';

export interface EntityNameRepository {
  findById(id: string): Promise<EntityName | null>;
  findAll(): Promise<EntityName[]>;
  create(entity: EntityName): Promise<EntityName>;
  update(entity: EntityName): Promise<EntityName>;
  delete(id: string): Promise<void>;
}

export const EntityNameRepository = Symbol('EntityNameRepository');
```

### 3. Application DTO Template

```typescript
// backend/src/application/dtos/<entity-name>/<action>-<entity-name>.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEntityNameDto {
  @ApiProperty({ description: 'Property description' })
  @IsString()
  property1: string;

  @ApiProperty({ description: 'Another property' })
  @IsNumber()
  property2: number;
}

export class EntityNameResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  property1: string;

  @ApiProperty()
  property2: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
```

### 4. Use Case Template

```typescript
// backend/src/application/use-cases/<feature>/<action>-<entity-name>.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { EntityNameRepository } from '@/domain/repositories/<entity-name>.repository.interface';
import { EntityName } from '@/domain/entities/<entity-name>.entity';
import { CreateEntityNameDto } from '@/application/dtos/<entity-name>/create-<entity-name>.dto';

@Injectable()
export class CreateEntityNameUseCase {
  constructor(
    @Inject(EntityNameRepository)
    private readonly repository: EntityNameRepository,
  ) {}

  async execute(dto: CreateEntityNameDto): Promise<EntityName> {
    // 1. Create domain entity
    const entity = EntityName.create({
      property1: dto.property1,
      property2: dto.property2,
    });

    // 2. Validate business rules
    if (!entity.validateBusinessRule()) {
      throw new Error('Business rule validation failed');
    }

    // 3. Persist via repository
    return await this.repository.create(entity);
  }
}
```

### 5. Prisma Repository Implementation Template

```typescript
// backend/src/infrastructure/persistence/prisma/repositories/prisma-<entity-name>.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EntityNameRepository } from '@/domain/repositories/<entity-name>.repository.interface';
import { EntityName } from '@/domain/entities/<entity-name>.entity';
import { PrismaEntityNameMapper } from '../mappers/prisma-<entity-name>.mapper';

@Injectable()
export class PrismaEntityNameRepository implements EntityNameRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<EntityName | null> {
    const data = await this.prisma.entityName.findUnique({
      where: { id },
    });
    return data ? PrismaEntityNameMapper.toDomain(data) : null;
  }

  async findAll(): Promise<EntityName[]> {
    const data = await this.prisma.entityName.findMany();
    return data.map(PrismaEntityNameMapper.toDomain);
  }

  async create(entity: EntityName): Promise<EntityName> {
    const data = await this.prisma.entityName.create({
      data: PrismaEntityNameMapper.toPrisma(entity),
    });
    return PrismaEntityNameMapper.toDomain(data);
  }

  async update(entity: EntityName): Promise<EntityName> {
    const data = await this.prisma.entityName.update({
      where: { id: entity.id },
      data: PrismaEntityNameMapper.toPrisma(entity),
    });
    return PrismaEntityNameMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.entityName.delete({
      where: { id },
    });
  }
}
```

### 6. Prisma Mapper Template

```typescript
// backend/src/infrastructure/persistence/prisma/mappers/prisma-<entity-name>.mapper.ts
import { EntityName as PrismaEntityName } from '@prisma/client';
import { EntityName } from '@/domain/entities/<entity-name>.entity';

export class PrismaEntityNameMapper {
  static toDomain(prisma: PrismaEntityName): EntityName {
    return new EntityName(
      prisma.id,
      prisma.property1,
      prisma.property2,
      prisma.createdAt,
      prisma.updatedAt,
    );
  }

  static toPrisma(domain: EntityName): Omit<PrismaEntityName, 'createdAt' | 'updatedAt'> {
    return {
      id: domain.id,
      property1: domain.property1,
      property2: domain.property2,
    };
  }
}
```

### 7. NestJS Controller Template

```typescript
// backend/src/infrastructure/http/controllers/<entity-name>.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEntityNameUseCase } from '@/application/use-cases/<feature>/create-<entity-name>.use-case';
import { CreateEntityNameDto, EntityNameResponseDto } from '@/application/dtos/<entity-name>';

@ApiTags('entity-names')
@Controller('entity-names')
export class EntityNameController {
  constructor(
    private readonly createUseCase: CreateEntityNameUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 201, type: EntityNameResponseDto })
  async create(@Body() dto: CreateEntityNameDto): Promise<EntityNameResponseDto> {
    const entity = await this.createUseCase.execute(dto);
    return {
      id: entity.id,
      property1: entity.property1,
      property2: entity.property2,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
```

### 8. NestJS Module Template

```typescript
// backend/src/infrastructure/modules/<entity-name>.module.ts
import { Module } from '@nestjs/common';
import { EntityNameController } from '@/infrastructure/http/controllers/<entity-name>.controller';
import { CreateEntityNameUseCase } from '@/application/use-cases/<feature>/create-<entity-name>.use-case';
import { PrismaEntityNameRepository } from '@/infrastructure/persistence/prisma/repositories/prisma-<entity-name>.repository';
import { EntityNameRepository } from '@/domain/repositories/<entity-name>.repository.interface';
import { PrismaModule } from '@/infrastructure/persistence/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EntityNameController],
  providers: [
    CreateEntityNameUseCase,
    {
      provide: EntityNameRepository,
      useClass: PrismaEntityNameRepository,
    },
  ],
  exports: [CreateEntityNameUseCase],
})
export class EntityNameModule {}
```

---

## Feature-Sliced Design (Frontend)

### 1. TypeScript Types Template

```typescript
// frontend/src/modules/<feature>/types/<feature>.types.ts
export interface Feature {
  id: string;
  property1: string;
  property2: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureDto {
  property1: string;
  property2: number;
}

export interface UpdateFeatureDto {
  property1?: string;
  property2?: number;
}

export interface FeatureListResponse {
  data: Feature[];
  total: number;
}
```

### 2. API Service Template

```typescript
// frontend/src/modules/<feature>/services/<feature>.service.ts
import { Feature, CreateFeatureDto, UpdateFeatureDto } from '../types/<feature>.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const featureService = {
  async getAll(): Promise<Feature[]> {
    const response = await fetch(`${API_URL}/features`);
    if (!response.ok) {
      throw new Error('Failed to fetch features');
    }
    return response.json();
  },

  async getById(id: string): Promise<Feature> {
    const response = await fetch(`${API_URL}/features/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch feature');
    }
    return response.json();
  },

  async create(data: CreateFeatureDto): Promise<Feature> {
    const response = await fetch(`${API_URL}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create feature');
    }
    return response.json();
  },

  async update(id: string, data: UpdateFeatureDto): Promise<Feature> {
    const response = await fetch(`${API_URL}/features/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update feature');
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/features/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete feature');
    }
  },
};
```

### 3. React Query Hooks Template

```typescript
// frontend/src/modules/<feature>/hooks/use-<feature>.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { featureService } from '../services/<feature>.service';
import { CreateFeatureDto, UpdateFeatureDto } from '../types/<feature>.types';

const QUERY_KEY = 'features';

export function useFeatures() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => featureService.getAll(),
  });
}

export function useFeature(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => featureService.getById(id),
    enabled: !!id,
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeatureDto) => featureService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeatureDto }) =>
      featureService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
```

### 4. Component Template

```typescript
// frontend/src/modules/<feature>/components/FeatureList.tsx
'use client';

import { useFeatures, useDeleteFeature } from '../hooks/use-<feature>';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function FeatureList() {
  const { data: features, isLoading, error } = useFeatures();
  const deleteMutation = useDeleteFeature();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Features</h2>
      {features?.map((feature) => (
        <Card key={feature.id}>
          <CardHeader>
            <CardTitle>{feature.property1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Property 2: {feature.property2}</p>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(feature.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### 5. Module Index (Barrel Export)

```typescript
// frontend/src/modules/<feature>/index.ts
export * from './components/FeatureList';
export * from './hooks/use-<feature>';
export * from './services/<feature>.service';
export * from './types/<feature>.types';
```

---

## Naming Conventions

### Backend (NestJS)
- **Entities**: `EntityName.entity.ts` (PascalCase class)
- **Value Objects**: `ValueObject.vo.ts`
- **Repository Interfaces**: `entity-name.repository.interface.ts` (interface with Symbol)
- **Repository Implementations**: `prisma-entity-name.repository.ts`
- **Use Cases**: `action-entity-name.use-case.ts` (e.g., `create-transaction.use-case.ts`)
- **DTOs**: `action-entity-name.dto.ts` (e.g., `create-transaction.dto.ts`)
- **Controllers**: `entity-name.controller.ts`
- **Modules**: `entity-name.module.ts`
- **Mappers**: `prisma-entity-name.mapper.ts`

### Frontend (Next.js)
- **Components**: `PascalCase.tsx` (e.g., `FeatureList.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-transactions.ts`)
- **Services**: `kebab-case.service.ts` (e.g., `transaction.service.ts`)
- **Types**: `kebab-case.types.ts` (e.g., `transaction.types.ts`)
- **Stores**: `kebab-case.store.ts` (e.g., `auth.store.ts`)
- **Pages**: `page.tsx` (Next.js App Router convention)

---

## Testing Patterns

### Backend Unit Test Template

```typescript
// backend/src/application/use-cases/<feature>/__tests__/<action>-<entity-name>.use-case.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEntityNameUseCase } from '../create-<entity-name>.use-case';
import { EntityNameRepository } from '@/domain/repositories/<entity-name>.repository.interface';
import { EntityName } from '@/domain/entities/<entity-name>.entity';

describe('CreateEntityNameUseCase', () => {
  let useCase: CreateEntityNameUseCase;
  let repository: jest.Mocked<EntityNameRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEntityNameUseCase,
        {
          provide: EntityNameRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateEntityNameUseCase>(CreateEntityNameUseCase);
    repository = module.get(EntityNameRepository);
  });

  it('should create an entity', async () => {
    const dto = { property1: 'test', property2: 123 };
    const entity = EntityName.create(dto);

    repository.create.mockResolvedValue(entity);

    const result = await useCase.execute(dto);

    expect(result).toEqual(entity);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        property1: dto.property1,
        property2: dto.property2,
      }),
    );
  });
});
```

### Frontend Component Test Template

```typescript
// frontend/src/modules/<feature>/components/__tests__/FeatureList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeatureList } from '../FeatureList';
import { featureService } from '../../services/<feature>.service';

jest.mock('../../services/<feature>.service');

describe('FeatureList', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should render features list', async () => {
    const mockFeatures = [
      { id: '1', property1: 'Test 1', property2: 100, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    (featureService.getAll as jest.Mock).mockResolvedValue(mockFeatures);

    render(<FeatureList />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Test 1')).toBeInTheDocument();
    });
  });
});
```

---

## Common Prisma Patterns

### Decimal Handling

```typescript
// For handling Prisma Decimal in mappers
import { Decimal } from '@prisma/client/runtime/library';

// Convert Decimal to number
const amount = prismaDecimal.toNumber();

// Convert number to Decimal
const decimal = new Decimal(numberValue);
```

### Transactions

```typescript
// Use Prisma transactions for atomic operations
await this.prisma.$transaction([
  this.prisma.account.update({ where: { id: fromId }, data: { balance: { decrement: amount } } }),
  this.prisma.account.update({ where: { id: toId }, data: { balance: { increment: amount } } }),
  this.prisma.transaction.create({ data: transactionData }),
]);
```

---

## Quick Reference Links

- **Path Aliases**: `@/` maps to `src/` in both backend and frontend
- **Backend Port**: 3001
- **Frontend Port**: 3000
- **API Prefix**: `/api/v1`
- **Database**: SQL Server (port 1433)
- **Currency Default**: BRL
- **Decimal Precision**: `Decimal(18, 2)`
