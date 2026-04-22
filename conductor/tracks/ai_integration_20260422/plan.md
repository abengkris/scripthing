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
- [x] Task: Conductor - User Manual Verification 'AI Provider Infrastructure & Backend' (Protocol in workflow.md) [checkpoint: 3acec12]

## Phase 2: Frontend AI Integration (Frontend)
Focuses on the AI Sidebar, SSE streaming client, and interactive UI elements.

- [x] Task: SSE Client Implementation
    - [x] Integrate `@microsoft/fetch-event-source` into the API client
    - [x] Implement robust stream handling with error recovery
    - [x] Add "Stop Generation" support to the API client
- [x] Task: AI Sidebar UI Components
    - [x] Create AI Sidebar container (Fixed Side Panel)
    - [x] Implement chat interface for AI interactions
    - [x] Implement suggestion, rewrite, and analysis triggers
- [x] Task: Real-time UI Enhancements
    - [x] Implement real-time word/token count display during streaming
    - [x] Add Provider/Model badges to the generation UI
    - [x] Add "Stop Generation" button and state handling
- [x] Task: Conductor - User Manual Verification 'Frontend AI Integration' (Protocol in workflow.md) [checkpoint: 480e6e8]

## Phase 3: Testing, Security & Polish (E2E)
Focuses on integrated testing, security audits, and UI polish.

- [x] Task: Integration & Security Audit
    - [x] Verify E2E AI flow for all providers
    - [x] Perform security audit for API key handling
    - [x] Ensure privacy guidelines (no logging) are met
- [x] Task: UI Polish & Dark Mode Support
    - [x] Refine sidebar animations and layout
    - [x] Ensure full dark mode compatibility for the AI Sidebar
- [x] Task: Conductor - User Manual Verification 'Testing, Security & Polish' (Protocol in workflow.md) [checkpoint: bb7b20f]
