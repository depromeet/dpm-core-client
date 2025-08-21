# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Development
yarn dev                    # Start all apps in development mode
yarn workspace @dpm-core/admin dev     # Admin app (port 3001)
yarn workspace @dpm-core/client dev    # Client app (port 3000)

# Build & Quality
yarn build                  # Build all packages
yarn lint                   # Lint with Biome
yarn format                 # Format with Biome

# Package Management
yarn create-package         # Interactive package creation CLI
yarn clean                  # Clean build cache
```

### Testing & Type Checking
```bash
turbo type-check           # Run TypeScript type checking
# Note: No test framework is currently configured
```

## Architecture Overview

### Monorepo Structure
This is a **Turborepo-based Next.js monorepo** with two main applications and shared packages:

- **apps/admin/** - Admin dashboard (Next.js 15, React 19, port 3001)
- **apps/client/** - Client application (Next.js 15, React 19, port 3000)
- **packages/shared/** - Shared UI components and utilities (@dpm-core/shared)
- **packages/api/** - HTTP client and API utilities (@dpm-core/api)

### Key Technical Details

#### Package Dependencies
```json
// App package.json dependencies
{
  "@dpm-core/shared": "workspace:*",
  "@dpm-core/api": "workspace:*"
}
```

#### Next.js Configuration
Both apps require `transpilePackages` configuration for the shared package:
```typescript
// apps/*/next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: ['@dpm-core/shared'],
};
```

#### Shared Package Structure
The `@dpm-core/shared` package exports:
- UI components (Button, Avatar, Card, Drawer, etc.)
- Utilities (cn, date helpers, logger)
- Icons and constants
- Form validators

### Authentication & Data Management
- **Authentication**: Better Auth (session-based)
- **Data Fetching**: React Query (@tanstack/react-query)
- **HTTP Client**: ky (in @dpm-core/api package)
- **State Management**: Zustand for local state

### UI & Styling
- **CSS Framework**: Tailwind CSS 4.x with custom configuration
- **UI Components**: Radix UI primitives
- **Animations**: Motion.js
- **Icons**: Lucide React
- **Code Style**: Biome (formatters and linters)

## Development Guidelines

### TypeScript & React
- Use functional and declarative programming patterns
- Prefer interfaces over types
- Avoid enums; use const maps instead
- Prefix event handlers with 'handle' (handleClick, handleSubmit)
- Use descriptive names with auxiliary verbs (isLoading, hasError)
- Favor React Server Components (RSC) where possible
- Minimize 'use client' directives

### Component Development
- Use 'use client' directive when necessary for client-side interactivity
- Build components using Radix UI primitives
- Apply Tailwind CSS for styling
- Use cn() utility for conditional class names
- Structure: exports, subcomponents, helpers, types

### Code Quality
- Line width: 100 characters
- Indentation: tabs
- Quote style: single quotes
- Trailing commas: always
- Semicolons: always

### Package Management
- Use `yarn create-package` CLI for creating new packages
- Reference shared packages with `workspace:*` notation
- Maintain proper workspace dependencies

## Important Configuration Files

- **turbo.json** - Turborepo task configuration and caching
- **biome.json** - Code formatting and linting rules
- **package.json** - Root workspace configuration
- **.cursor/rules/** - Development rules and conventions

## Common Issues & Solutions

### Build Issues
```bash
# Clean build cache and reinstall
yarn clean
rm -rf node_modules yarn.lock
yarn install
```

### Dependency Issues
```bash
# Check dependency tree
yarn why package-name
yarn workspaces info
```

### 'use client' Directive Issues
Ensure `transpilePackages: ['@dpm-core/shared']` is configured in Next.js apps.