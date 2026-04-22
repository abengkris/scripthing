# Specification: Phase 5 - Testing & QA

## Overview
Establish a robust testing infrastructure for the Scripthing application, covering unit, integration, and end-to-end (E2E) tests. The goal is to ensure high code quality, prevent regressions in critical paths, and achieve at least 80% code coverage.

## Functional Requirements
### 1. Unit & Integration Testing (Vitest)
- Set up Vitest for both `apps/backend` and `apps/frontend`.
- Write unit tests for backend services (Auth, Project, Script, Settings, AI).
- Write unit tests for AI providers (OpenAI, Anthropic, Gemini, Ollama) ensuring correct payload construction and error handling.
- Write integration tests for all API endpoints.
- Tests should be colocated with the code they test.

### 2. End-to-End Testing (Playwright)
- Set up Playwright in a separate `e2e/` directory.
- Implement robust tests for 4 critical paths:
    - **Editor Auto-Save & Offline Recovery**: Verify 2s debounce, offline state handling, and automatic retry upon reconnection.
    - **AI SSE Streaming**: Mock SSE responses and verify progressive rendering in the Tiptap editor.
    - **Tiptap Auto-Formatting**: Verify industry-standard formatting rules (e.g., \"INT.\" to Scene Heading, Enter to Action).
    - **Silent Token Refresh**: Verify automatic 401 handling and transparent token refresh/retry logic.
- Use `page.route` for API mocking/interception to isolate frontend tests.

## Non-Functional Requirements
- **Code Coverage**: Target ≥ 80% coverage for all modules.
- **Reliability**: Tests must be robust and non-flaky, especially E2E tests involving timing (debounce) and streaming.
- **Maintainability**: Use modular test design and clear architectural comments.

## Acceptance Criteria
- [ ] Vitest is configured and running in both apps.
- [ ] Playwright is configured and E2E tests for the 4 critical paths pass.
- [ ] Backend services have >80% coverage.
- [ ] AI provider integrations are fully tested (success and failure cases).
- [ ] Documentation updated with instructions on how to run tests.

## Out of Scope
- CI/CD integration (GitHub Actions) - will be handled in a later track.
- Performance testing/benchmarking.
