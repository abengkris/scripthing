# Implementation Plan: Phase 6 - Security Hardening & DevOps

## Phase 1: Security Headers & Observability
- [x] Install `@fastify/helmet` and update backend dependencies. 42361aa
- [x] Register `fastify-helmet` in the Fastify app. a95fee3
- [x] Configure `pino` for structured, asynchronous logging. 86bf751
- [x] Implement privacy-filtering middleware to ensure no PII/secrets are logged. cffb333
- [ ] Conductor - User Manual Verification 'Security Headers & Observability' (Protocol in workflow.md)

## Phase 2: Graceful Key Rotation
- [x] Update key decryption utility to check `APP_SECRET` and fallback to `APP_SECRET_PREVIOUS`. 5f4c019
- [x] Implement lazy migration logic upon successful decryption with `APP_SECRET_PREVIOUS`. 92c98d3
- [ ] Add unit tests to simulate key rotation scenarios and data migration.
- [ ] Conductor - User Manual Verification 'Graceful Key Rotation' (Protocol in workflow.md)

## Phase 3: Backup & Deployment
- [ ] Implement production backup script (or configure Litestream).
- [ ] Verify backup integrity with a test restoration process.
- [ ] Update `docker-compose.yml` and environment variable documentation.
- [ ] Conductor - User Manual Verification 'Backup & Deployment' (Protocol in workflow.md)
