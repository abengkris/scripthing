# Track Specification: Phase 3 - AI Integration

## Overview
Implement the multi-provider AI architecture and frontend integration for the Scripthing application. This phase focuses on building a robust, extensible backend for AI interactions and a responsive AI Sidebar on the frontend using SSE streaming for real-time feedback.

## Functional Requirements
- **Multi-Provider Backend:**
  - Implement `BaseAIProvider` abstract class to standardize provider interactions.
  - Implement concrete providers for:
    - OpenAI (GPT-4o, GPT-4o-mini)
    - Anthropic (Claude 3.5 Sonnet, Claude 3 Haiku)
    - Google Gemini (Gemini 1.5 Pro, Gemini 1.5 Flash)
    - Ollama (Local integration at http://localhost:11434)
  - Support for streaming and non-streaming responses.
- **Security:**
  - Encrypt all user-provided API keys using AES-256-GCM before database persistence.
  - Securely manage encryption keys via environment variables (`APP_SECRET`).
- **Frontend Integration:**
  - **AI Sidebar:** A fixed side panel integrated into the editor layout.
  - **SSE Streaming:** Implementation of robust real-time streaming using `@microsoft/fetch-event-source`.
  - **Interactive Elements:**
    - Real-time word/token count display.
    - Provider and model badges during generation.
    - "Stop Generation" functionality to abort active streams.
- **Core AI Features:**
  - Chat with AI about the script.
  - Request continuation suggestions.
  - Rewrite selected text.
  - Analyze script structure and characters.

## Non-Functional Requirements
- **Performance:** Low latency for AI interactions; SSE ensures instant visual feedback.
- **Extensibility:** Easy to add new AI providers by extending `BaseAIProvider`.
- **Privacy:** Strict adherence to logging policies (never log prompt content or keys).

## Acceptance Criteria
- [ ] Users can successfully save and test API keys for all supported providers.
- [ ] API keys are confirmed to be encrypted in the SQLite database.
- [ ] The AI Sidebar correctly triggers and displays streaming responses from multiple providers.
- [ ] "Stop Generation" successfully halts the network request and visual stream.
- [ ] Switching between different models (e.g., Flash vs. Pro) works seamlessly.

## Out of Scope
- Implementation of complex multi-turn memory beyond simple context windows for this phase.
- Advanced prompt engineering templates (beyond basic system prompts).
