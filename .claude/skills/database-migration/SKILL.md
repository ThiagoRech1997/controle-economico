---
name: database-migration
description: Safe database migration workflow using Prisma with validation, backup, and rollback procedures
---

# Database Migration Skill

## Overview

This skill guides you through creating and executing database migrations safely using Prisma. It includes validation, backup procedures, and rollback strategies to prevent data loss.

## When to Use

- Adding new tables to the database
- Modifying existing table structure
- Adding/removing columns
- Changing data types
- Adding indexes or constraints
- Refactoring database schema

## Prerequisites

- Prisma CLI installed
- Database running and accessible
- Prisma schema file exists (`backend/prisma/schema.prisma`)
- Database connection string in `.env`
- Git repository (for version control)

## What This Skill Covers

1. **Schema Design** - Designing the database change
2. **Schema Validation** - Ensuring Prisma schema is valid
3. **Migration Creation** - Generating migration SQL
4. **Migration Review** - Reviewing generated SQL
5. **Backup** - Creating database backup (production)
6. **Migration Execution** - Applying migration
7. **Verification** - Testing the changes
8. **Rollback** - Reverting if needed

## Step-by-Step Workflow

### Step 1: Identify Migration Need

**Questions to answer:**

1. **What database change is needed?**
   - Adding new entity/table?
   - Modifying existing table?
   - Adding relationship?
   - Performance optimization (indexes)?

2. **Is this a breaking change?**
   - Will existing data be affected?
   - Will existing queries break?
   - Do we need data migration?

3. **What environment?**
   - Development only?
   - Staging?
   - Production?

**Example Answers:**
```
Change: Add Payment table with relationship to User
Breaking: No, new table only
Environment: Development → Staging → Production
```

---

### Step 2: Update Prisma Schema

**Open schema file:**

**File:** `backend/prisma/schema.prisma`

**Example: Adding new model**

```prisma
// Before migration
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// After: Add Payment model
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String
  payments  Payment[] // New relationship
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Payment {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  amount      Decimal  @db.Decimal(18, 2)
  currency    String   @default("BRL")
  status      String   // pending, completed, failed
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

**Example: Modifying existing model**

```prisma
// Before
model Transaction {
  id          String   @id @default(uuid())
  description String
  amount      Decimal  @db.Decimal(18, 2)
}

// After: Add new fields
model Transaction {
  id          String   @id @default(uuid())
  description String
  amount      Decimal  @db.Decimal(18, 2)
  isPaid      Boolean  @default(false) // New field
  paidAt      DateTime? // New optional field

  @@index([isPaid]) // New index
}
```

---

### Step 3: Validate Schema

**Run validation:**

```bash
cd backend
npx prisma validate
```

**Expected output:**
```
✓ The schema is valid
```

**If validation fails:**

Common errors:
```prisma
// ❌ Missing relation field
model Payment {
  userId String
  // Missing: user User @relation(...)
}

// ❌ Invalid type
model Payment {
  amount Number // Should be Decimal, Float, or Int
}

// ❌ Missing unique constraint on relation
model User {
  profile Profile // Missing @unique for 1:1
}
```

**Format schema:**
```bash
npx prisma format
```

---

### Step 4: Create Migration

**Development environment:**

```bash
cd backend
npx prisma migrate dev --name add-payment-table
```

**What this does:**
1. Generates SQL migration file
2. Applies migration to database
3. Regenerates Prisma Client

**Migration naming conventions:**
```bash
# Good names (descriptive, imperative)
npx prisma migrate dev --name add-payment-table
npx prisma migrate dev --name add-ispaid-to-transactions
npx prisma migrate dev --name create-user-payment-relation
npx prisma migrate dev --name add-index-on-transaction-date

# Bad names (vague, unclear)
npx prisma migrate dev --name update
npx prisma migrate dev --name fix
npx prisma migrate dev --name changes
```

**Output:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQL Server database "mydb"

Applying migration `20251120120000_add_payment_table`

The following migration(s) have been created and applied:

prisma/migrations/
  └─ 20251120120000_add_payment_table/
    └─ migration.sql

✓ Generated Prisma Client
```

---

### Step 5: Review Migration SQL

**Open generated migration file:**

**File:** `backend/prisma/migrations/YYYYMMDDHHMMSS_migration_name/migration.sql`

**Example migration:**

```sql
-- CreateTable
CREATE TABLE [dbo].[Payment] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [amount] DECIMAL(18,2) NOT NULL,
    [currency] NVARCHAR(1000) NOT NULL CONSTRAINT [Payment_currency_df] DEFAULT 'BRL',
    [status] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Payment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Payment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Payment_userId_idx] ON [dbo].[Payment]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Payment_status_idx] ON [dbo].[Payment]([status]);

-- AddForeignKey
ALTER TABLE [dbo].[Payment]
ADD CONSTRAINT [Payment_userId_fkey]
FOREIGN KEY ([userId])
REFERENCES [dbo].[User]([id])
ON DELETE CASCADE
ON UPDATE CASCADE;
```

**Review checklist:**

- [ ] Table names are correct
- [ ] Column types are appropriate (Decimal for money, DateTime for dates)
- [ ] Indexes are created where needed
- [ ] Foreign keys have proper cascade behavior
- [ ] Default values are correct
- [ ] Constraints are appropriate

**Common issues to check:**

```sql
-- ⚠️ Check: Data type precision
DECIMAL(18,2)  -- ✅ Good for money (2 decimal places)
DECIMAL(10,0)  -- ❌ Bad for money (no decimals)

-- ⚠️ Check: Cascade behavior
ON DELETE CASCADE  -- ✅ Good for owned entities (Payment belongs to User)
ON DELETE RESTRICT -- ✅ Good for references (Transaction → Category)
ON DELETE SET NULL -- ⚠️  Consider if nullable makes sense

-- ⚠️ Check: Nullable vs NOT NULL
[email] NVARCHAR(1000) NOT NULL  -- ✅ Required field
[middleName] NVARCHAR(1000)      -- ✅ Optional field (no NOT NULL)
```

---

### Step 6: Backup Database (Production Only)

**CRITICAL: Before running migration on production, create backup**

**SQL Server backup:**

```sql
-- Manual backup via SQL Server Management Studio
-- Right-click database → Tasks → Back Up...

-- Or via T-SQL
BACKUP DATABASE [YourDatabaseName]
TO DISK = 'C:\Backups\YourDatabase_20251120.bak'
WITH FORMAT,
     NAME = 'Full Backup Before Migration',
     COMPRESSION;
```

**Alternative: Export via Prisma**

```bash
# Export data to JSON (small databases only)
npx prisma db pull
npx ts-node scripts/export-data.ts
```

**Verify backup:**
- Check file exists
- Verify file size is reasonable
- Test restore on dev environment (optional but recommended)

**Store backup securely:**
- Move to backup server
- Upload to cloud storage (AWS S3, Azure Blob)
- Keep for at least 30 days

---

### Step 7: Execute Migration

**Development:**

Already applied by `prisma migrate dev` in Step 4.

**Production:**

```bash
cd backend

# Review pending migrations
npx prisma migrate status

# Apply migrations
npx prisma migrate deploy
```

**Expected output:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQL Server database "prod-db"

1 migration found in prisma/migrations

Applying migration `20251120120000_add_payment_table`

The following migration has been applied:

migrations/
  └─ 20251120120000_add_payment_table/
    └─ migration.sql

✓ All migrations have been successfully applied.
```

**Monitor execution:**
- Watch for errors
- Note execution time
- Check database logs

---

### Step 8: Verify Migration

**Check 1: Database structure**

```bash
# Using Prisma Studio
npx prisma studio

# Or SQL query
```

**SQL Server:**
```sql
-- Check table exists
SELECT * FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'Payment';

-- Check columns
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Payment';

-- Check indexes
EXEC sp_helpindex 'Payment';

-- Check foreign keys
EXEC sp_fkey 'Payment';
```

**Check 2: Prisma Client**

Regenerate and test:

```bash
npm run prisma:generate
```

**Test in code:**

```typescript
// Test basic CRUD
const payment = await prisma.payment.create({
  data: {
    userId: 'user-123',
    amount: 100.50,
    currency: 'BRL',
    status: 'pending',
  },
});

console.log('✅ Created payment:', payment.id);

const found = await prisma.payment.findUnique({
  where: { id: payment.id },
  include: { user: true },
});

console.log('✅ Retrieved payment with user:', found);
```

**Check 3: Application Tests**

```bash
# Run tests to ensure nothing broke
npm run test

# Run integration tests if available
npm run test:e2e
```

---

### Step 9: Update Application Code

**Generate Prisma Client:**

```bash
npm run prisma:generate
```

**Update TypeScript types:**

Prisma Client is now aware of new models:

```typescript
// Now available
import { Payment } from '@prisma/client';

// Type-safe queries
const payments: Payment[] = await prisma.payment.findMany();
```

**Create repository implementation (if needed):**

Follow [create-use-case skill](#) to create:
- Domain entity
- Repository interface
- Repository implementation
- Use cases
- Controller

---

### Step 10: Rollback (If Needed)

**If migration fails or causes issues:**

**Option 1: Revert migration (Development only)**

```bash
# Mark migration as rolled back
npx prisma migrate resolve --rolled-back 20251120120000_add_payment_table

# Or reset database (⚠️ DATA LOSS)
npx prisma migrate reset
```

**Option 2: Create reverse migration**

```prisma
// In schema.prisma: Remove the changes
// Then create new migration

npx prisma migrate dev --name revert-payment-table
```

**Option 3: Restore from backup (Production)**

```sql
-- SQL Server restore
RESTORE DATABASE [YourDatabaseName]
FROM DISK = 'C:\Backups\YourDatabase_20251120.bak'
WITH REPLACE;
```

**Option 4: Write manual rollback SQL**

```sql
-- Reverse of migration
DROP TABLE [dbo].[Payment];
-- Revert other changes...
```

---

## Migration Patterns

### Pattern 1: Adding Nullable Column

**Safe for production:**

```prisma
model User {
  id        String   @id
  email     String
  phoneNumber String? // New optional field
}
```

**Migration:**
```sql
ALTER TABLE [User] ADD [phoneNumber] NVARCHAR(1000);
```

**No data migration needed.**

---

### Pattern 2: Adding Non-Nullable Column with Default

**Safe for production:**

```prisma
model User {
  id        String   @id
  email     String
  isActive  Boolean  @default(true) // New required field with default
}
```

**Migration:**
```sql
ALTER TABLE [User] ADD [isActive] BIT NOT NULL DEFAULT 1;
```

**Existing rows get default value automatically.**

---

### Pattern 3: Adding Non-Nullable Column without Default

**⚠️ Requires data migration:**

```prisma
model User {
  id        String   @id
  email     String
  role      String   // New required field, no default
}
```

**Two-step migration:**

**Step 1: Add as nullable**
```prisma
model User {
  role String?
}
```

**Step 2: Populate data**
```typescript
await prisma.user.updateMany({
  where: { role: null },
  data: { role: 'USER' },
});
```

**Step 3: Make non-nullable**
```prisma
model User {
  role String // Now required
}
```

---

### Pattern 4: Renaming Column

**⚠️ Can cause data loss - use two-step process:**

**Step 1: Add new column, copy data**
```sql
-- Add new column
ALTER TABLE [User] ADD [fullName] NVARCHAR(1000);

-- Copy data
UPDATE [User] SET [fullName] = [name];
```

**Step 2: Drop old column (after deployment)**
```sql
ALTER TABLE [User] DROP COLUMN [name];
```

---

### Pattern 5: Changing Data Type

**⚠️ Dangerous - backup first:**

```prisma
// Before
model Transaction {
  amount Int
}

// After
model Transaction {
  amount Decimal @db.Decimal(18,2)
}
```

**Migration involves data conversion:**
```sql
ALTER TABLE [Transaction]
ALTER COLUMN [amount] DECIMAL(18,2);
```

**Test thoroughly before production.**

---

## Migration Checklist

### Before Migration

- [ ] Schema is valid (`npx prisma validate`)
- [ ] Migration name is descriptive
- [ ] Reviewed generated SQL
- [ ] Backup created (production)
- [ ] Team is notified (production)
- [ ] Maintenance window scheduled (production, if needed)

### During Migration

- [ ] Monitoring in place
- [ ] Database logs being watched
- [ ] Application health checked

### After Migration

- [ ] Database structure verified
- [ ] Prisma Client regenerated
- [ ] Application tests pass
- [ ] Manual testing performed
- [ ] Documentation updated
- [ ] Migration committed to Git

---

## Troubleshooting

### Issue: Migration Fails with Foreign Key Error

**Error:**
```
Foreign key constraint failed
```

**Cause:** Referenced data doesn't exist

**Fix:**
```sql
-- Check orphaned records
SELECT * FROM [Payment]
WHERE [userId] NOT IN (SELECT [id] FROM [User]);

-- Clean up or fix data before migration
```

### Issue: Migration Takes Too Long

**Cause:** Large table, complex operation

**Fix:**
```sql
-- Add index in separate migration (concurrent)
CREATE INDEX CONCURRENTLY [index_name] ON [table]([column]);

-- Or run during maintenance window
```

### Issue: Migration Applied but Prisma Client Not Updated

**Symptoms:** TypeScript errors, missing types

**Fix:**
```bash
npm run prisma:generate
# Restart TypeScript server in IDE
```

### Issue: Cannot Rollback Migration

**Symptoms:** `migrate resolve` doesn't work

**Fix:**
```bash
# Manual: Delete migration from _prisma_migrations table
# Then drop created tables/columns manually
```

---

## Production Migration Best Practices

### 1. Test in Staging First

```bash
# Staging environment
DATABASE_URL="staging-connection-string" npx prisma migrate deploy
```

### 2. Use Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
- name: Run Migrations
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### 3. Monitor After Deployment

```bash
# Watch logs
tail -f /var/log/app.log

# Check error rate
# Monitor database CPU/memory
```

### 4. Have Rollback Plan

**Document:**
- How to revert migration
- Backup restore procedure
- Emergency contacts

---

## Success Criteria

✅ Prisma schema is valid
✅ Migration SQL reviewed and approved
✅ Backup created (production)
✅ Migration applied successfully
✅ Database structure verified
✅ Prisma Client regenerated
✅ Application tests pass
✅ No data loss
✅ Performance is acceptable
✅ Migration committed to Git

---

## Resources

- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [SQL Server Data Types](https://learn.microsoft.com/en-us/sql/t-sql/data-types/data-types-transact-sql)
- [Database Migration Best Practices](https://www.prisma.io/dataguide/types/relational/migration-strategies)

---

**Need help?** Ask Claude: "Guide me through creating a migration for X" or "Help me migrate the database safely"
