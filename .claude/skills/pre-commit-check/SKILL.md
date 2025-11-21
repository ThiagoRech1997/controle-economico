---
name: pre-commit-check
description: Comprehensive pre-commit validation including tests, linting, type-checking, and architecture compliance
---

# Pre-Commit Check Skill

## Overview

This skill runs a comprehensive suite of checks before committing code, ensuring quality, correctness, and architectural compliance. It's your safety net to catch issues before they reach the repository.

## When to Use

- Before every commit
- After implementing a new feature
- After refactoring
- Before creating a pull request
- When hook suggests it (automatic prompt on commit keywords)

## Prerequisites

- Git repository initialized
- Dependencies installed (`npm install` in both backend and frontend)
- Database running (for integration tests, optional)
- Changes staged or unstaged in working directory

## What This Skill Checks

### Backend Checks

1. **TypeScript Compilation** - Code compiles without errors
2. **Unit Tests** - All tests pass
3. **Test Coverage** - Coverage meets threshold (optional)
4. **Linting** - ESLint passes with auto-fix
5. **Formatting** - Prettier formatting applied
6. **Architecture** - Clean Architecture compliance
7. **Prisma Schema** - Schema is valid

### Frontend Checks

1. **TypeScript Compilation** - Code compiles without errors
2. **Unit Tests** - Component tests pass (if exist)
3. **Linting** - Next.js linter passes
4. **Formatting** - Prettier formatting applied
5. **Build** - Production build succeeds
6. **Module Isolation** - No cross-module imports

## Step-by-Step Workflow

### Step 1: Pre-Check Assessment

**Identify what changed:**

```bash
# Check git status
git status

# See what files changed
git diff --name-only

# Check if changes are staged
git diff --cached --name-only
```

**Determine scope:**
- Backend only? → Run backend checks
- Frontend only? → Run frontend checks
- Both? → Run full suite
- Prisma schema? → Include migration check

---

### Step 2: Backend Checks

#### Check 1: TypeScript Compilation

**Purpose:** Ensure code has no type errors

**Command:**
```bash
cd backend
npm run build
```

**Expected output:**
```
✓ Successfully compiled
```

**If fails:**
- Review TypeScript errors in output
- Fix type issues
- Re-run check

**Common issues:**
```typescript
// ❌ Bad
const user: User = await repository.find(id); // Returns User | null

// ✅ Good
const user = await repository.find(id);
if (!user) throw new NotFoundException();
```

---

#### Check 2: Unit Tests

**Purpose:** Ensure all tests pass

**Command:**
```bash
cd backend
npm run test
```

**Expected output:**
```
Test Suites: X passed, X total
Tests:       Y passed, Y total
```

**If fails:**
- Review failing test output
- Fix implementation or test
- Ensure no flaky tests

**Quick test run (only changed files):**
```bash
npm run test -- --onlyChanged
```

---

#### Check 3: Test Coverage (Optional)

**Purpose:** Maintain code coverage standards

**Command:**
```bash
cd backend
npm run test:cov
```

**Expected:**
- Statements: >80%
- Branches: >70%
- Functions: >80%
- Lines: >80%

**Coverage report location:**
```
backend/coverage/lcov-report/index.html
```

**If below threshold:**
- Add tests for uncovered code
- Focus on use cases and domain logic

---

#### Check 4: Linting

**Purpose:** Enforce code style and catch common errors

**Command:**
```bash
cd backend
npm run lint
```

**Expected output:**
```
✓ No linting errors
```

**Auto-fix available:**
```bash
npm run lint -- --fix
```

**Common linting issues:**
```typescript
// ❌ Unused imports
import { Unused } from './foo';

// ❌ Any type
function process(data: any) {}

// ❌ Console.log in production code
console.log('Debug:', data);

// ✅ Fixed
import { Used } from './foo';
function process(data: ProcessDto) {}
// Remove console.log or use logger
```

---

#### Check 5: Formatting

**Purpose:** Ensure consistent code formatting

**Command:**
```bash
cd backend
npm run format
```

**What it does:**
- Formats all `.ts` files with Prettier
- Applies consistent indentation, quotes, semicolons
- Fixes line length issues

**Verify formatting:**
```bash
npx prettier --check "src/**/*.ts"
```

---

#### Check 6: Architecture Compliance

**Purpose:** Validate Clean Architecture rules

**Command:**
```bash
cd backend

# Check domain has no external dependencies
grep -r "from '@nestjs\|from 'prisma\|from 'class-validator" src/domain/

# Should return nothing
```

**Manual checks:**
- [ ] Domain layer has zero framework imports
- [ ] Use cases inject repository interfaces (not implementations)
- [ ] Controllers are thin (no business logic)
- [ ] All DTOs have validation decorators

**Automated (if script exists):**
```bash
npm run arch:validate
```

---

#### Check 7: Prisma Schema Validation

**Purpose:** Ensure database schema is valid

**Command:**
```bash
cd backend
npx prisma validate
```

**Expected output:**
```
✓ The schema is valid
```

**If schema changed:**
```bash
# Format schema
npx prisma format

# Generate Prisma Client
npm run prisma:generate
```

**Check for pending migrations:**
```bash
npx prisma migrate status
```

---

### Step 3: Frontend Checks

#### Check 8: TypeScript Compilation

**Purpose:** Ensure code has no type errors

**Command:**
```bash
cd frontend
npm run type-check
# or
npm run build
```

**Expected output:**
```
✓ Type checking passed
```

**Common issues:**
```typescript
// ❌ Bad
const data = response.data; // any type

// ✅ Good
const data: GoalResponse = response.data;

// ❌ Bad
function Component({ user }) { // implicit any

// ✅ Good
interface Props {
  user: User;
}
function Component({ user }: Props) {
```

---

#### Check 9: Linting

**Purpose:** Enforce Next.js and React best practices

**Command:**
```bash
cd frontend
npm run lint
```

**Expected output:**
```
✓ No ESLint warnings or errors
```

**Auto-fix:**
```bash
npm run lint -- --fix
```

**Common Next.js linting issues:**
```typescript
// ❌ Missing alt text
<img src="/logo.png" />

// ✅ Fixed
<Image src="/logo.png" alt="Logo" width={100} height={100} />

// ❌ Missing key in list
{items.map(item => <div>{item.name}</div>)}

// ✅ Fixed
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

---

#### Check 10: Formatting

**Purpose:** Consistent code style

**Command:**
```bash
cd frontend
npm run format
```

**Verify:**
```bash
npx prettier --check "src/**/*.{ts,tsx}"
```

---

#### Check 11: Build

**Purpose:** Ensure production build succeeds

**Command:**
```bash
cd frontend
npm run build
```

**Expected output:**
```
✓ Compiled successfully
Route (app)                Size
┌ ○ /                      X kB
└ ○ /goals                 Y kB
```

**If fails:**
- Review build errors
- Check for missing dependencies
- Ensure environment variables are set

**Build size check:**
- Pages should be <500kB (warning)
- Shared chunks should be reasonably sized
- Use `npm run analyze` if available

---

#### Check 12: Module Isolation

**Purpose:** Ensure Feature-Sliced Design compliance

**Command:**
```bash
cd frontend

# Check for cross-module imports (should return nothing)
grep -r "from '@/modules/" src/modules/ | grep -v "from '@/modules/$(basename $(dirname $PWD))"
```

**Manual check:**
- [ ] No imports from `modules/other-feature`
- [ ] Shared code is in `shared/`
- [ ] Each module is self-contained

---

### Step 4: Integration Checks

#### Check 13: API Integration (Optional)

**Purpose:** Ensure frontend and backend are compatible

**Prerequisites:**
- Backend running on `localhost:3001`
- Database migrated and seeded

**Manual test:**
```bash
# Terminal 1: Start backend
cd backend && npm run start:dev

# Terminal 2: Start frontend
cd frontend && npm run dev

# Terminal 3: Test API
curl http://localhost:3001/api/v1/health
```

**Automated (if E2E tests exist):**
```bash
npm run test:e2e
```

---

### Step 5: Generate Check Report

**Create summary:**

```markdown
# Pre-Commit Check Report

**Date:** YYYY-MM-DD HH:MM
**Branch:** main
**Changed files:** X

## Backend ✅

- ✅ TypeScript compilation
- ✅ Unit tests (45/45 passed)
- ✅ Test coverage (85%)
- ✅ Linting (0 errors)
- ✅ Formatting (applied)
- ✅ Architecture compliance
- ✅ Prisma schema valid

## Frontend ✅

- ✅ TypeScript compilation
- ✅ Linting (0 errors)
- ✅ Formatting (applied)
- ✅ Build successful
- ✅ Module isolation

## Ready to Commit ✅

All checks passed. Safe to commit.
```

---

### Step 6: Commit

**If all checks pass:**

```bash
# Stage all changes
git add .

# Create commit with conventional format
git commit -m "feat: add goal forecasting feature

- Implement ForecastGoalAchievementUseCase
- Create goal forecast API endpoint
- Add forecast display in GoalDetail component
- Add unit tests with 90% coverage

Refs: #123"
```

**Commit message format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Adding tests
- `docs`: Documentation
- `chore`: Maintenance
- `style`: Formatting
- `perf`: Performance improvement

---

## Automated Script

**File:** `scripts/pre-commit.sh`

```bash
#!/bin/bash

set -e # Exit on first error

echo "🚀 Running pre-commit checks..."
echo ""

# Backend checks
echo "📦 Backend Checks"
echo "=================="

cd backend

echo "→ TypeScript compilation..."
npm run build > /dev/null 2>&1 && echo "✅ TypeScript" || (echo "❌ TypeScript failed" && exit 1)

echo "→ Running tests..."
npm run test > /dev/null 2>&1 && echo "✅ Tests" || (echo "❌ Tests failed" && exit 1)

echo "→ Linting..."
npm run lint > /dev/null 2>&1 && echo "✅ Linting" || (echo "❌ Linting failed" && exit 1)

echo "→ Formatting..."
npm run format > /dev/null 2>&1 && echo "✅ Formatting" || (echo "❌ Formatting failed" && exit 1)

echo "→ Validating Prisma schema..."
npx prisma validate > /dev/null 2>&1 && echo "✅ Prisma" || (echo "❌ Prisma invalid" && exit 1)

cd ..

# Frontend checks
echo ""
echo "🎨 Frontend Checks"
echo "=================="

cd frontend

echo "→ TypeScript compilation..."
npm run build > /dev/null 2>&1 && echo "✅ TypeScript" || (echo "❌ TypeScript failed" && exit 1)

echo "→ Linting..."
npm run lint > /dev/null 2>&1 && echo "✅ Linting" || (echo "❌ Linting failed" && exit 1)

echo "→ Formatting..."
npm run format > /dev/null 2>&1 && echo "✅ Formatting" || (echo "❌ Formatting failed" && exit 1)

cd ..

echo ""
echo "✅ All checks passed!"
echo ""
echo "📝 Ready to commit. Use:"
echo "   git commit -m \"<type>: <message>\""
```

**Make executable:**
```bash
chmod +x scripts/pre-commit.sh
```

**Run before commit:**
```bash
./scripts/pre-commit.sh
```

---

## Git Hooks Integration (Optional)

**Install husky:**

```bash
npm install -D husky
npx husky install
```

**Create pre-commit hook:**

```bash
npx husky add .husky/pre-commit "npm run pre-commit"
```

**Add to package.json:**

```json
{
  "scripts": {
    "pre-commit": "./scripts/pre-commit.sh"
  }
}
```

**Now hooks run automatically on `git commit`**

---

## Quick Mode (Fast Checks Only)

**For rapid iteration:**

```bash
# Backend quick check
cd backend
npm run lint && npm run test -- --onlyChanged

# Frontend quick check
cd frontend
npm run lint
```

**Skip certain checks:**
```bash
# Skip tests (not recommended)
SKIP_TESTS=1 ./scripts/pre-commit.sh

# Skip build (faster)
SKIP_BUILD=1 ./scripts/pre-commit.sh
```

---

## Troubleshooting

### Issue: Tests Failing Randomly

**Symptoms:** Tests pass/fail inconsistently

**Causes:**
- Async timing issues
- Shared test state
- Database state leaking between tests

**Fix:**
```typescript
// Ensure proper cleanup
afterEach(async () => {
  await cleanupDatabase();
});

// Use proper async/await
await expect(promise).resolves.toBe(value);
```

### Issue: Linting Too Strict

**Symptoms:** Too many linting errors for legacy code

**Fix:** Add exceptions to `.eslintrc.js`:
```javascript
rules: {
  '@typescript-eslint/no-explicit-any': 'warn', // Change from error
}
```

### Issue: Build Takes Too Long

**Symptoms:** `npm run build` is very slow

**Fix:**
```bash
# Use incremental builds (TypeScript)
# In tsconfig.json:
{
  "compilerOptions": {
    "incremental": true
  }
}

# Use SWC instead of Babel (Next.js)
# Automatic in Next.js 13+
```

### Issue: Coverage Below Threshold

**Symptoms:** Test coverage check fails

**Fix:**
```bash
# Identify uncovered code
npm run test:cov
# Open coverage/lcov-report/index.html

# Add tests for critical paths (use cases, domain logic)
# Skip coverage for trivial code (getters, simple DTOs)
```

---

## Success Criteria

✅ All TypeScript code compiles without errors
✅ All tests pass (100% pass rate)
✅ Test coverage meets threshold (80%+)
✅ Linting passes with zero errors
✅ Code is properly formatted
✅ Architecture rules are followed
✅ Prisma schema is valid
✅ Frontend builds successfully
✅ No cross-module imports in frontend

---

## Checklist

Copy this before committing:

```markdown
## Pre-Commit Checklist

### Backend
- [ ] TypeScript compiles
- [ ] Tests pass
- [ ] Coverage >80%
- [ ] Linting passes
- [ ] Code formatted
- [ ] Architecture validated
- [ ] Prisma schema valid
- [ ] No console.log in code
- [ ] No commented code

### Frontend
- [ ] TypeScript compiles
- [ ] Linting passes
- [ ] Code formatted
- [ ] Build succeeds
- [ ] No cross-module imports
- [ ] No hardcoded API URLs
- [ ] Environment variables documented

### Git
- [ ] Commit message follows convention
- [ ] Changes are atomic (single purpose)
- [ ] No secrets in code
- [ ] .env files not committed
```

---

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky - Git Hooks](https://typicode.github.io/husky/)
- [Jest - Testing](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

---

**Need help?** Ask Claude: "Run pre-commit checks" or "Prepare code for commit"
