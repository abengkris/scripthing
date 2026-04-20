# Specification: Core Foundation: Backend Setup

## Overview
This track focuses on establishing the core backend foundation for the Scripthing application, ensuring a robust, type-safe API structure using Fastify, Prisma, and SQLite.

## Functional Requirements
- Initialize Fastify server with structured routing.
- Set up Prisma ORM with SQLite database integration.
- Implement core services:
    - Auth Service (JWT registration/login)
    - Project Service (Project CRUD)
    - Script Service (Script CRUD)
    - Settings Service (API key/preferences)
- Establish shared data models:
    - User/Settings
    - Project/Script
    - Snapshot/History
- Implement robust error handling:
    - Standardized API error responses.
    - Zod validation middleware for request schemas.
    - Custom service-level error classes mapped to HTTP statuses.

## Non-Functional Requirements
- Adherence to the project-defined service architecture (logic in services, handlers for routing only).
- Type safety across the monorepo.

## Acceptance Criteria
- [ ] Fastify server is running.
- [ ] Prisma schema is initialized and migrations are functional.
- [ ] All four core services are implemented and tested.
- [ ] Global error middleware and Zod validation middleware are active.
- [ ] API routes are reachable and return expected responses.

## Out of Scope
- Integration with AI providers (this will be a future track).
- Frontend integration (this is backend-only foundation).
