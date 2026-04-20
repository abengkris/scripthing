# Implementation Plan: Backend Foundation

## Phase 1: Database & Schema Foundation
- [x] Task: Initialize Prisma and SQLite configuration (SKIPPED: Architecture incompatibility, see TODO in base.service.ts) [7c0a9b1]
- [ ] Task: Conductor - User Manual Verification 'Database & Schema Foundation' (Protocol in workflow.md)

## Phase 2: Core Infrastructure & Error Handling
- [ ] Task: Setup Fastify app bootstrap
    - [ ] Create `app.ts` factory
    - [ ] Setup standardized error middleware
    - [ ] Setup Zod validation middleware
- [ ] Task: Setup custom error classes
    - [ ] Implement AppError base class and specific error types
- [ ] Task: Conductor - User Manual Verification 'Core Infrastructure & Error Handling' (Protocol in workflow.md)

## Phase 3: Service Layer Implementation
- [ ] Task: Implement Auth Service
    - [ ] Add JWT handling and password hashing
    - [ ] Create auth routes (register, login)
- [ ] Task: Implement Project Service
    - [ ] Create project CRUD routes
- [ ] Task: Implement Script Service
    - [ ] Create script CRUD and snapshot management routes
- [ ] Task: Implement Settings Service
    - [ ] Create settings GET/PUT routes
- [ ] Task: Conductor - User Manual Verification 'Service Layer Implementation' (Protocol in workflow.md)
