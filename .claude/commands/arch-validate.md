---
description: Validate that code follows Clean Architecture and Feature-Sliced Design
allowed-tools: ["bash", "grep", "read"]
---

# Architecture Validation

Validate that the codebase follows the architectural patterns defined in CLAUDE.md.

## Backend (Clean Architecture)

Check domain layer dependencies:
!`cd backend/src/domain && grep -r "from.*infrastructure" . 2>&1 || echo "✓ Domain layer is clean"`

!`cd backend/src/domain && grep -r "from.*@nestjs" . 2>&1 || echo "✓ Domain has no framework dependencies"`

Check application layer dependencies:
!`cd backend/src/application && grep -r "from.*infrastructure" . 2>&1 || echo "✓ Application layer is clean"`

## Frontend (Feature-Sliced Design)

Check for cross-module imports:
!`cd frontend/src/modules && for dir in */; do grep -r "from.*modules/(?!$dir)" "$dir" 2>&1 || true; done`

## Architecture Guidelines:
@CLAUDE.md

Please analyze the results and report any violations of the architecture principles.
