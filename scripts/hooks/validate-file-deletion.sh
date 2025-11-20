#!/bin/bash

# Prevent deletion of critical files
# This script is called by PreToolUse hooks

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.command // ""' 2>/dev/null)

if [ -z "$COMMAND" ]; then
  COMMAND="$INPUT"
fi

# Critical files that should never be deleted
CRITICAL_FILES=(
  ".env"
  ".env.local"
  ".env.production"
  "schema.prisma"
  "package.json"
  "package-lock.json"
  "tsconfig.json"
  "docker-compose.yml"
  "CLAUDE.md"
)

# Check if any critical files are being deleted
for file in "${CRITICAL_FILES[@]}"; do
  if echo "$COMMAND" | grep -q "rm.*$file"; then
    echo '{"decision": "deny", "reason": "Attempting to delete critical file: '"$file"'. This is not allowed for safety reasons."}'
    exit 2
  fi
done

# Allow deletion of other files
echo '{"decision": "allow"}'
exit 0
