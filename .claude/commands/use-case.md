---
description: Create a new NestJS use case following Clean Architecture pattern
argument-hint: "<feature-name> <use-case-name>"
allowed-tools: ["bash", "read", "write", "glob", "grep"]
---

# Create Backend Use Case

I need to generate a new use case for the **$1** feature called **$2** following the Clean Architecture pattern already defined in CLAUDE.md.

## Requirements:
1. Follow the exact pattern in CLAUDE.md - domain → application → infrastructure
2. Create all necessary files:
   - Domain entity (if new feature)
   - Domain repository interface
   - DTOs (input/output)
   - Use case in application layer
   - Repository implementation (Prisma)
   - NestJS controller
   - Module configuration
3. Use path aliases (@/ for src/)
4. Include proper TypeScript types
5. Add JSDoc comments
6. Make files ready for unit testing

## Current Architecture:
@CLAUDE.md

Please examine the backend structure and create the complete use case implementation following Clean Architecture principles.
