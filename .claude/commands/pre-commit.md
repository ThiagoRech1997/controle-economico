---
description: Run all validations before committing (tests, lint, type-check)
allowed-tools: ["bash"]
---

# Pre-commit Validation

Run comprehensive checks before commit:

## Backend Checks

!`cd backend && npm run lint 2>&1`
!`cd backend && npm run test 2>&1`

## Frontend Checks

!`cd frontend && npm run lint 2>&1`
!`cd frontend && npm run type-check 2>&1`

Please summarize the results and indicate if it's safe to commit. If there are any errors, provide suggestions for fixes.
