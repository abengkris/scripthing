# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-23
### Added
- **Core Foundation**: pnpm monorepo structure with Fastify (backend) and React (frontend).
- **Authentication**: JWT-based access/refresh token system with secure cookie handling.
- **Screenplay Editor**: Tiptap-based editor with industry-standard screenplay elements (Scene Heading, Action, Character, Dialogue, etc.).
- **Auto-save**: Debounced auto-save to local SQLite database with offline support.
- **AI Integration**: Support for OpenAI, Anthropic, Google Gemini, and Ollama (offline) for writing assistance.
- **AI Features**: Chat, suggestion, and rewrite capabilities with SSE streaming.
- **Export**: Professional PDF export (Puppeteer) and Final Draft .fdx export.
- **Security**: AES-256-GCM encryption for API keys, automated SQLite backups, and graceful secret rotation.
- **DevOps**: Docker and Docker Compose support for production deployment.
- **CI/CD**: GitHub Actions pipeline for linting, type-checking, testing, and automated VPS deployment via SSH.
- **UX**: Dark/Light mode, word/page count, keyboard shortcuts, and character appearance reports.
- **Performance**: Lazy loading and bundle optimization for long scripts.
- **Testing**: Comprehensive unit and integration test suite with Vitest and E2E tests with Playwright.
