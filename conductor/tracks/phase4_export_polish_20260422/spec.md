# Specification: Phase 4 - Export & Polish

## Overview
Implement advanced export features (PDF, FDX) for screenplays and set up the production infrastructure (Docker, Nginx).

## Functional Requirements
- **PDF Export:** Utilize Puppeteer for server-side rendering to ensure exact screenplay page margins.
- **FDX Export:** Implement export functionality to Final Draft .fdx format.
- **UI/UX:** Add a global Dark/Light mode toggle for the frontend.
- **Infrastructure:**
  - Create `docker-compose.yml` for multi-container production deployment.
  - Configure `nginx.conf` with necessary SSE settings.

## Acceptance Criteria
- PDF/FDX export works and generates valid, properly formatted files.
- Dark/Light mode toggle is functional and persists settings.
- Application can be deployed using `docker-compose up` and is accessible via Nginx.
- Nginx correctly handles SSE streaming for AI features.

## Out of Scope
- Automated UI testing (Playwright) will be handled in a separate track.
