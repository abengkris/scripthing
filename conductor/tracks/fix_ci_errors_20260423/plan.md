# Implementation Plan: Fix CI Type-Check Errors

## Phase 1: Core Infrastructure & Module Resolution
- [ ] Task: Conductor - Setup and Initial Analysis
    - [ ] Run `pnpm --filter backend exec prisma generate` to ensure the Prisma client is up-to-date.
    - [ ] Run `pnpm --filter backend exec tsc --noEmit` to get a fresh list of errors and confirm the impact of `prisma generate`.
- [ ] Task: Fix PrismaClient and Module Resolution
    - [ ] **Red:** Identify files still reporting `Module '"@prisma/client"' has no exported member 'PrismaClient'`.
    - [ ] **Green:** Update imports or `tsconfig.json` if necessary to correctly resolve `@prisma/client`.
    - [ ] **Refactor:** Ensure consistent import patterns for Prisma across the backend.
- [ ] Task: Fix `packages/shared` Import Issues
    - [ ] **Red:** Identify `rootDir` violations in `src/services/auth.service.ts`.
    - [ ] **Green:** Adjust `tsconfig.json` or move/symbolic link shared types to ensure they are within the `rootDir` or correctly referenced as a workspace package.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Core Infrastructure' (Protocol in workflow.md)

## Phase 2: Route & Service Logic
- [ ] Task: Fix Auth Route Type Mismatches
    - [ ] **Red:** Identify `TS2345` errors in `src/routes/auth.ts` related to `FastifyRequest` body typing.
    - [ ] **Green:** Explicitly define the `Body` type in the route handlers or adjust the generic interface to match Fastify's expectations.
- [ ] Task: Fix Error Middleware Properties
    - [ ] **Red:** Identify `TS2339` error in `src/middleware/error.middleware.ts` regarding the `errors` property.
    - [ ] **Green:** Update the `FastifyError` or `ZodError` type augmentation to include the `errors` property, or use a type guard.
- [ ] Task: Fix Script Route Missing Modules
    - [ ] **Red:** Identify `TS2307` errors in `src/routes/scripts.ts` for `../services/export.service`.
    - [ ] **Green:** Create the missing `export.service.ts` (even if as a stub) or fix the incorrect import path.
- [ ] Task: Fix AI and Settings Service Argument Types
    - [ ] **Red:** Identify `TS2345` errors in `src/services/ai/ai.service.ts` and `src/services/settings.service.ts`.
    - [ ] **Green:** Ensure arguments passed to functions (like API keys or model names) are strings and not empty objects.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Route & Service Logic' (Protocol in workflow.md)

## Phase 3: Tests & Final Cleanup
- [ ] Task: Fix Test File Type Errors
    - [ ] **Red:** Identify `TS2305` in `src/tests/db.test.ts`.
    - [ ] **Green:** Apply the same PrismaClient fix used in Phase 1 to the test files.
- [ ] Task: Resolve Unused Directives
    - [ ] **Red:** Identify `TS2578` (Unused `@ts-expect-error`) in `security_rotation.test.ts`.
    - [ ] **Green:** Remove the unnecessary directives or fix the underlying issue they were suppressing.
- [ ] Task: Final Type-Check Verification
    - [ ] **Red:** Run `pnpm -r run type-check`.
    - [ ] **Green:** Address any remaining sporadic TS errors.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Tests & Final Cleanup' (Protocol in workflow.md)
