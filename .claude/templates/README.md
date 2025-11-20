# Templates de Código

Templates prontos para uso rápido. Copie e adapte conforme necessário.

## 📋 Índice

1. [Backend Templates](#backend-templates)
2. [Frontend Templates](#frontend-templates)
3. [Test Templates](#test-templates)
4. [Configuration Templates](#configuration-templates)

---

## 🏗️ Backend Templates

### 1. Domain Entity

**Arquivo:** `domain/entities/<entity-name>.entity.ts`

```typescript
/**
 * <EntityName> entity - Core business object
 *
 * Business rules:
 * - Rule 1
 * - Rule 2
 */
export class EntityName {
  constructor(
    public readonly id: string,
    public readonly property1: string,
    public readonly property2: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Business logic method
   */
  public validateBusinessRule(): boolean {
    // Pure domain logic here
    return this.property2 > 0;
  }

  /**
   * Factory method to create new instance
   */
  static create(
    props: Omit<EntityName, 'id' | 'createdAt' | 'updatedAt'>
  ): EntityName {
    return new EntityName(
      crypto.randomUUID(),
      props.property1,
      props.property2,
      new Date(),
      new Date(),
    );
  }

  /**
   * Update method (returns new instance - immutability)
   */
  update(updates: Partial<Pick<EntityName, 'property1' | 'property2'>>): EntityName {
    return new EntityName(
      this.id,
      updates.property1 ?? this.property1,
      updates.property2 ?? this.property2,
      this.createdAt,
      new Date(),
    );
  }
}
```

### 2. Repository Interface

**Arquivo:** `domain/repositories/<entity-name>.repository.interface.ts`

```typescript
import { EntityName } from '../entities/<entity-name>.entity';

/**
 * Repository interface for EntityName
 * Defines the contract for persistence operations
 */
export interface EntityNameRepository {
  findById(id: string): Promise<EntityName | null>;
  findAll(): Promise<EntityName[]>;
  create(entity: EntityName): Promise<EntityName>;
  update(entity: EntityName): Promise<EntityName>;
  delete(id: string): Promise<void>;

  // Custom queries
  findByProperty(property: string): Promise<EntityName[]>;
}

// DI token
export const EntityNameRepository = Symbol('EntityNameRepository');
```

### 3. Use Case

**Arquivo:** `application/use-cases/<feature>/<action>-<entity-name>.use-case.ts`

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { EntityNameRepository } from '@/domain/repositories/<entity-name>.repository.interface';
import { EntityName } from '@/domain/entities/<entity-name>.entity';
import { CreateEntityNameDto } from '@/application/dtos/<entity-name>/create-<entity-name>.dto';

/**
 * Use case: Create a new EntityName
 *
 * Business flow:
 * 1. Validate input
 * 2. Create domain entity
 * 3. Apply business rules
 * 4. Persist via repository
 */
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

    // 3. Persist
    return await this.repository.create(entity);
  }
}
```

### 4. DTO (Input)

**Arquivo:** `application/dtos/<entity-name>/create-<entity-name>.dto.ts`

```typescript
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEntityNameDto {
  @ApiProperty({
    description: 'Property 1 description',
    example: 'example value'
  })
  @IsString()
  property1: string;

  @ApiProperty({
    description: 'Property 2 description',
    minimum: 0,
    maximum: 1000
  })
  @IsNumber()
  @Min(0)
  @Max(1000)
  property2: number;

  @ApiPropertyOptional({ description: 'Optional property' })
  @IsOptional()
  @IsString()
  optionalProperty?: string;
}
```

### 5. Controller

**Arquivo:** `infrastructure/http/controllers/<entity-name>.controller.ts`

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEntityNameUseCase } from '@/application/use-cases/<feature>/create-<entity-name>.use-case';
import { CreateEntityNameDto, EntityNameResponseDto } from '@/application/dtos/<entity-name>';

@ApiTags('entity-names')
@Controller('entity-names')
export class EntityNameController {
  constructor(
    private readonly createUseCase: CreateEntityNameUseCase,
    // Inject other use cases...
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 201, type: EntityNameResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
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

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by ID' })
  async findOne(@Param('id') id: string): Promise<EntityNameResponseDto> {
    // Implementation
  }
}
```

---

## 🎨 Frontend Templates

### 1. TypeScript Types

**Arquivo:** `modules/<feature>/types/<feature>.types.ts`

```typescript
/**
 * Feature domain types
 */

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
  page: number;
  pageSize: number;
}

export interface FeatureFilters {
  search?: string;
  property1?: string;
  minProperty2?: number;
  maxProperty2?: number;
}
```

### 2. API Service

**Arquivo:** `modules/<feature>/services/<feature>.service.ts`

```typescript
import { Feature, CreateFeatureDto, UpdateFeatureDto } from '../types/<feature>.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class FeatureService {
  async getAll(): Promise<Feature[]> {
    const response = await fetch(`${API_URL}/features`);
    if (!response.ok) {
      throw new Error('Failed to fetch features');
    }
    return response.json();
  }

  async getById(id: string): Promise<Feature> {
    const response = await fetch(`${API_URL}/features/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch feature ${id}`);
    }
    return response.json();
  }

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
  }

  async update(id: string, data: UpdateFeatureDto): Promise<Feature> {
    const response = await fetch(`${API_URL}/features/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update feature ${id}`);
    }
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/features/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete feature ${id}`);
    }
  }
}

export const featureService = new FeatureService();
```

### 3. React Query Hooks

**Arquivo:** `modules/<feature>/hooks/use-<feature>.ts`

```typescript
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
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

### 4. List Component

**Arquivo:** `modules/<feature>/components/FeatureList.tsx`

```typescript
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

  if (!features || features.length === 0) {
    return <div>No features found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Features</h2>
      {features.map((feature) => (
        <Card key={feature.id}>
          <CardHeader>
            <CardTitle>{feature.property1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Property 2: {feature.property2}</p>
            <div className="mt-4 space-x-2">
              <Button variant="outline">Edit</Button>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(feature.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## 🧪 Test Templates

### Backend Unit Test

**Arquivo:** `application/use-cases/<feature>/__tests__/<action>-<entity-name>.use-case.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEntityNameUseCase } from '../create-<entity-name>.use-case';
import { EntityNameRepository } from '@/domain/repositories/<entity-name>.repository.interface';
import { EntityName } from '@/domain/entities/<entity-name>.entity';

describe('CreateEntityNameUseCase', () => {
  let useCase: CreateEntityNameUseCase;
  let repository: jest.Mocked<EntityNameRepository>;

  beforeEach(async () => {
    const mockRepository: jest.Mocked<EntityNameRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByProperty: jest.fn(),
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

  describe('execute', () => {
    it('should create an entity successfully', async () => {
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

    it('should throw error when business rule fails', async () => {
      const dto = { property1: 'test', property2: -1 };

      await expect(useCase.execute(dto)).rejects.toThrow();
    });
  });
});
```

---

## ⚙️ Configuration Templates

Ver [settings.local.json](../settings.local.json) e [hooks.json](../hooks.json).

---

## 📚 Mais Templates

Para templates completos e detalhados, veja:

- [patterns.md](../patterns.md) - 20+ templates completos
- [EXAMPLES.md](../EXAMPLES.md) - Exemplos práticos
- [QUICK-REFERENCE.md](../QUICK-REFERENCE.md) - Referência rápida

---

**Copie, adapte e use! 🚀**
