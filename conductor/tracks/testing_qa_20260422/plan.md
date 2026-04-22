# Implementation Plan: Phase 5 - Testing & QA

## Phase 1: Infrastructure Setup [checkpoint: 55d44b4]
- [x] Task: Configure Vitest in `apps/backend` 55d44b4
    - [x] Install dev dependencies
    - [x] Create `vitest.config.ts`
    - [x] Set up test environment and database mocks
- [x] Task: Configure Vitest in `apps/frontend` 55d44b4
    - [x] Install dev dependencies
    - [x] Create `vitest.config.ts`
    - [x] Set up React Testing Library and JSDOM
- [x] Task: Configure Playwright for E2E 55d44b4
    - [x] Install `@playwright/test`
    - [x] Initialize playwright config in project root or dedicated folder
    - [x] Create base page objects or helpers
- [x] Task: Conductor - User Manual Verification 'Infrastructure Setup' (Protocol in workflow.md) 55d44b4

## Phase 2: Backend Unit & Integration Tests [checkpoint: 9d283e9]
- [x] Task: Implement tests for Auth Service & Routes 9d283e9
    - [x] Write failing tests for login/register/refresh
    - [x] Ensure existing implementation passes
- [x] Task: Implement tests for Project & Script Services 9d283e9
    - [x] Write failing tests for CRUD operations
    - [x] Ensure existing implementation passes
- [x] Task: Implement tests for AI Service & Providers 9d283e9
    - [x] Write failing tests for each AI provider (OpenAI, Anthropic, Gemini, Ollama)
    - [x] Mock external API calls
- [x] Task: Conductor - User Manual Verification 'Backend Tests' (Protocol in workflow.md) 9d283e9

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
