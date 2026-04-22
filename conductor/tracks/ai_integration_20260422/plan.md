# Implementation Plan - Phase 3: AI Integration

## Phase 1: AI Provider Infrastructure & Backend (Backend)
Focuses on the core AI provider logic, model support, and secure API key management.

- [x] Task: AI Security: Implement AES-256-GCM encryption for API keys
    - [x] Write unit tests for encryption/decryption utility
    - [x] Implement encryption/decryption using `APP_SECRET`
    - [x] Update `SettingsService` to encrypt/decrypt keys during save/load
- [x] Task: AI Provider Base Class and Model Definitions
    - [x] Define `BaseAIProvider` abstract class and common interfaces
    - [x] Define supported model configurations for OpenAI, Anthropic, Gemini, Ollama
- [x] Task: Concrete Provider Implementations
    - [x] Write tests for `OpenAIProvider`
    - [x] Implement `OpenAIProvider`
    - [x] Write tests for `AnthropicProvider`
    - [x] Implement `AnthropicProvider`
    - [x] Write tests for `GeminiProvider`
    - [x] Implement `GeminiProvider`
    - [x] Write tests for `OllamaProvider`
    - [x] Implement `OllamaProvider`
- [x] Task: AI Routing & SSE Middleware
    - [x] Implement AI controller with SSE support for `/ai/chat`
    - [x] Set up rate-limiting for AI endpoints
    - [x] Verify non-buffering SSE output in backend
- [ ] Task: Conductor - User Manual Verification 'AI Provider Infrastructure & Backend' (Protocol in workflow.md) [checkpoint: ]

## Phase 2: Frontend AI Integration (Frontend)
Focuses on the AI Sidebar, SSE streaming client, and interactive UI elements.

- [ ] Task: SSE Client Implementation
    - [ ] Integrate `@microsoft/fetch-event-source` into the API client
    - [ ] Implement robust stream handling with error recovery
    - [ ] Add "Stop Generation" support to the API client
- [ ] Task: AI Sidebar UI Components
    - [ ] Create AI Sidebar container (Fixed Side Panel)
    - [ ] Implement chat interface for AI interactions
    - [ ] Implement suggestion, rewrite, and analysis triggers
- [ ] Task: Real-time UI Enhancements
    - [ ] Implement real-time word/token count display during streaming
    - [ ] Add Provider/Model badges to the generation UI
    - [ ] Add "Stop Generation" button and state handling
- [ ] Task: Conductor - User Manual Verification 'Frontend AI Integration' (Protocol in workflow.md) [checkpoint: ]

## Phase 3: Testing, Security & Polish (E2E)
Focuses on integrated testing, security audits, and UI polish.

- [ ] Task: Integration & Security Audit
    - [ ] Verify E2E AI flow for all providers
    - [ ] Perform security audit for API key handling
    - [ ] Ensure privacy guidelines (no logging) are met
- [ ] Task: UI Polish & Dark Mode Support
    - [ ] Refine sidebar animations and layout
    - [ ] Ensure full dark mode compatibility for the AI Sidebar
- [ ] Task: Conductor - User Manual Verification 'Testing, Security & Polish' (Protocol in workflow.md) [checkpoint: ]
