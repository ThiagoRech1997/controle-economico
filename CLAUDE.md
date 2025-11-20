# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **personal financial control system** built with **Clean Architecture (Hexagonal)** in the backend and **Feature-Sliced Design** in the frontend. The system manages transactions, accounts, categories, and financial goals with forecasting capabilities.

**Key Technologies:**
- Backend: NestJS + Prisma + SQL Server
- Frontend: Next.js 14 (App Router) + React Query + Zustand + Tailwind + Shadcn/UI

## Development Commands

### Backend (from `backend/` directory)

```bash
# Development
npm run start:dev              # Start with hot-reload (http://localhost:3001)
npm run build                  # Build for production
npm run start:prod             # Run production build

# Database (Prisma)
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Run migrations (creates DB if needed)
npm run prisma:studio          # Visual database browser
npx prisma migrate dev --name <name>  # Create new migration

# Testing
npm run test                   # Run unit tests
npm run test:watch             # Run tests in watch mode
npm run test:cov               # Generate coverage report
npm run test:e2e               # Run end-to-end tests

# Code Quality
npm run lint                   # Run ESLint with auto-fix
npm run format                 # Format with Prettier
```

### Frontend (from `frontend/` directory)

```bash
# Development
npm run dev                    # Start dev server (http://localhost:3000)
npm run build                  # Build for production
npm run start                  # Run production build

# Code Quality
npm run lint                   # Run Next.js linter
npm run format                 # Format with Prettier
npm run type-check             # TypeScript type checking
```

## Architecture Guidelines

### Backend: Hexagonal Architecture (Ports & Adapters)

**Critical Rule**: Dependencies flow **inward** toward the domain.

```
Domain (pure logic) ← Application (use cases) ← Infrastructure (adapters)
```

**Layer Structure:**

1. **`domain/`** - Pure business logic, ZERO framework dependencies
   - `entities/`: Business objects with identity (Transaction, Account, Goal)
   - `value-objects/`: Immutable concepts (Money, TransactionType)
   - `repositories/`: Repository **interfaces** (ports)
   - NO imports from NestJS, Prisma, or any external library

2. **`application/`** - Use cases and orchestration
   - `use-cases/`: Application services (e.g., CreateTransactionUseCase)
   - `dtos/`: Input/output data transfer objects
   - Can import from `domain/` only

3. **`infrastructure/`** - Framework and external adapters
   - `persistence/prisma/`: Repository **implementations** using Prisma
   - `http/controllers/`: NestJS REST controllers
   - `modules/`: NestJS DI configuration
   - Can import from `domain/` and `application/`

**Implementation Pattern:**
```typescript
// 1. Domain defines interface (port)
// domain/repositories/transaction.repository.interface.ts
export interface TransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
}

// 2. Infrastructure implements (adapter)
// infrastructure/persistence/prisma/repositories/prisma-transaction.repository.ts
export class PrismaTransactionRepository implements TransactionRepository {
  // Uses Prisma to implement the interface
}

// 3. Use case depends on interface
// application/use-cases/transactions/create-transaction.use-case.ts
export class CreateTransactionUseCase {
  constructor(private repository: TransactionRepository) {}
}

// 4. Module wires it up
// infrastructure/modules/transaction.module.ts
providers: [
  { provide: TransactionRepository, useClass: PrismaTransactionRepository }
]
```

### Frontend: Feature-Sliced Design

**Structure:**
- `app/`: Next.js routing ONLY (no business logic)
- `modules/`: Self-contained feature modules (transactions, goals, accounts)
- `shared/`: Reusable components and utilities

**Module Structure** (e.g., `modules/transactions/`):
```
transactions/
├── components/    # UI components for this feature
├── hooks/         # React Query hooks (use-transactions.ts)
├── services/      # API communication (transaction.service.ts)
├── types/         # TypeScript interfaces
└── store/         # Zustand store (if needed)
```

**Key Rules:**
- App Router pages are thin wrappers - delegate to feature components
- React Query for ALL server state
- Zustand ONLY for true global state (auth, theme)
- Modules are independent - no cross-module imports
- Shared code goes in `shared/`

## Database Schema (Prisma)

**Models:**
- `User`: User accounts
- `Account`: Financial accounts (bank, wallet) with initialBalance and currency
- `Category`: Transaction categories with `isEssential` flag (true = fixed costs, false = discretionary)
- `Transaction`: Income/Expense records with `isPaid` status
- `Goal`: Financial objectives with forecasting

**Key Relationships:**
- User → Account, Category, Goal (1:N, cascade delete)
- Account → Transaction (1:N, cascade delete)
- Category → Transaction (1:N, restrict delete)

**Environment Setup:**
1. Copy `.env.example` to `.env` in backend
2. Update `DATABASE_URL` with SQL Server connection string
3. Run `npm run prisma:generate && npm run prisma:migrate`

## Core Business Logic

### Transaction Management
- Transactions have type: `INCOME` or `EXPENSE`
- Categories are marked as essential (fixed costs) vs non-essential (discretionary)
- Transactions can be pending (`isPaid: false`) or completed

### Goal Forecasting
**Algorithm** (ForecastGoalAchievementUseCase):
1. Calculate average monthly surplus: `AVG(monthly_income - monthly_expenses)`
2. Calculate remaining amount: `goalTarget - currentValue`
3. Estimate months: `remainingAmount / avgMonthlySurplus`
4. Return achievement date or "not achievable" if surplus ≤ 0

## Common Patterns

### Adding a New Use Case (Backend)

1. Create entity in `domain/entities/` (if needed)
2. Define repository interface in `domain/repositories/`
3. Create DTOs in `application/dtos/`
4. Implement use case in `application/use-cases/`
5. Create repository implementation in `infrastructure/persistence/prisma/repositories/`
6. Create controller in `infrastructure/http/controllers/`
7. Wire up in module in `infrastructure/modules/`

### Adding a New Feature Module (Frontend)

1. Create folder in `modules/<feature>/`
2. Add types in `types/<feature>.types.ts`
3. Create service in `services/<feature>.service.ts`
4. Create React Query hooks in `hooks/use-<feature>.ts`
5. Build components in `components/`
6. Create page in `app/<feature>/page.tsx` that imports the component

## Important Notes

- **SQL Server**: Database runs on port 1433 by default
- **Backend Port**: 3001 (configured in `.env`)
- **Frontend Port**: 3000 (Next.js default)
- **API Prefix**: `/api/v1` (configured in backend .env)
- **CORS**: Backend allows `http://localhost:3000` by default
- **Currency**: Default is `BRL` (Brazilian Real)
- **Decimal Precision**: SQL Server uses `Decimal(18, 2)` for money values

## Testing Strategy

**Backend:**
- Unit tests: Domain entities and value objects (pure logic)
- Integration tests: Use cases with mock/in-memory repositories
- E2E tests: Full API endpoints with test database

**Frontend:**
- Component tests: React Testing Library
- Hook tests: Test React Query hooks with mock API
- E2E tests: Playwright/Cypress for user flows

## Path Aliases

**Backend:** `@/` maps to `src/`
**Frontend:** `@/` maps to `src/`

Both use TypeScript path mapping configured in `tsconfig.json`.
