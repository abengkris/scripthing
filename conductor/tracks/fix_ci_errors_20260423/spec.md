# Specification: Fix CI Type-Check Errors

## Overview
This track aims to resolve all TypeScript type-checking errors in the `apps/backend` and `packages/shared` directories as reported in the CI run on 2026-04-22. These errors range from missing module exports (`PrismaClient`) and incorrect type assignments to module resolution issues across the monorepo.

## Functional Requirements
- **Core Infrastructure Fixes:**
  - Ensure `PrismaClient` is correctly exported and recognized by the backend.
  - Resolve module resolution issues, specifically for `@prisma/client` and shared packages.
  - Fix `rootDir` violations in `src/services/auth.service.ts` where files from `packages/shared` are being imported incorrectly.
- **Route & Service Logic Fixes:**
  - Fix type mismatches in `FastifyRequest` handlers within `src/routes/auth.ts`.
  - Resolve missing properties on error objects in `src/middleware/error.middleware.ts`.
  - Fix missing module errors for `../services/export.service` in `src/routes/scripts.ts`.
  - Correct invalid argument types (e.g., passing `{}` to a `string` parameter) in `ai.service.ts` and `settings.service.ts`.
- **Test File Cleanup:**
  - Fix `PrismaClient` errors in test files (`src/tests/db.test.ts`).
  - Resolve unused `@ts-expect-error` directives in `security_rotation.test.ts`.

## Non-Functional Requirements
- **Maintainability:** Ensure type definitions are accurate and follow the project's coding standards.
- **Performance:** Ensure that `tsc --noEmit` runs successfully and efficiently.

## Acceptance Criteria
- `pnpm -r run type-check` (or `tsc --noEmit` in the affected packages) passes without errors.
- The backend starts up successfully and all routes are functional.
- Tests pass after applying the fixes.

## Out of Scope
- Adding new features or changing existing functionality beyond what's required for type safety.
- Large-scale refactoring of the codebase.
