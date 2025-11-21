---
name: validate-architecture
description: Comprehensive architecture validation for Clean Architecture (backend) and Feature-Sliced Design (frontend) compliance
---

# Validate Architecture Skill

## Overview

This skill performs comprehensive validation of the codebase architecture, ensuring compliance with Clean Architecture principles in the backend and Feature-Sliced Design in the frontend.

## When to Use

- Before committing major changes
- After creating new features or modules
- During code reviews
- When onboarding new team members
- Periodically (weekly/monthly) for architecture health checks

## Prerequisites

- Codebase is committed or at a stable state
- Backend and frontend directories exist
- TypeScript is configured properly

## What This Skill Validates

### Backend (Clean Architecture)

1. **Layer Dependency Rules**
   - Domain has zero external dependencies
   - Application only depends on domain
   - Infrastructure depends on domain and application

2. **File Organization**
   - Entities in `domain/entities/`
   - Repository interfaces in `domain/repositories/`
   - Use cases in `application/use-cases/`
   - DTOs in `application/dtos/`
   - Prisma repositories in `infrastructure/persistence/prisma/repositories/`
   - Controllers in `infrastructure/http/controllers/`
   - Modules in `infrastructure/modules/`

3. **Naming Conventions**
   - Entities: `*.entity.ts`
   - Repositories: `*.repository.interface.ts` and `prisma-*.repository.ts`
   - Use cases: `*.use-case.ts`
   - DTOs: `*.dto.ts`
   - Controllers: `*.controller.ts`
   - Modules: `*.module.ts`

4. **Business Logic Placement**
   - Business rules in domain entities
   - Application logic in use cases
   - No business logic in controllers

### Frontend (Feature-Sliced Design)

1. **Module Isolation**
   - No cross-module imports
   - Shared code in `shared/`
   - Each module self-contained

2. **File Organization**
   - Types in `modules/<feature>/types/`
   - Services in `modules/<feature>/services/`
   - Hooks in `modules/<feature>/hooks/`
   - Components in `modules/<feature>/components/`

3. **State Management**
   - React Query for server state
   - Zustand only for global state
   - No prop drilling beyond 2 levels

4. **App Router Compliance**
   - Pages in `app/` are thin wrappers
   - Business logic in modules
   - Proper use of server/client components

## Step-by-Step Workflow

### Step 1: Initialize Validation

Confirm what to validate:
- [ ] Full codebase (backend + frontend)
- [ ] Backend only
- [ ] Frontend only
- [ ] Specific feature/module

---

### Step 2: Backend - Domain Layer Validation

**Check 1: Zero External Dependencies**

Search for forbidden imports in domain layer:

```bash
# Should return ZERO results
grep -r "from '@nestjs" backend/src/domain/
grep -r "from 'prisma" backend/src/domain/
grep -r "from 'class-validator" backend/src/domain/
grep -r "import.*@nestjs" backend/src/domain/
```

**Expected:** No imports from NestJS, Prisma, class-validator, or any framework.

**Check 2: Entity Structure**

All entities should:
- Be classes (not interfaces)
- Have business logic methods
- Have factory methods (e.g., `static create()`)
- Use readonly properties where appropriate

Example validation:
```typescript
// ✅ Good
export class Transaction {
  constructor(
    public readonly id: string,
    // ...
  ) {}

  public isValid(): boolean {
    // Business logic
  }

  static create(props): Transaction {
    // Factory
  }
}

// ❌ Bad
export interface Transaction {
  id: string;
  // No logic, just data
}
```

**Check 3: Repository Interfaces**

All repository interfaces should:
- Be in `domain/repositories/`
- Use `export interface` with `export const Symbol`
- Have no implementation details

Example:
```typescript
// ✅ Good
export interface TransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
}

export const TransactionRepository = Symbol('TransactionRepository');
```

---

### Step 3: Backend - Application Layer Validation

**Check 4: Use Case Structure**

All use cases should:
- Have single public method `execute()`
- Inject dependencies via constructor
- Use repository interfaces (not implementations)
- Have proper error handling

Search pattern:
```bash
find backend/src/application/use-cases -name "*.use-case.ts"
```

Validate each:
```typescript
// ✅ Good
@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TransactionRepository)
    private readonly repository: TransactionRepository,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    // Implementation
  }
}

// ❌ Bad
export class CreateTransactionUseCase {
  async execute(dto: any): any {
    // No DI, any types
  }
}
```

**Check 5: DTO Validation**

All DTOs should:
- Use class-validator decorators
- Have Swagger decorators
- Separate input and output DTOs

Example:
```typescript
// ✅ Good
export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  amount: number;
}

export class TransactionResponseDto {
  id: string;
  description: string;
  amount: number;
  // ...
}
```

---

### Step 4: Backend - Infrastructure Layer Validation

**Check 6: Repository Implementations**

All Prisma repositories should:
- Implement repository interface
- Use mapper for domain ↔ Prisma conversion
- Have no business logic

Search:
```bash
find backend/src/infrastructure/persistence/prisma/repositories -name "prisma-*.repository.ts"
```

Validate:
```typescript
// ✅ Good
@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const data = await this.prisma.transaction.create({
      data: PrismaTransactionMapper.toPrisma(transaction),
    });
    return PrismaTransactionMapper.toDomain(data);
  }
}

// ❌ Bad
export class PrismaTransactionRepository {
  // No interface, no mapper, business logic here
}
```

**Check 7: Mappers**

All mappers should:
- Be in `infrastructure/persistence/prisma/mappers/`
- Have `toDomain()` and `toPrisma()` methods
- Handle Decimal conversion properly

**Check 8: Controllers**

All controllers should:
- Be thin (no business logic)
- Inject use cases
- Use DTOs for validation
- Have Swagger decorations

```typescript
// ✅ Good
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create transaction' })
  @ApiResponse({ status: 201, type: TransactionResponseDto })
  async create(@Body() dto: CreateTransactionDto): Promise<TransactionResponseDto> {
    const transaction = await this.createUseCase.execute(dto);
    // Map to response DTO
    return { /* ... */ };
  }
}

// ❌ Bad
@Controller('transactions')
export class TransactionController {
  async create(@Body() data: any) {
    // Business logic here, no use case
  }
}
```

**Check 9: Modules**

All modules should:
- Import PrismaModule (if using database)
- Register use cases as providers
- Bind interfaces to implementations
- Export use cases if needed by other modules

```typescript
// ✅ Good
@Module({
  imports: [PrismaModule],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [CreateTransactionUseCase],
})
export class TransactionModule {}
```

---

### Step 5: Frontend - Module Structure Validation

**Check 10: Module Isolation**

No module should import from another module:

```bash
# Search for cross-module imports (should be ZERO)
grep -r "from '@/modules/[^']*'" frontend/src/modules/*/
# Exclude imports from own module and shared
```

**Expected:** Only imports from:
- `@/shared/`
- Same module (e.g., `@/modules/transactions/` importing from `@/modules/transactions/`)

**Check 11: Module Structure**

Each module should have:
```
modules/<feature>/
├── types/
│   └── *.types.ts
├── services/
│   └── *.service.ts
├── hooks/
│   └── use-*.ts
└── components/
    └── *.tsx
```

Validate:
```bash
for dir in frontend/src/modules/*/; do
  echo "Checking $(basename $dir):"
  [ -d "$dir/types" ] && echo "✅ types/" || echo "⚠️  Missing types/"
  [ -d "$dir/services" ] && echo "✅ services/" || echo "⚠️  Missing services/"
  [ -d "$dir/hooks" ] && echo "✅ hooks/" || echo "⚠️  Missing hooks/"
  [ -d "$dir/components" ] && echo "✅ components/" || echo "⚠️  Missing components/"
done
```

---

### Step 6: Frontend - State Management Validation

**Check 12: React Query Usage**

All server state should use React Query:

Search for direct fetch/axios in components:
```bash
# Should be in services/, not components/
grep -r "fetch\|axios" frontend/src/modules/*/components/
```

**Expected:** Zero direct API calls in components. All should use hooks from `hooks/use-*.ts`.

**Check 13: Zustand Usage**

Zustand stores should only be for truly global state:

```bash
find frontend/src -name "*store.ts" -o -name "*store.tsx"
```

Validate each store is truly global:
- ✅ Auth state
- ✅ Theme preference
- ✅ User settings
- ❌ Server data (use React Query)
- ❌ Form state (use useState)

---

### Step 7: Frontend - App Router Validation

**Check 14: Page Complexity**

Pages should be thin wrappers:

```bash
# Find pages
find frontend/src/app -name "page.tsx"
```

Each page should:
- Import feature component from modules
- Handle server/client boundary properly
- Not contain business logic

```typescript
// ✅ Good
import { TransactionList } from '@/modules/transactions/components/transaction-list';

export default function TransactionsPage() {
  return (
    <div className="container">
      <h1>Transactions</h1>
      <TransactionList />
    </div>
  );
}

// ❌ Bad
export default function TransactionsPage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/transactions').then(/* ... */);
  }, []);
  // Too much logic in page
}
```

---

### Step 8: TypeScript & Linting Validation

**Check 15: Type Safety**

Run TypeScript compiler:

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run type-check
```

**Expected:** Zero TypeScript errors.

**Check 16: Linting**

Run ESLint:

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

**Expected:** Zero linting errors (warnings acceptable).

---

### Step 9: Generate Validation Report

**Create report with findings:**

```markdown
# Architecture Validation Report

**Date:** YYYY-MM-DD
**Validator:** Claude Code

## Summary

- ✅ Passed: X checks
- ⚠️  Warnings: Y checks
- ❌ Failed: Z checks

## Backend (Clean Architecture)

### Domain Layer
- ✅ Zero external dependencies
- ✅ All entities have business logic
- ⚠️  Missing factory method in `Goal` entity

### Application Layer
- ✅ All use cases follow pattern
- ❌ `CreateTransactionDto` missing validation

### Infrastructure Layer
- ✅ All repositories implement interfaces
- ✅ Mappers present for all entities
- ✅ Controllers are thin

## Frontend (Feature-Sliced Design)

### Module Structure
- ✅ All modules have proper structure
- ❌ `goals` module missing `services/` directory

### State Management
- ✅ React Query used for server state
- ⚠️  Direct fetch() found in `TransactionCard` component

### App Router
- ✅ All pages are thin wrappers

## Action Items

1. Add validation to `CreateTransactionDto`
2. Create `goals/services/` directory
3. Refactor `TransactionCard` to use React Query hook
4. Add factory method to `Goal` entity

## Metrics

- Total files checked: N
- Architecture compliance: X%
- Clean Architecture score: Y/10
- Feature-Sliced score: Z/10
```

---

## Automated Validation Script

Create validation script:

**File:** `scripts/validate-architecture.sh`

```bash
#!/bin/bash

echo "🔍 Validating Architecture..."
echo ""

# Backend - Domain Layer
echo "📦 Backend Domain Layer"
DOMAIN_DEPS=$(grep -r "from '@nestjs\|from 'prisma\|from 'class-validator" backend/src/domain/ | wc -l)
if [ "$DOMAIN_DEPS" -eq 0 ]; then
  echo "✅ Domain has zero external dependencies"
else
  echo "❌ Domain has $DOMAIN_DEPS forbidden imports"
fi

# Backend - File Structure
echo ""
echo "📁 Backend File Structure"
[ -d "backend/src/domain/entities" ] && echo "✅ domain/entities/" || echo "❌ Missing domain/entities/"
[ -d "backend/src/domain/repositories" ] && echo "✅ domain/repositories/" || echo "❌ Missing domain/repositories/"
[ -d "backend/src/application/use-cases" ] && echo "✅ application/use-cases/" || echo "❌ Missing application/use-cases/"
[ -d "backend/src/application/dtos" ] && echo "✅ application/dtos/" || echo "❌ Missing application/dtos/"
[ -d "backend/src/infrastructure/persistence/prisma" ] && echo "✅ infrastructure/persistence/prisma/" || echo "❌ Missing infrastructure/persistence/prisma/"

# Frontend - Module Isolation
echo ""
echo "🎨 Frontend Module Isolation"
CROSS_IMPORTS=$(grep -r "from '@/modules/" frontend/src/modules/ | grep -v "from '@/modules/$(basename $(dirname $file))" | wc -l)
if [ "$CROSS_IMPORTS" -eq 0 ]; then
  echo "✅ No cross-module imports"
else
  echo "❌ Found $CROSS_IMPORTS cross-module imports"
fi

# TypeScript
echo ""
echo "📝 TypeScript Compilation"
cd backend && npm run build > /dev/null 2>&1 && echo "✅ Backend compiles" || echo "❌ Backend has TS errors"
cd ../frontend && npm run build > /dev/null 2>&1 && echo "✅ Frontend compiles" || echo "❌ Frontend has TS errors"

echo ""
echo "✅ Validation complete"
```

---

## Success Criteria

✅ All domain layer files have zero external dependencies
✅ All use cases follow pattern with single `execute()` method
✅ All repositories implement interfaces with mappers
✅ All controllers are thin and use use cases
✅ All frontend modules are self-contained
✅ No cross-module imports in frontend
✅ React Query used for all server state
✅ App Router pages are thin wrappers
✅ TypeScript compiles with zero errors
✅ Linting passes with zero errors

---

## Common Violations & Fixes

### Violation 1: Business Logic in Controller

**Problem:**
```typescript
@Controller('transactions')
export class TransactionController {
  async create(@Body() dto: CreateTransactionDto) {
    // Business logic here
    if (dto.amount <= 0) throw new Error('Invalid');
    // ...
  }
}
```

**Fix:**
Move logic to entity or use case:
```typescript
// domain/entities/transaction.entity.ts
export class Transaction {
  public isValid(): boolean {
    return this.amount > 0;
  }
}

// Controller becomes thin
@Controller('transactions')
export class TransactionController {
  constructor(private readonly createUseCase: CreateTransactionUseCase) {}

  async create(@Body() dto: CreateTransactionDto) {
    return this.createUseCase.execute(dto);
  }
}
```

### Violation 2: Domain Depends on Framework

**Problem:**
```typescript
// domain/entities/transaction.entity.ts
import { Injectable } from '@nestjs/common'; // ❌

@Injectable()
export class Transaction {
  // ...
}
```

**Fix:**
Remove all framework imports from domain:
```typescript
// domain/entities/transaction.entity.ts
export class Transaction {
  // Pure TypeScript class
}
```

### Violation 3: Cross-Module Import

**Problem:**
```typescript
// modules/goals/components/goal-card.tsx
import { useTransactions } from '@/modules/transactions/hooks/use-transactions'; // ❌
```

**Fix:**
Move shared logic to `shared/`:
```typescript
// shared/hooks/use-financial-data.ts
export function useFinancialData() {
  // Shared logic
}

// Both modules import from shared
import { useFinancialData } from '@/shared/hooks/use-financial-data';
```

---

## Resources

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

**Need help?** Ask Claude: "Validate my architecture" or "Check Clean Architecture compliance"
