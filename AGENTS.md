# AGENTS.md — Scripthing
This document is the complete architecture guide for AI agents and developers working on this project. Read the entire document before making any changes.
## Table of Contents
 1. Project Overview
 2. Tech Stack
 3. Quick Start for Developers
 4. Monorepo Structure
 5. Database Schema
 6. API Endpoints
 7. API Contract
 8. Authentication Flow
 9. AI Provider Architecture
 10. Screenplay Editor
 11. Auto-Save Strategy
 12. Frontend Error Handling
 13. Security & Key Rotation
 14. Environment Variables
 15. Docker, Deployment & Backup
 16. Code Conventions & Logging
 17. Development Roadmap
## 1. Project Overview
**Scripthing** is a web-based screenplay writing application that runs locally or can be deployed to a VPS. Inspired by Final Draft, it adds optional AI features that users configure themselves using their own API keys.
### Core Principles
 * **Local-first**: All data is stored in a local SQLite database. No mandatory cloud dependency.
 * **AI optional**: AI features only activate when the user provides an API key. The app is fully functional without one.
 * **Multi-provider AI**: Supports OpenAI, Anthropic, Google Gemini, and Ollama (offline).
 * **Screenplay formatting**: The editor understands screenplay elements (Scene Heading, Action, Character, Dialogue, Parenthetical, Transition).
 * **Self-hostable**: Can be run via docker-compose on any VPS.
## 2. Tech Stack
### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool & dev server |
| TailwindCSS | 3.x | Styling |
| Tiptap | 2.x | Rich text / screenplay editor (ProseMirror-based) |
| Zustand | 4.x | Global state management |
| React Query | 5.x | Server state & API caching |
| React Router | 6.x | Client-side routing |
| shadcn/ui | latest | Component library (Radix UI + Tailwind, copied into repo) |
| Lucide React | latest | Icon set |
| @microsoft/fetch-event-source | latest | Robust SSE streaming consumption |
### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20.x LTS | Runtime |
| Fastify | 4.x | HTTP framework |
| TypeScript | 5.x | Type safety |
| Prisma | 5.x | ORM |
| SQLite | 3.x | Database (via better-sqlite3) |
| Zod | 3.x | Schema validation |
| Pino | latest | Asynchronous logging & observability |
| Puppeteer | latest | Server-side PDF rendering for exact page margins |
| JWT (jose) | 5.x | Stateless authentication |
| bcrypt | 5.x | Password hashing |
| @fastify/rate-limit | 9.x | Per-user rate limiting on AI endpoints |
| @fastify/cors | 9.x | CORS configuration |
| @fastify/cookie | 9.x | Cookie support for VPS deployments |
| @fastify/helmet | 11.x | HTTP security headers |
### AI Providers
| Provider | SDK | Default Model | Model Env Variable |
|---|---|---|---|
| OpenAI | openai npm | gpt-4o | OPENAI_DEFAULT_MODEL |
| Anthropic | @anthropic-ai/sdk npm | claude-sonnet-4-6 | ANTHROPIC_DEFAULT_MODEL |
| Google Gemini | @google/generative-ai npm | gemini-1.5-pro | GEMINI_DEFAULT_MODEL |
| Ollama | Direct REST API | user-selected model | — |
> **Note:** Default models are set via environment variables, not hardcoded, so they can be updated without a code change. See Section 14.
> 
### Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerization & orchestration |
| Nginx | Reverse proxy (for VPS) |
| pnpm workspaces | Monorepo package manager |
## 3. Quick Start for Developers
### Prerequisites
 * Node.js 20.x LTS
 * pnpm 9.x (npm install -g pnpm)
 * Docker & Docker Compose (optional, for containerized deployment)
### First-Time Setup
```bash
# 1. Clone and enter repo
git clone https://github.com/abengkris/scripthing.git && cd scripthing

# 2. Install all workspace dependencies
pnpm install

# 3. Copy environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. Edit apps/backend/.env — set APP_SECRET to any 32-char random string
#    Generate one with: openssl rand -hex 16

# 5. Run database migrations and seed dev data
pnpm --filter backend db:migrate
pnpm --filter backend db:seed

# 6. Start all services
pnpm dev
# → Frontend: http://localhost:5173
# → Backend:  http://localhost:3001

```
### Development Seed Data
Running pnpm --filter backend db:seed creates a ready-to-use demo account:
```
Email:    demo@scripthing.local
Password: demo1234

```
## 4. Monorepo Structure
*(Structure remains the same as the initial specification. Uses pnpm-workspace.yaml targeting apps/* and packages/*.)*
## 5. Database Schema (Prisma)
*(Schema remains identical to the original specification: User, Project, Script, Snapshot, and Settings models with proper indexing).*
## 6. API Endpoints
All endpoints are prefixed with /api/v1. Endpoints requiring authentication are marked 🔒.
### Auth
```
POST   /api/v1/auth/register    Register a new account
POST   /api/v1/auth/login       Login — returns access token + refresh token
POST   /api/v1/auth/refresh     Issue a new access token using refresh token
POST   /api/v1/auth/logout      Revoke refresh token and clear cookie
GET    /api/v1/auth/me      🔒  Get currently authenticated user

```
### Projects & Scripts
```
GET    /api/v1/projects         🔒  List all projects
POST   /api/v1/projects         🔒  Create a project
GET    /api/v1/projects/:id     🔒  Get project details
PUT    /api/v1/projects/:id     🔒  Update a project
DELETE /api/v1/projects/:id     🔒  Delete a project (cascades to scripts)

GET    /api/v1/projects/:projectId/scripts   🔒  List scripts in a project
POST   /api/v1/projects/:projectId/scripts   🔒  Create a script
GET    /api/v1/scripts/:id                   🔒  Get script with content
PUT    /api/v1/scripts/:id                   🔒  Update script content
DELETE /api/v1/scripts/:id                   🔒  Delete a script
POST   /api/v1/scripts/:id/snapshot          🔒  Save a manual snapshot
GET    /api/v1/scripts/:id/snapshots         🔒  List snapshot history
POST   /api/v1/scripts/:id/export/pdf        🔒  Export to PDF (via Puppeteer)
POST   /api/v1/scripts/:id/export/fdx        🔒  Export to Final Draft .fdx

```
### AI ⚡ (Rate limited — 20 req/min/user)
```
POST   /api/v1/ai/chat           🔒  Chat with AI about the script
POST   /api/v1/ai/suggest        🔒  Get a continuation suggestion
POST   /api/v1/ai/rewrite        🔒  Rewrite selected text
POST   /api/v1/ai/analyze        🔒  Analyze characters, structure, or plot
POST   /api/v1/ai/generate       🔒  Generate scene or dialogue from a prompt
POST   /api/v1/ai/providers/test 🔒  Test an API key connection
GET    /api/v1/ai/models         🔒  List available models per provider

```
### Settings
```
GET    /api/v1/settings      🔒  Get user settings (API keys as ****last4)
PUT    /api/v1/settings      🔒  Update settings

```
## 7. API Contract
*(Standard envelope { success: true, data: ... } and error handling remain identical to original. Zod schemas apply strict validation before controllers).*
## 8. Authentication Flow
### Token Strategy & Race Condition Prevention
Scripthing uses two tokens to balance security and UX: Access token (JWT, 15m) and Refresh token (JWT, 7d).
To prevent race conditions where multiple parallel requests fail simultaneously due to an expired token (causing multiple /auth/refresh calls), the frontend API client implements a **Promise queue (mutex)**.
```typescript
// apps/frontend/src/lib/api.ts
import { useAuthStore } from "../store/authStore";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string | null) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const { accessToken, refreshToken, setTokens, clearAuth } = useAuthStore.getState();

  // Initial fetch attempt omitted for brevity...
  
  if (res.status === 401 && refreshToken) {
    if (!isRefreshing) {
      isRefreshing = true;
      attemptTokenRefresh(refreshToken)
        .then(refreshed => {
          if (refreshed) {
            setTokens(refreshed.accessToken, refreshToken);
            processQueue(null, refreshed.accessToken);
          } else {
            processQueue(new Error("Session expired"), null);
            clearAuth();
            window.location.href = "/auth";
          }
        })
        .catch(err => {
          processQueue(err, null);
          clearAuth();
        })
        .finally(() => { isRefreshing = false; });
    }

    // Wait for the ongoing refresh to complete, then retry
    return new Promise<string | null>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(token => {
      if (!token) throw new APIError("UNAUTHORIZED", "Session expired");
      return request<T>(url, options); // retry with new token
    });
  }
  
  // Normal response parsing...
}

```
## 9. AI Provider Architecture
### SSE Streaming (Robust Handling)
When stream: true is sent to /ai/chat, the backend emits Server-Sent Events (SSE).
**Warning:** Do not manually parse chunks using split('\n\n') or native TextDecoder loops in the frontend. Network chunks can be fragmented mid-JSON string. Always use @microsoft/fetch-event-source.
**Frontend implementation:**
```typescript
import { fetchEventSource } from '@microsoft/fetch-event-source';

await fetchEventSource(`${import.meta.env.VITE_API_URL}/ai/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify(payload),
  onmessage(msg) {
    if (msg.data === '[DONE]') return;
    const parsed = JSON.parse(msg.data);
    appendToMessage(parsed.delta);
  },
  onerror(err) {
    throw err; // Stop retrying on error
  }
});

```
### System Prompt Directive
Prepended to every AI request:
> "You are a professional screenplay writing assistant. You understand industry-standard formatting. Always respond in the same language the user writes in. Do not provide lengthy explanations unless explicitly requested."
> 
## 10. Screenplay Editor (Tiptap)
*(Editor elements (Scene Heading, Action, Character, Dialogue) and auto-format rules (Enter/Tab behavior) remain identical to the original specification).*
## 11. Auto-Save Strategy
Auto-save is **debounced from the last keystroke (2 seconds)**. It uses an offline save queue (via Zustand) to retain unsaved changes if the network drops, retrying automatically when navigator.onLine fires or the window regains focus.
## 12. Frontend Error Handling
*(Global React Query error handler, Inline form validation mapping, and Toast notification mapping remain identical).*
## 13. Security & Key Rotation
### Environment Config Validation
Parsed strictly with Zod. Server will not boot if APP_SECRET is missing or < 32 chars.
### API Key Encryption & Graceful Key Rotation
API keys are encrypted with **AES-256-GCM** using APP_SECRET. Keys are never stored or returned in plaintext.
**Graceful Key Rotation Strategy (APP_SECRET):**
To rotate application secrets without downtime or manual scripts:
 1. Store the old key in a new environment variable APP_SECRET_PREVIOUS.
 2. Set the new key in APP_SECRET.
 3. **Decryption Logic:** The backend tries to decrypt using APP_SECRET. If it throws an auth tag error (decryption failure), it falls back to APP_SECRET_PREVIOUS.
 4. **Lazy Migration:** If decryption succeeds using the previous key, the backend immediately re-encrypts the data using the new APP_SECRET and saves it back to the database.
## 14. Environment Variables
```bash
# apps/backend/.env

DATABASE_URL="file:./data/scripthing.db"
PORT=3001
HOST=0.0.0.0
NODE_ENV=development

# Security
APP_SECRET="replace-with-a-random-32-character-string"
APP_SECRET_PREVIOUS="" # Used for graceful rotation
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

FRONTEND_URL="http://localhost:5173"

# Defaults
OPENAI_DEFAULT_MODEL="gpt-4o"
ANTHROPIC_DEFAULT_MODEL="claude-sonnet-4-6"
GEMINI_DEFAULT_MODEL="gemini-1.5-pro"
AI_RATE_LIMIT_RPM=20

```
## 15. Docker, Deployment & Backup
### SQLite Backup Strategy (Local-First)
Because SQLite stores data locally, automated backups are critical for VPS deployments to prevent data loss.
 1. **Host-level Cron:** Run a daily cron job on the host server:
   ```bash
   sqlite3 /path/to/data/scripthing.db ".backup '/path/to/backups/scripthing_$(date +%F).db'"
   
   ```
 2. **Real-time Replication:** Alternatively, configure **Litestream** inside the Docker composition to asynchronously stream WAL changes to an S3 bucket.
### Nginx Config for SSE
To ensure the AI typing effect is instant, disable buffering in Nginx.
```nginx
  # AI streaming — disable Nginx buffering for SSE
  location /api/v1/ai/ {
    proxy_pass http://backend;
    proxy_buffering           off;
    proxy_cache               off;
    chunked_transfer_encoding on;
    proxy_set_header Connection "";
  }

```
## 16. Code Conventions & Logging
### Standardized Logging & Observability
 * Use pino for backend logging to ensure fast, non-blocking asynchronous I/O.
 * **Audit Logs:** Log every AI provider failure including providerName, model, and upstream errorCode for debugging.
 * **Privacy Restriction:** It is **strictly forbidden** to log user prompts, AI completions, or screenplay contents to the system logs.
### General Conventions
 * **Files**: kebab-case.ts
 * **React Components**: PascalCase.tsx
 * **Functions / variables**: camelCase
 * **Commit Messages**: Follow Conventional Commits (feat:, fix:, chore:, refactor:).
## 17. Development Roadmap
```
Phase 1 — Core Foundation
  [ ] Monorepo setup (pnpm workspaces, Fastify, React, Vite)
  [ ] Authentication: register, login, JWT access + refresh tokens
  [ ] Error middleware & Zod schema validation
  [ ] CRUD: Projects & Scripts
  [ ] Rate limiting plugin

Phase 2 — Editor
  [ ] Tiptap integration with ProseMirror history plugin
  [ ] Custom extensions & Auto-format rules
  [ ] Debounced auto-save & Offline queue handling

Phase 3 — AI Integration
  [ ] Settings page: AES-256-GCM encryption for API keys
  [ ] Multi-provider setup (OpenAI, Anthropic, Gemini, Ollama)
  [ ] AI Sidebar: chat, suggest, rewrite, analyze, generate
  [ ] Robust SSE streaming using fetch-event-source

Phase 4 — Export & Polish
  [ ] Export to PDF (Puppeteer-based for exact margin control)
  [ ] Export to FDX (Final Draft format)
  [ ] Dark / Light mode toggle
  [ ] Nginx config & Docker production setup

Phase 5 — Testing & QA
  [ ] Unit tests & Integration tests (Vitest, Playwright)
  [ ] Coverage report (target: ≥ 80%)

Phase 6 — Security Hardening & DevOps
  [ ] HTTP security headers (@fastify/helmet)
  [ ] APP_SECRET graceful key rotation strategy (lazy migration)
  [ ] Automated SQLite backups (Litestream/Cron)
  [ ] Pino structured logging & privacy audit

Phase 7 — Performance
  [ ] Lazy loading & Virtual scrolling for long scripts
  [ ] Prisma query audit & Vite bundle optimization

Phase 8 — UX & Feature Polish
  [ ] Real-time Word/Page count in status bar
  [ ] Character appearance report
  [ ] Find & replace
  [ ] Keyboard shortcut reference panel

Phase 9 — Distribution & CI/CD
  [ ] GitHub Actions CI/CD pipeline
  [ ] User documentation & Self-hosting landing page

```
*This document must be updated whenever a significant architectural change is made.*
