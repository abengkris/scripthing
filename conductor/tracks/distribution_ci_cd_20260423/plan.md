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

## Phase 2: Deployment Scripting (VPS via SSH + Docker)
- [ ] Task: Create `scripts/deploy.sh` for automated VPS deployment
    - [ ] Implement pre-deploy database backup logic (copying `scripthing.db` to a timestamped backup)
    - [ ] Implement logic to pull latest Docker images and restart services
    - [ ] Implement Prisma migration step (`npx prisma migrate deploy`)
    - [ ] Implement post-deploy health check (waiting for HTTP 200 on `/api/v1/auth/me`)
    - [ ] Implement automated rollback logic (reverting to previous image/backup on failure)
- [ ] Task: Create `.github/workflows/deploy.yml` for Continuous Deployment
    - [ ] Add job to trigger `scripts/deploy.sh` via SSH on push to `main`
    - [ ] Configure GitHub Secrets for `SSH_PRIVATE_KEY`, `VPS_HOST`, and `VPS_USER`
- [ ] Task: Conductor - User Manual Verification 'Deployment Scripting' (Protocol in workflow.md)

## Phase 3: Final Documentation (CHANGELOG, README)
- [ ] Task: Initialize `CHANGELOG.md` following SemVer
    - [ ] Add initial release entry with description of features from Phases 1-8
- [ ] Task: Draft final `README.md` with comprehensive self-hosting guide
    - [ ] Add project overview, visuals, and badges (Build status, License, etc.)
    - [ ] Add system requirements (Node.js, Docker, SQLite)
    - [ ] Add detailed `.env` configuration guide
    - [ ] Add step-by-step self-hosting instructions (manual vs. docker-compose)
    - [ ] Add backup, restore, and troubleshooting procedures
    - [ ] Add contribution and license sections
- [ ] Task: Conductor - User Manual Verification 'Final Documentation' (Protocol in workflow.md)
