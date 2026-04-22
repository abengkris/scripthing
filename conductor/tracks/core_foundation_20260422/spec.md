# Specification: Phase 1 - Core Foundation

## Overview
This track implements the core foundation for the Scripthing application. It scaffolds a pnpm monorepo structure, sets up the backend server using Fastify, Prisma, and SQLite, and establishes the frontend API client. Crucially, it implements the authentication flow (register, login, refresh, logout) and the frontend token refresh mechanism using a Promise queue/mutex.

## Functional Requirements
1. **Monorepo Setup:**
   - Establish a pnpm monorepo with `apps/frontend`, `apps/backend`, and `packages/shared`.
2. **Backend Foundation:**
   - Configure a Fastify server with structured routing.
   - Implement Zod schema validation for environment configurations.
   - Integrate Prisma ORM with a SQLite database.
   - Create a database seed script for the demo user (`demo@scripthing.local`).
3. **Authentication Endpoints:**
   - `POST /api/v1/auth/register`
   - `POST /api/v1/auth/login` (Returns access token + refresh token)
   - `POST /api/v1/auth/refresh`
   - `POST /api/v1/auth/logout`
4. **Frontend API Client:**
   - Implement the API interceptor in a standalone module (`lib/api.ts`).
   - Include a Promise queue/mutex mechanism to handle token refresh gracefully and prevent race conditions.

## Non-Functional Requirements
- Strictly follow the Fastify and Prisma architecture described in `AGENTS.md`.
- Implement robust error handling mapped to standard API contracts.

## Acceptance Criteria
- [ ] Monorepo commands (e.g., `pnpm dev`, `pnpm install`) work from the root and correctly manage dependencies.
- [ ] The Fastify server starts successfully with a verified environment configuration (using Zod).
- [ ] Running Prisma migrations and the seed script successfully populates the SQLite database with the demo user.
- [ ] The authentication endpoints successfully register users, log them in, and refresh their tokens.
- [ ] The frontend API client automatically intercepts 401 errors, refreshes the token using the mutex, and replays failed requests without the user noticing.

## Out of Scope
- UI Styling (Tailwind/shadcn setup).
- Dockerfile and deployment configurations.
- API rate limiting setup (`fastify/rate-limit`).