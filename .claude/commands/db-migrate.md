---
description: Create and apply database migrations
argument-hint: "<migration-name>"
allowed-tools: ["bash", "read"]
---

# Database Migration Helper

Create a new Prisma migration named: **$ARGUMENTS**

## Steps:
1. Validate current schema
2. Create migration
3. Apply to development database
4. Generate Prisma client

## Execute:

Validate schema:
!`cd backend && npx prisma validate 2>&1`

Current schema:
@backend/prisma/schema.prisma

Create migration:
!`cd backend && npx prisma migrate dev --name "$ARGUMENTS" 2>&1`

Generate Prisma client:
!`cd backend && npx prisma generate 2>&1`

**Done!** Review the migration SQL file in `backend/prisma/migrations/`
