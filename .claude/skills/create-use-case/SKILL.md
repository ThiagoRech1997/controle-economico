---
name: create-use-case
description: Guided workflow to create a complete NestJS use case following Clean Architecture with domain entities, repository interfaces, DTOs, implementation, and tests
---

# Create Use Case Skill

## Overview

This skill guides you through creating a complete, production-ready use case implementation following Clean Architecture principles. It creates all necessary files from domain layer to infrastructure layer.

## When to Use

- You're building a new feature or extending an existing one
- You need a complete CRUD operation or custom business logic
- You want step-by-step guidance following Clean Architecture
- You're new to the project and want to learn the patterns

## Prerequisites

- Backend development environment set up
- Prisma schema exists (or you're adding to it)
- Understanding of the feature you're building

## What This Skill Creates

1. **Domain Layer** (Pure business logic)
   - Entity class with business rules
   - Repository interface (port)

2. **Application Layer** (Use cases & DTOs)
   - Input DTO with validation
   - Output DTO (response)
   - Use case implementation

3. **Infrastructure Layer** (Adapters)
   - Prisma repository implementation
   - Prisma mapper (Domain ↔ Database)
   - NestJS controller
   - NestJS module (DI configuration)

4. **Tests** (Optional but recommended)
   - Unit tests for use case
   - Mock repository setup

## Step-by-Step Workflow

### Step 1: Feature Discovery

**Questions to answer:**

1. **What feature are you building?**
   - Examples: "payments", "notifications", "reports"
   - This will be your feature folder name

2. **Is this a new feature or extending existing?**
   - New: Creates complete entity + repository
   - Existing: Reuses entity, creates new use case

3. **What is the use case name?**
   - Examples: "create-payment", "send-notification", "generate-report"
   - Use format: `<action>-<entity>`

4. **What type of operation is this?**
   - CRUD (Create/Read/Update/Delete)
   - Custom business logic
   - Query with complex filters
   - Multi-step process

**Example Answers:**
```
Feature: payments
Type: new
Use case: create-payment
Operation: Create with validation
```

---

### Step 2: Define Domain Model

**For NEW features:**

1. **Entity Properties**

   What data does your entity have?

   Example for Payment:
   ```
   - id (UUID)
   - userId (string)
   - amount (number)
   - currency (string, default: BRL)
   - status (enum: pending, completed, failed)
   - description (string, optional)
   - createdAt (Date)
   - updatedAt (Date)
   ```

2. **Business Rules**

   What rules must be validated?

   Example for Payment:
   ```
   - Amount must be positive
   - Status transitions: pending → completed or failed only
   - Cannot modify completed payments
   - Currency must be valid ISO code
   ```

3. **Relationships**

   How does this entity relate to others?

   Example:
   ```
   - Payment belongs to User (userId foreign key)
   - Payment may have multiple PaymentItems (1:N)
   ```

**For EXISTING features:**

Skip to Step 3 (the entity already exists).

---

### Step 3: Design DTOs

**Input DTO** (what comes from API):

What fields are required/optional?

Example `CreatePaymentDto`:
```typescript
{
  userId: string;        // Required
  amount: number;        // Required, positive
  currency?: string;     // Optional, defaults to BRL
  description?: string;  // Optional
}
```

**Output DTO** (what goes to API):

Usually mirrors entity but may hide sensitive fields.

Example `PaymentResponseDto`:
```typescript
{
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Step 4: Use Case Logic

**Core workflow:**

1. What inputs does the use case receive?
2. What validations are needed?
3. What business logic executes?
4. What is persisted?
5. What is returned?

Example for CreatePaymentUseCase:
```
1. Receive: CreatePaymentDto
2. Validate: Amount > 0, currency valid
3. Logic: Create Payment entity, set status to 'pending'
4. Persist: Save via repository
5. Return: Payment entity
```

---

### Step 5: Database Schema (if new entity)

**Prisma Model:**

Based on your entity, what Prisma model is needed?

Example:
```prisma
model Payment {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  amount      Decimal  @db.Decimal(18, 2)
  currency    String   @default("BRL")
  status      String   // pending, completed, failed
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([status])
}
```

---

### Step 6: Implementation

Now I'll create all the files:

#### 6.1 Domain Entity

**File:** `backend/src/domain/entities/payment.entity.ts`

```typescript
export class Payment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly status: PaymentStatus,
    public readonly description: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Business logic
  public isValid(): boolean {
    return this.amount > 0 && this.isValidCurrency();
  }

  private isValidCurrency(): boolean {
    const validCurrencies = ['BRL', 'USD', 'EUR'];
    return validCurrencies.includes(this.currency);
  }

  public canTransitionTo(newStatus: PaymentStatus): boolean {
    if (this.status === 'completed' || this.status === 'failed') {
      return false; // Cannot change final statuses
    }
    return true;
  }

  // Factory
  static create(props: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Payment {
    return new Payment(
      crypto.randomUUID(),
      props.userId,
      props.amount,
      props.currency,
      props.status,
      props.description,
      new Date(),
      new Date(),
    );
  }
}

export type PaymentStatus = 'pending' | 'completed' | 'failed';
```

#### 6.2 Repository Interface

**File:** `backend/src/domain/repositories/payment.repository.interface.ts`

```typescript
import { Payment } from '../entities/payment.entity';

export interface PaymentRepository {
  create(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByUserId(userId: string): Promise<Payment[]>;
  update(payment: Payment): Promise<Payment>;
  delete(id: string): Promise<void>;
}

export const PaymentRepository = Symbol('PaymentRepository');
```

#### 6.3 DTOs

**Files:** `backend/src/application/dtos/payments/`

```typescript
// create-payment.dto.ts
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ default: 'BRL' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

// payment-response.dto.ts
export class PaymentResponseDto {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 6.4 Use Case

**File:** `backend/src/application/use-cases/payments/create-payment.use-case.ts`

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '@/domain/repositories/payment.repository.interface';
import { Payment } from '@/domain/entities/payment.entity';
import { CreatePaymentDto } from '@/application/dtos/payments/create-payment.dto';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(PaymentRepository)
    private readonly repository: PaymentRepository,
  ) {}

  async execute(dto: CreatePaymentDto): Promise<Payment> {
    // Create domain entity
    const payment = Payment.create({
      userId: dto.userId,
      amount: dto.amount,
      currency: dto.currency || 'BRL',
      status: 'pending',
      description: dto.description || null,
    });

    // Validate business rules
    if (!payment.isValid()) {
      throw new Error('Invalid payment data');
    }

    // Persist
    return await this.repository.create(payment);
  }
}
```

#### 6.5 Prisma Repository

**File:** `backend/src/infrastructure/persistence/prisma/repositories/prisma-payment.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaymentRepository } from '@/domain/repositories/payment.repository.interface';
import { Payment } from '@/domain/entities/payment.entity';
import { PrismaPaymentMapper } from '../mappers/prisma-payment.mapper';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payment: Payment): Promise<Payment> {
    const data = await this.prisma.payment.create({
      data: PrismaPaymentMapper.toPrisma(payment),
    });
    return PrismaPaymentMapper.toDomain(data);
  }

  async findById(id: string): Promise<Payment | null> {
    const data = await this.prisma.payment.findUnique({ where: { id } });
    return data ? PrismaPaymentMapper.toDomain(data) : null;
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const data = await this.prisma.payment.findMany({ where: { userId } });
    return data.map(PrismaPaymentMapper.toDomain);
  }

  async update(payment: Payment): Promise<Payment> {
    const data = await this.prisma.payment.update({
      where: { id: payment.id },
      data: PrismaPaymentMapper.toPrisma(payment),
    });
    return PrismaPaymentMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payment.delete({ where: { id } });
  }
}
```

#### 6.6 Mapper

**File:** `backend/src/infrastructure/persistence/prisma/mappers/prisma-payment.mapper.ts`

```typescript
import { Payment as PrismaPayment } from '@prisma/client';
import { Payment, PaymentStatus } from '@/domain/entities/payment.entity';

export class PrismaPaymentMapper {
  static toDomain(prisma: PrismaPayment): Payment {
    return new Payment(
      prisma.id,
      prisma.userId,
      prisma.amount.toNumber(),
      prisma.currency,
      prisma.status as PaymentStatus,
      prisma.description,
      prisma.createdAt,
      prisma.updatedAt,
    );
  }

  static toPrisma(domain: Payment): Omit<PrismaPayment, 'createdAt' | 'updatedAt'> {
    return {
      id: domain.id,
      userId: domain.userId,
      amount: domain.amount,
      currency: domain.currency,
      status: domain.status,
      description: domain.description,
    };
  }
}
```

#### 6.7 Controller

**File:** `backend/src/infrastructure/http/controllers/payment.controller.ts`

```typescript
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePaymentUseCase } from '@/application/use-cases/payments/create-payment.use-case';
import { CreatePaymentDto, PaymentResponseDto } from '@/application/dtos/payments';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly createUseCase: CreatePaymentUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, type: PaymentResponseDto })
  async create(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.createUseCase.execute(dto);
    return {
      id: payment.id,
      userId: payment.userId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      description: payment.description,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
```

#### 6.8 Module

**File:** `backend/src/infrastructure/modules/payment.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { PaymentController } from '@/infrastructure/http/controllers/payment.controller';
import { CreatePaymentUseCase } from '@/application/use-cases/payments/create-payment.use-case';
import { PrismaPaymentRepository } from '@/infrastructure/persistence/prisma/repositories/prisma-payment.repository';
import { PaymentRepository } from '@/domain/repositories/payment.repository.interface';
import { PrismaModule } from '@/infrastructure/persistence/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [
    CreatePaymentUseCase,
    {
      provide: PaymentRepository,
      useClass: PrismaPaymentRepository,
    },
  ],
  exports: [CreatePaymentUseCase],
})
export class PaymentModule {}
```

---

### Step 7: Tests (Optional)

**File:** `backend/src/application/use-cases/payments/__tests__/create-payment.use-case.spec.ts`

```typescript
describe('CreatePaymentUseCase', () => {
  let useCase: CreatePaymentUseCase;
  let repository: jest.Mocked<PaymentRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreatePaymentUseCase(repository);
  });

  it('should create a payment successfully', async () => {
    const dto = {
      userId: 'user-1',
      amount: 100.50,
      currency: 'BRL',
    };

    const mockPayment = Payment.create({
      ...dto,
      status: 'pending',
      description: null,
    });

    repository.create.mockResolvedValue(mockPayment);

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.amount).toBe(100.50);
    expect(result.status).toBe('pending');
  });
});
```

---

### Step 8: Update Prisma Schema

Add the model to `backend/prisma/schema.prisma` and run migration:

```bash
/db-migrate add-payments-table
```

---

### Step 9: Register Module

Add to `backend/src/app.module.ts`:

```typescript
import { PaymentModule } from './infrastructure/modules/payment.module';

@Module({
  imports: [
    // ... other modules
    PaymentModule,
  ],
})
export class AppModule {}
```

---

## Success Criteria

✅ All files created with correct structure
✅ Domain layer has zero framework dependencies
✅ Repository interface defined, implementation separate
✅ DTOs have validation decorators
✅ Use case follows Single Responsibility Principle
✅ Tests cover main scenarios
✅ Prisma schema updated
✅ Module registered in app

---

## Next Steps

1. Run `/arch-validate` to verify architecture
2. Run `/pre-commit` to validate code quality
3. Test manually with `npm run start:dev`
4. Create additional use cases (Update, Delete, etc.) if needed

---

## Common Patterns

**For Read operations:**
- Use case: `GetPaymentByIdUseCase`
- DTO: Only output (no input needed beyond ID)
- Repository: `findById` method

**For Update operations:**
- Use case: `UpdatePaymentUseCase`
- DTO: `UpdatePaymentDto` (all fields optional except ID)
- Logic: Fetch existing, validate changes, update

**For Delete operations:**
- Use case: `DeletePaymentUseCase`
- Logic: Check permissions, soft delete vs hard delete

---

## Troubleshooting

**Issue:** "Cannot find module '@/...'"
- Solution: Check tsconfig.json has path aliases configured

**Issue:** "Prisma type mismatch"
- Solution: Run `npm run prisma:generate` after schema changes

**Issue:** "Module not found"
- Solution: Ensure module is imported in app.module.ts

---

## Resources

- **Templates:** See `.claude/patterns.md`
- **Examples:** See `.claude/EXAMPLES.md`
- **Architecture:** See `CLAUDE.md`

---

**Need help?** Ask Claude: "Guide me through creating a use case for X"
