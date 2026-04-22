# Specification: Phase 6 - Security Hardening & DevOps

## Overview
This track focuses on implementing critical security enhancements and operational stability improvements for the Scripthing backend.

## Functional Requirements
- Install and configure `@fastify/helmet` for essential HTTP security headers.
- Implement the APP_SECRET graceful key rotation logic using the lazy migration strategy as defined in `AGENTS.md`.
- Set up an automated backup solution for the production SQLite database (e.g., using Litestream or a cron-based backup script).
- Enhance server observability by integrating Pino for structured, asynchronous logging, ensuring compliance with privacy standards.

## Non-Functional Requirements
- Ensure no sensitive user data (prompts, completions, screenplay content) is logged.
- Maintain existing performance levels during logging and security header processing.

## Acceptance Criteria
- `@fastify/helmet` is active and verifying headers on all API requests.
- Graceful key rotation works: system correctly falls back to `APP_SECRET_PREVIOUS` and lazily re-encrypts data with `APP_SECRET`.
- Automated backups are confirmed and running on the host environment.
- Logs are structured, asynchronous, and do not contain restricted PII.

## Out of Scope
- Any UI/Frontend changes.
- Changes to authentication flow beyond key rotation logic.
