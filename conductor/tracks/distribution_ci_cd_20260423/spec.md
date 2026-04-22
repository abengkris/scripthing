# Specification: Phase 9 - Distribution & CI/CD

## Overview
Set up a robust CI/CD pipeline using GitHub Actions, develop a deployment script for VPS environments via SSH and Docker, and finalize project documentation (CHANGELOG.md, README.md) with self-hosting instructions.

## Functional Requirements

### 1. CI/CD Pipeline (GitHub Actions)
- Implement a workflow that performs:
  - Linting (using project's lint scripts).
  - Type checking (TypeScript).
  - Automated tests (Vitest/Playwright).
  - Docker build verification.
- Triggers:
  - Every pull request to `main`.
  - Every push to the `main` branch.
  - Manual execution via `workflow_dispatch`.

### 2. VPS Deployment Script
- A bash script (or GitHub Action step) to deploy the app via SSH + Docker.
- Deployment lifecycle:
  - **Pre-deploy:** Automated database backup (`scripthing.db`).
  - **Deploy:** Pull latest image, run Prisma migrations, and restart containers.
  - **Post-deploy:** Health check to verify the app is reachable.
  - **Rollback:** Automated rollback to the previous working state if health checks fail.

### 3. Documentation
- **CHANGELOG.md:** Implement a standardized changelog following Semantic Versioning (SemVer) principles.
- **README.md:** Draft a comprehensive guide including:
  - Project overview and visuals (badges, screenshots).
  - System requirements (OS, Docker version).
  - Detailed environment variable configuration (`.env` guide).
  - Self-hosting and deployment instructions.
  - Backup and restore procedures.
  - Troubleshooting common issues.
  - Contribution guidelines and License.

## Non-Functional Requirements
- **Security:** Use GitHub Secrets for all sensitive data (SSH keys, API keys, VPS credentials).
- **Efficiency:** Optimize Docker builds with layer caching.
- **Reliability:** Ensure 100% success on health checks before finalizing deployment.

## Acceptance Criteria
- GitHub Actions workflow passes all stages for a valid PR.
- Successful deployment to a target VPS results in a running application with migrated data.
- All documentation files exist and contain the required sections.

## Out of Scope
- Setting up a domain name or SSL (assumed to be handled by Nginx/Certbot on the host).
- Advanced infrastructure monitoring (e.g., Prometheus/Grafana).
