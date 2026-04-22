# Implementation Plan: Phase 5 - Testing & QA

## Phase 1: Infrastructure Setup
- [ ] Task: Configure Vitest in `apps/backend`
    - [ ] Install dev dependencies
    - [ ] Create `vitest.config.ts`
    - [ ] Set up test environment and database mocks
- [ ] Task: Configure Vitest in `apps/frontend`
    - [ ] Install dev dependencies
    - [ ] Create `vitest.config.ts`
    - [ ] Set up React Testing Library and JSDOM
- [ ] Task: Configure Playwright for E2E
    - [ ] Install `@playwright/test`
    - [ ] Initialize playwright config in project root or dedicated folder
    - [ ] Create base page objects or helpers
- [ ] Task: Conductor - User Manual Verification 'Infrastructure Setup' (Protocol in workflow.md)

## Phase 2: Backend Unit & Integration Tests
- [ ] Task: Implement tests for Auth Service & Routes
    - [ ] Write failing tests for login/register/refresh
    - [ ] Ensure existing implementation passes
- [ ] Task: Implement tests for Project & Script Services
    - [ ] Write failing tests for CRUD operations
    - [ ] Ensure existing implementation passes
- [ ] Task: Implement tests for AI Service & Providers
    - [ ] Write failing tests for each AI provider (OpenAI, Anthropic, Gemini, Ollama)
    - [ ] Mock external API calls
- [ ] Task: Conductor - User Manual Verification 'Backend Tests' (Protocol in workflow.md)

## Phase 3: Frontend Unit & Integration Tests
- [ ] Task: Implement tests for Global Store (Zustand)
    - [ ] Test auth state, project state, and auto-save queue
- [ ] Task: Implement tests for API Client & Interceptors
    - [ ] Test 401 interceptor and refresh logic
- [ ] Task: Implement tests for Editor Components
    - [ ] Test Tiptap custom extensions in isolation
- [ ] Task: Conductor - User Manual Verification 'Frontend Tests' (Protocol in workflow.md)

## Phase 4: Playwright E2E Tests
- [ ] Task: Critical Path 1 - Editor Auto-Save & Offline Recovery
    - [ ] Implement test script with 2s debounce validation
    - [ ] Implement network failure/recovery simulation
- [ ] Task: Critical Path 2 - AI SSE Streaming
    - [ ] Implement test script with SSE mocking
    - [ ] Validate progressive UI rendering
- [ ] Task: Critical Path 3 - Tiptap Auto-Formatting
    - [ ] Implement test script for scene headings and action transitions
- [ ] Task: Critical Path 4 - Silent Token Refresh
    - [ ] Implement test script for 401 -> refresh -> retry flow
- [ ] Task: Conductor - User Manual Verification 'E2E Tests' (Protocol in workflow.md)

## Phase 5: Finalization & Coverage
- [ ] Task: Generate and Audit Coverage Report
    - [ ] Run coverage for both apps
    - [ ] Identify gaps and add tests to reach >80%
- [ ] Task: Document Testing Workflow
    - [ ] Update READMEs with test commands and conventions
- [ ] Task: Conductor - User Manual Verification 'Finalization' (Protocol in workflow.md)
