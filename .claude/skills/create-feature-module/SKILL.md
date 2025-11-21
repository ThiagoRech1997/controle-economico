---
name: create-feature-module
description: Guided workflow to create a frontend feature module following Feature-Sliced Design with types, services, React Query hooks, and components
---

# Create Feature Module Skill

## Overview

This skill guides you through creating a complete frontend feature module following Feature-Sliced Design principles. It creates all necessary files from types to components with proper separation of concerns.

## When to Use

- You're building a new frontend feature or page
- You need to integrate with backend APIs
- You want step-by-step guidance following Feature-Sliced Design
- You're new to the project and want to learn the patterns

## Prerequisites

- Frontend development environment set up
- Backend API endpoints exist (or you're planning them)
- Understanding of the feature you're building

## What This Skill Creates

1. **Types Layer**
   - TypeScript interfaces for domain models
   - API response/request types

2. **Services Layer**
   - API client functions
   - HTTP communication logic

3. **Hooks Layer**
   - React Query hooks (queries and mutations)
   - Data fetching and caching

4. **Components Layer**
   - Feature-specific UI components
   - Presentational and container components

5. **Page Integration**
   - Next.js App Router page
   - Server/Client component architecture

## Step-by-Step Workflow

### Step 1: Feature Discovery

**Questions to answer:**

1. **What feature are you building?**
   - Examples: "transactions", "goals", "dashboard"
   - This will be your module folder name

2. **What data does this feature manage?**
   - What entities/models are involved?
   - What backend endpoints exist?

3. **What operations are needed?**
   - Create, Read, Update, Delete?
   - Custom operations (e.g., forecast, export)?

4. **What pages/routes are needed?**
   - List view? Detail view? Form?
   - URL structure: `/feature`, `/feature/[id]`, `/feature/new`?

**Example Answers:**
```
Feature: goals
Data: Goal entity (id, name, targetAmount, currentValue, deadline)
Operations: CRUD + forecast achievement
Pages: /goals (list), /goals/[id] (detail), /goals/new (create)
```

---

### Step 2: Define Types

**Domain Model:**

What is the core entity structure?

Example for Goal:
```typescript
interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentValue: number;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**API Types:**

What does the API send/receive?

Example:
```typescript
// Request (create)
interface CreateGoalDto {
  name: string;
  targetAmount: number;
  currentValue?: number;
  deadline: Date;
}

// Request (update)
interface UpdateGoalDto {
  name?: string;
  targetAmount?: number;
  currentValue?: number;
  deadline?: Date;
}

// Response
interface GoalResponse {
  id: string;
  name: string;
  targetAmount: number;
  currentValue: number;
  deadline: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}
```

---

### Step 3: Design Service API

**What API calls are needed?**

Example for Goal service:
```
GET    /api/v1/goals          → getGoals()
GET    /api/v1/goals/:id      → getGoalById(id)
POST   /api/v1/goals          → createGoal(data)
PUT    /api/v1/goals/:id      → updateGoal(id, data)
DELETE /api/v1/goals/:id      → deleteGoal(id)
GET    /api/v1/goals/:id/forecast → forecastGoal(id)
```

**Error handling strategy:**
- Use axios for HTTP client
- Throw errors for React Query to catch
- Include proper TypeScript types

---

### Step 4: Plan React Query Hooks

**Queries (data fetching):**
```
useGoals()           → List all goals
useGoal(id)          → Get single goal
useGoalForecast(id)  → Get forecast data
```

**Mutations (data modification):**
```
useCreateGoal()      → Create new goal
useUpdateGoal()      → Update existing goal
useDeleteGoal()      → Delete goal
```

**Cache invalidation strategy:**
- After create → invalidate goals list
- After update → invalidate goal detail + list
- After delete → invalidate goals list

---

### Step 5: Design Components

**Component hierarchy:**

Example for Goals feature:
```
GoalsPage (page component)
├── GoalList (container)
│   ├── GoalCard (presentational)
│   └── GoalCardSkeleton (loading state)
├── GoalDetail (container)
│   ├── GoalHeader
│   ├── GoalProgress
│   └── GoalForecast
└── GoalForm (form)
    ├── FormFields
    └── SubmitButton
```

**State management:**
- Server state: React Query (from hooks)
- Local UI state: useState/useReducer
- Global state: Zustand (only if truly global)

---

### Step 6: Implementation

Now I'll create all the files:

#### 6.1 Types

**File:** `frontend/src/modules/goals/types/goal.types.ts`

```typescript
export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentValue: number;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalDto {
  name: string;
  targetAmount: number;
  currentValue?: number;
  deadline: Date;
}

export interface UpdateGoalDto {
  name?: string;
  targetAmount?: number;
  currentValue?: number;
  deadline?: Date;
}

export interface GoalResponse {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentValue: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalForecastResponse {
  goalId: string;
  estimatedAchievementDate: string | null;
  monthsRemaining: number | null;
  averageMonthlySurplus: number;
  isAchievable: boolean;
  message: string;
}
```

#### 6.2 Service

**File:** `frontend/src/modules/goals/services/goal.service.ts`

```typescript
import axios from 'axios';
import type {
  Goal,
  GoalResponse,
  CreateGoalDto,
  UpdateGoalDto,
  GoalForecastResponse,
} from '../types/goal.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const GOALS_ENDPOINT = `${API_BASE}/api/v1/goals`;

// Helper to convert API response to domain model
function mapGoalResponse(response: GoalResponse): Goal {
  return {
    ...response,
    deadline: new Date(response.deadline),
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}

export const goalService = {
  async getGoals(): Promise<Goal[]> {
    const { data } = await axios.get<GoalResponse[]>(GOALS_ENDPOINT);
    return data.map(mapGoalResponse);
  },

  async getGoalById(id: string): Promise<Goal> {
    const { data } = await axios.get<GoalResponse>(`${GOALS_ENDPOINT}/${id}`);
    return mapGoalResponse(data);
  },

  async createGoal(dto: CreateGoalDto): Promise<Goal> {
    const { data } = await axios.post<GoalResponse>(GOALS_ENDPOINT, {
      ...dto,
      deadline: dto.deadline.toISOString(),
    });
    return mapGoalResponse(data);
  },

  async updateGoal(id: string, dto: UpdateGoalDto): Promise<Goal> {
    const { data } = await axios.put<GoalResponse>(`${GOALS_ENDPOINT}/${id}`, {
      ...dto,
      deadline: dto.deadline?.toISOString(),
    });
    return mapGoalResponse(data);
  },

  async deleteGoal(id: string): Promise<void> {
    await axios.delete(`${GOALS_ENDPOINT}/${id}`);
  },

  async forecastGoal(id: string): Promise<GoalForecastResponse> {
    const { data } = await axios.get<GoalForecastResponse>(
      `${GOALS_ENDPOINT}/${id}/forecast`
    );
    return data;
  },
};
```

#### 6.3 React Query Hooks

**File:** `frontend/src/modules/goals/hooks/use-goals.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService } from '../services/goal.service';
import type { CreateGoalDto, UpdateGoalDto } from '../types/goal.types';

const QUERY_KEYS = {
  goals: ['goals'] as const,
  goal: (id: string) => ['goals', id] as const,
  forecast: (id: string) => ['goals', id, 'forecast'] as const,
};

export function useGoals() {
  return useQuery({
    queryKey: QUERY_KEYS.goals,
    queryFn: goalService.getGoals,
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.goal(id),
    queryFn: () => goalService.getGoalById(id),
    enabled: !!id,
  });
}

export function useGoalForecast(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.forecast(id),
    queryFn: () => goalService.forecastGoal(id),
    enabled: !!id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateGoalDto) => goalService.createGoal(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalDto }) =>
      goalService.updateGoal(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goal(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.forecast(id) });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals });
    },
  });
}
```

#### 6.4 Components

**File:** `frontend/src/modules/goals/components/goal-list.tsx`

```typescript
'use client';

import { useGoals } from '../hooks/use-goals';
import { GoalCard } from './goal-card';
import { GoalCardSkeleton } from './goal-card-skeleton';

export function GoalList() {
  const { data: goals, isLoading, error } = useGoals();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <GoalCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading goals: {error.message}</p>
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No goals found. Create your first goal!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
```

**File:** `frontend/src/modules/goals/components/goal-card.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Button } from '@/shared/components/ui/button';
import type { Goal } from '../types/goal.types';

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const progress = (goal.currentValue / goal.targetAmount) * 100;
  const daysRemaining = Math.ceil(
    (goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current</span>
            <span className="font-medium">
              R$ {goal.currentValue.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target</span>
            <span className="font-medium">
              R$ {goal.targetAmount.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Days remaining</span>
            <span className={daysRemaining < 30 ? 'text-red-500' : ''}>
              {daysRemaining} days
            </span>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href={`/goals/${goal.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

**File:** `frontend/src/modules/goals/components/goal-form.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useCreateGoal, useUpdateGoal } from '../hooks/use-goals';
import type { Goal } from '../types/goal.types';

const goalSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  targetAmount: z.number().positive('Target must be positive'),
  currentValue: z.number().min(0).optional(),
  deadline: z.date(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalFormProps {
  goal?: Goal;
  onSuccess?: () => void;
}

export function GoalForm({ goal, onSuccess }: GoalFormProps) {
  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: goal?.name || '',
      targetAmount: goal?.targetAmount || 0,
      currentValue: goal?.currentValue || 0,
      deadline: goal?.deadline || new Date(),
    },
  });

  const onSubmit = async (data: GoalFormData) => {
    try {
      if (goal) {
        await updateMutation.mutateAsync({ id: goal.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save goal:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Emergency Fund" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Amount (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="10000.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Value (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value.toISOString().split('T')[0]}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {goal ? 'Update Goal' : 'Create Goal'}
        </Button>
      </form>
    </Form>
  );
}
```

#### 6.5 Page Integration

**File:** `frontend/src/app/goals/page.tsx`

```typescript
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { GoalList } from '@/modules/goals/components/goal-list';
import { GoalCardSkeleton } from '@/modules/goals/components/goal-card-skeleton';

export default function GoalsPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground">
            Track your savings goals and forecast achievement dates
          </p>
        </div>
        <Button asChild>
          <Link href="/goals/new">Create Goal</Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <GoalCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <GoalList />
      </Suspense>
    </div>
  );
}
```

---

### Step 7: Environment Configuration

**Add to `frontend/.env.local`:**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### Step 8: Provider Setup (if not done)

**Ensure React Query provider is configured:**

**File:** `frontend/src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Update `frontend/src/app/layout.tsx`:**

```typescript
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## Success Criteria

✅ Module follows Feature-Sliced Design structure
✅ Types are properly defined with TypeScript
✅ Service handles API communication cleanly
✅ React Query hooks manage server state
✅ Components use Shadcn/UI components
✅ Forms use React Hook Form + Zod validation
✅ Loading and error states handled
✅ Cache invalidation configured correctly
✅ No cross-module imports (only shared/)

---

## Next Steps

1. Test the module manually with backend running
2. Add error boundaries for better UX
3. Add loading skeletons for better perceived performance
4. Consider adding optimistic updates for mutations
5. Add E2E tests with Playwright if needed

---

## Common Patterns

### For List + Detail Pages

```
modules/<feature>/
├── components/
│   ├── <feature>-list.tsx       # List view
│   ├── <feature>-card.tsx       # Card component
│   ├── <feature>-detail.tsx     # Detail view
│   └── <feature>-form.tsx       # Create/Edit form
└── hooks/
    └── use-<feature>s.ts        # All React Query hooks
```

### For Dashboard Widgets

```
modules/dashboard/
├── components/
│   ├── dashboard-layout.tsx
│   ├── transaction-summary.tsx
│   ├── goal-progress.tsx
│   └── account-balances.tsx
└── hooks/
    └── use-dashboard-data.ts    # Aggregate multiple queries
```

### For Forms with Multi-Step

```
modules/<feature>/
├── components/
│   ├── <feature>-form/
│   │   ├── step-1-basic-info.tsx
│   │   ├── step-2-details.tsx
│   │   ├── step-3-review.tsx
│   │   └── form-wizard.tsx
```

---

## Troubleshooting

**Issue:** "Cannot find module '@/shared/...'"
- Solution: Check tsconfig.json has path aliases configured
- Ensure `"@/*": ["./src/*"]` is in paths

**Issue:** "React Query hooks not working"
- Solution: Ensure Providers wrapper is in layout.tsx
- Check QueryClientProvider is configured

**Issue:** "API calls failing with CORS"
- Solution: Verify backend CORS allows frontend origin
- Check NEXT_PUBLIC_API_URL is correct

**Issue:** "Module importing from another module"
- Solution: Move shared code to `shared/`
- Never import from `modules/<other-feature>/`

---

## Resources

- **Templates:** See `.claude/patterns.md`
- **Examples:** See `modules/transactions/` for reference
- **React Query:** [TanStack Query Docs](https://tanstack.com/query/latest)
- **Shadcn/UI:** [Component Docs](https://ui.shadcn.com)

---

**Need help?** Ask Claude: "Guide me through creating a feature module for X"
