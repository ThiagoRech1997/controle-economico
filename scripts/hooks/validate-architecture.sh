#!/bin/bash

# Validate that backend follows Clean Architecture
echo "🔍 Checking backend Clean Architecture compliance..."

ERRORS=0

# Check if domain imports from infrastructure
echo "Checking domain layer dependencies..."
if grep -r "from.*infrastructure" backend/src/domain/ 2>/dev/null; then
  echo "❌ ERROR: Domain layer imports from infrastructure layer"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Domain layer is clean"
fi

# Check if domain imports from NestJS
echo "Checking domain framework dependencies..."
if grep -r "from.*@nestjs" backend/src/domain/ 2>/dev/null; then
  echo "❌ ERROR: Domain layer has NestJS dependencies"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Domain has no framework dependencies"
fi

# Check if application imports from infrastructure
echo "Checking application layer dependencies..."
if grep -r "from.*infrastructure" backend/src/application/ 2>/dev/null; then
  echo "❌ ERROR: Application layer imports from infrastructure layer"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Application layer is clean"
fi

# Frontend: Check for cross-module imports
echo ""
echo "🔍 Checking frontend Feature-Sliced Design compliance..."

if [ -d "frontend/src/modules" ]; then
  echo "Checking for cross-module imports..."
  cd frontend/src/modules
  for dir in */; do
    MODULE_NAME="${dir%/}"
    # Look for imports from other modules (but not from the same module)
    if grep -r "from.*@/modules/" "$dir" 2>/dev/null | grep -v "from.*@/modules/$MODULE_NAME" | grep -v "Binary file"; then
      echo "⚠️  WARNING: Module '$MODULE_NAME' may have cross-module imports"
      ERRORS=$((ERRORS + 1))
    fi
  done
  cd ../../..

  if [ $ERRORS -eq 0 ]; then
    echo "✅ No cross-module imports detected"
  fi
else
  echo "⚠️  Frontend modules directory not found, skipping frontend checks"
fi

# Summary
echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ Architecture validation passed!"
  exit 0
else
  echo "❌ Found $ERRORS architecture violation(s)"
  exit 1
fi
