# Implementation Plan: Phase 9 - Distribution & CI/CD

## Phase 1: CI/CD Setup (GitHub Actions) [checkpoint: 5ba4e87]
- [x] Task: Create `.github/workflows/ci.yml` for automated quality checks 3662ec2
    - [x] Add step for `pnpm install` and cache setup
    - [x] Add step for `pnpm lint` (all workspaces)
    - [x] Add step for `pnpm typecheck` (all workspaces)
    - [x] Add step for `pnpm test` (unit/integration tests)
    - [x] Add step for `pnpm exec playwright test` (E2E tests)
    - [x] Add step for Docker build verification (build backend/frontend images)
- [x] Task: Conductor - User Manual Verification 'CI/CD Setup' (Protocol in workflow.md) 5ba4e87

## Phase 2: Deployment Scripting (VPS via SSH + Docker) 04ab02e
- [x] Task: Create `scripts/deploy.sh` for automated VPS deployment 7d7801d
    - [x] Implement pre-deploy database backup logic (copying `scripthing.db` to a timestamped backup)
    - [x] Implement logic to pull latest Docker images and restart services
    - [x] Implement Prisma migration step (`npx prisma migrate deploy`)
    - [x] Implement post-deploy health check (waiting for HTTP 200 on `/api/v1/auth/me`)
    - [x] Implement automated rollback logic (reverting to previous image/backup on failure)
- [x] Task: Create `.github/workflows/deploy.yml` for Continuous Deployment 7d7801d
    - [x] Add job to trigger `scripts/deploy.sh` via SSH on push to `main`
    - [x] Configure GitHub Secrets for `SSH_PRIVATE_KEY`, `VPS_HOST`, and `VPS_USER`
- [x] Task: Conductor - User Manual Verification 'Deployment Scripting' (Protocol in workflow.md) 04ab02e

## Phase 3: Final Documentation (CHANGELOG, README) 497d777
- [x] Task: Initialize `CHANGELOG.md` following SemVer 497d777
    - [x] Add initial release entry with description of features from Phases 1-8
- [x] Task: Draft final `README.md` with comprehensive self-hosting guide 497d777
    - [x] Add project overview, visuals, and badges (Build status, License, etc.)
    - [x] Add system requirements (Node.js, Docker, SQLite)
    - [x] Add detailed `.env` configuration guide
    - [x] Add step-by-step self-hosting instructions (manual vs. docker-compose)
    - [x] Add backup, restore, and troubleshooting procedures
    - [x] Add contribution and license sections
- [x] Task: Conductor - User Manual Verification 'Final Documentation' (Protocol in workflow.md) 497d777
