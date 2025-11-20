# Modular Financial Control System - Architecture Documentation

## Overview
This project implements a robust personal finance application using Clean Architecture (Hexagonal/Ports & Adapters) for the backend and Feature-Sliced Design for the frontend.

## Tech Stack

### Backend
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: SQL Server
- **Architecture**: Hexagonal (Ports & Adapters)
- **Language**: TypeScript

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Components**: Shadcn/UI + Tailwind CSS
- **State Management**:
  - Zustand (global state)
  - React Query (server state)
- **Architecture**: Modular / Feature-Sliced Design
- **Language**: TypeScript

---

## Backend Architecture (Hexagonal)

### Layer Structure

```
src/
├── domain/           # Pure Business Logic (NO framework dependencies)
├── application/      # Use Cases (Application Services)
└── infrastructure/   # Adapters (Framework & External Services)
```

### 1. Domain Layer (Core Business Logic)

**Purpose**: Contains pure business rules and entities. NO dependencies on frameworks.

**Components**:
- **Entities**: Business objects with identity (e.g., `Transaction`, `Account`, `Goal`)
- **Value Objects**: Immutable objects representing concepts (e.g., `Money`, `TransactionType`)
- **Repository Interfaces (Ports)**: Contracts for data access
- **Domain Exceptions**: Business rule violations

**Example Structure**:
```
domain/
├── entities/
│   ├── transaction.entity.ts    # Transaction aggregate root
│   ├── account.entity.ts
│   └── goal.entity.ts
├── value-objects/
│   ├── money.vo.ts               # Money with currency
│   └── transaction-type.vo.ts   # INCOME/EXPENSE
├── repositories/
│   └── transaction.repository.interface.ts  # Port
└── exceptions/
    └── domain.exception.ts
```

**Key Rules**:
- ✅ Pure TypeScript
- ✅ Framework agnostic
- ✅ Business logic only
- ❌ No imports from NestJS, Prisma, or any external library

### 2. Application Layer (Use Cases)

**Purpose**: Orchestrates business logic. Uses domain entities and repository ports.

**Components**:
- **Use Cases**: Application services (e.g., `CreateTransactionUseCase`)
- **DTOs**: Input/Output data transfer objects
- **Application Exceptions**: Use case-specific errors

**Example Structure**:
```
application/
├── use-cases/
│   ├── transactions/
│   │   ├── create-transaction.use-case.ts
│   │   └── list-transactions.use-case.ts
│   └── goals/
│       └── forecast-goal-achievement.use-case.ts
└── dtos/
    ├── transactions/
    │   ├── create-transaction.dto.ts
    │   └── transaction-response.dto.ts
    └── goals/
        └── forecast-result.dto.ts
```

**Flow**:
1. Receive input DTO
2. Validate data
3. Create/retrieve domain entities
4. Execute business logic
5. Persist via repository port
6. Return output DTO

### 3. Infrastructure Layer (Adapters)

**Purpose**: Implements ports using concrete technologies (NestJS, Prisma, etc.)

**Components**:
- **Persistence Adapters**: Implement repository interfaces using Prisma
- **HTTP Adapters**: NestJS controllers
- **Mappers**: Convert between Prisma models and Domain entities
- **Modules**: NestJS dependency injection configuration

**Example Structure**:
```
infrastructure/
├── persistence/
│   └── prisma/
│       ├── repositories/
│       │   └── prisma-transaction.repository.ts  # Adapter
│       └── mappers/
│           └── transaction.mapper.ts
├── http/
│   └── controllers/
│       └── transactions.controller.ts
└── modules/
    └── transaction.module.ts                     # DI Container
```

**Dependency Flow**:
```
Controller → Use Case → Repository Interface (Port)
                              ↑
                              |
                 Repository Implementation (Adapter)
```

---

## Frontend Architecture (Modular)

### Structure

```
src/
├── app/              # Next.js routing ONLY
├── modules/          # Feature modules (independent)
└── shared/           # Shared utilities and UI components
```

### 1. App Directory (Routing Only)

**Purpose**: Next.js App Router pages. Minimal logic - just routing.

**Example**:
```tsx
// app/transactions/page.tsx
'use client';

import { TransactionList } from '@/modules/transactions/components/transaction-list';

export default function TransactionsPage() {
  return <TransactionList />;
}
```

### 2. Modules (Feature-Sliced)

**Purpose**: Self-contained feature modules that can be developed/lazy-loaded independently.

**Structure per Module**:
```
modules/transactions/
├── components/       # UI components for this feature
├── hooks/            # React Query hooks
├── services/         # API communication
├── types/            # TypeScript interfaces
└── store/            # Zustand store (if needed)
```

**Example Module Files**:

**Types**:
```typescript
// modules/transactions/types/transaction.types.ts
export interface Transaction {
  id: string;
  accountId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  // ...
}
```

**Service**:
```typescript
// modules/transactions/services/transaction.service.ts
export const transactionService = {
  async create(data: CreateTransactionInput): Promise<Transaction> {
    return apiClient.post('/transactions', data);
  },
};
```

**Hook**:
```typescript
// modules/transactions/hooks/use-transactions.ts
export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getAll(),
  });
};
```

**Component**:
```tsx
// modules/transactions/components/transaction-list.tsx
export function TransactionList() {
  const { data, isLoading } = useTransactions();
  // Render UI
}
```

### 3. Shared Layer

**Purpose**: Reusable components, utilities, and services used across features.

**Structure**:
```
shared/
├── components/
│   └── ui/              # Shadcn/UI components
│       ├── button.tsx
│       ├── input.tsx
│       └── card.tsx
├── lib/
│   ├── api-client.ts    # Centralized HTTP client
│   └── utils.ts
└── stores/
    └── auth.store.ts    # Global Zustand store
```

---

## Database Schema (Prisma)

### Key Models

1. **User**: User accounts
2. **Account**: Financial accounts (bank, wallet, etc.)
3. **Category**: Transaction categories (with `isEssential` flag)
4. **Transaction**: Income/Expense records
5. **Goal**: Financial goals with forecasting

### Important Relationships

- `User` → `Account` (1:N)
- `User` → `Category` (1:N)
- `User` → `Goal` (1:N)
- `Account` → `Transaction` (1:N)
- `Category` → `Transaction` (1:N)

### Essential vs Non-Essential

Categories have an `isEssential` boolean:
- `true`: Fixed costs (rent, utilities)
- `false`: Variable/discretionary spending

This enables budget analysis and expense optimization.

---

## Key Features

### 1. Transaction Management
- Create/Edit/Delete income and expenses
- Categorize as essential vs non-essential
- Track payment status (paid/pending)
- Filter and paginate transactions

### 2. Forecasting Logic

**Use Case**: `ForecastGoalAchievementUseCase`

**Algorithm**:
1. Calculate average monthly surplus (Income - Expenses) over N months
2. Calculate remaining amount to reach goal
3. Estimate months to achieve: `remainingAmount / avgMonthlySurplus`
4. Return estimated achievement date

**Business Rules**:
- If surplus ≤ 0: Goal not achievable
- If remaining ≤ 0: Goal already achieved
- Otherwise: Calculate months and date

---

## Dependency Rules

### Backend
```
Domain ← Application ← Infrastructure
  ↑         ↑              ↓
  |         |         (implements)
  |    (depends on)
  |
(pure logic)
```

**Critical Rules**:
1. Domain layer has ZERO external dependencies
2. Application layer depends ONLY on Domain
3. Infrastructure depends on Application + Domain
4. Dependencies point INWARD (toward Domain)

### Frontend
```
App Router → Modules → Shared
    ↓          ↓         ↓
(routing)  (features) (reusable)
```

**Critical Rules**:
1. App Router has NO business logic
2. Modules are self-contained and independent
3. Modules can use Shared, but NOT other modules
4. Shared cannot import from Modules

---

## Getting Started

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your SQL Server connection string

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL

# Start development server
npm run dev
```

---

## Testing Strategy

### Backend
- **Unit Tests**: Domain entities and value objects
- **Integration Tests**: Use cases with in-memory repositories
- **E2E Tests**: Full API endpoints

### Frontend
- **Component Tests**: React Testing Library
- **Hook Tests**: Test custom hooks with React Query
- **E2E Tests**: Playwright or Cypress

---

## Best Practices

### Backend
1. Always create entities via factory methods (e.g., `Transaction.create()`)
2. Enforce business rules in domain entities
3. Use value objects for immutable concepts
4. Keep use cases focused (single responsibility)
5. Map between domain and persistence models explicitly

### Frontend
1. Keep pages minimal - delegate to feature components
2. Use React Query for all server state
3. Use Zustand only for true global state (auth, theme)
4. Colocate feature code in module folders
5. Extract reusable components to Shared

---

## Next Steps

1. Implement authentication (JWT)
2. Add budget planning module
3. Implement data visualization (charts)
4. Add recurring transactions
5. Implement export to Excel/PDF
6. Add multi-currency support
7. Implement category analytics

---

## File Index

### Backend Key Files
- [schema.prisma](backend/prisma/schema.prisma) - Database schema
- [transaction.entity.ts](backend/src/domain/entities/transaction.entity.ts) - Transaction domain model
- [create-transaction.use-case.ts](backend/src/application/use-cases/transactions/create-transaction.use-case.ts) - Create transaction logic
- [prisma-transaction.repository.ts](backend/src/infrastructure/persistence/prisma/repositories/prisma-transaction.repository.ts) - Data access
- [transactions.controller.ts](backend/src/infrastructure/http/controllers/transactions.controller.ts) - HTTP endpoint
- [transaction.module.ts](backend/src/infrastructure/modules/transaction.module.ts) - DI configuration

### Frontend Key Files
- [transaction.types.ts](frontend/src/modules/transactions/types/transaction.types.ts) - Type definitions
- [transaction.service.ts](frontend/src/modules/transactions/services/transaction.service.ts) - API client
- [use-transactions.ts](frontend/src/modules/transactions/hooks/use-transactions.ts) - Data fetching hook
- [transaction-form.tsx](frontend/src/modules/transactions/components/transaction-form.tsx) - Form component
- [transaction-list.tsx](frontend/src/modules/transactions/components/transaction-list.tsx) - List component
- [api-client.ts](frontend/src/shared/lib/api-client.ts) - HTTP client

---

**Author**: AI Assistant
**Date**: 2025-11-20
**Version**: 1.0
