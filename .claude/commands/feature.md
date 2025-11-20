---
description: Create a new frontend feature module following Feature-Sliced Design
argument-hint: "<feature-name>"
allowed-tools: ["bash", "read", "write", "glob", "grep"]
---

# Create Frontend Feature Module

Generate a complete feature module for **$1** following Feature-Sliced Design pattern.

## Structure to create:
```
modules/$1/
├── components/       # UI components
├── hooks/           # React Query hooks (use-$1.ts)
├── services/        # API service ($1.service.ts)
├── types/           # TypeScript types ($1.types.ts)
└── store/           # Zustand store (if needed)
```

## Requirements:
1. Create all component files with proper structure
2. React Query hook for server state management
3. API service with proper error handling
4. TypeScript types file
5. Export barrel file (index.ts)
6. Make ready for integration in app/ routes
7. Follow existing patterns from CLAUDE.md
8. Use Tailwind CSS and Shadcn/UI components

## Project Guidelines:
@CLAUDE.md

Generate the complete module structure with sample implementations.
