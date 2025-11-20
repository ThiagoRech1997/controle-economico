#!/bin/bash

# Format TypeScript files after writing
# This script is called by PostToolUse hooks

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.outputPath // ""' 2>/dev/null)

if [ -z "$FILE" ]; then
  # If jq fails or no file path, try to get from stdin directly
  FILE="$INPUT"
fi

if [ ! -z "$FILE" ] && [ -f "$FILE" ]; then
  # Determine if it's frontend or backend based on path
  if [[ "$FILE" == *"frontend"* ]]; then
    echo "Formatting frontend file: $FILE"
    cd frontend
    npx prettier --write "$FILE" 2>/dev/null
    echo "✅ File formatted"
  elif [[ "$FILE" == *"backend"* ]]; then
    echo "Formatting backend file: $FILE"
    cd backend
    npx prettier --write "$FILE" 2>/dev/null
    npx eslint --fix "$FILE" 2>/dev/null || true
    echo "✅ File formatted and linted"
  else
    echo "⚠️  Unknown project location, skipping format"
  fi
fi

exit 0
