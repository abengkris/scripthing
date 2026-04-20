# AGENTS.md — Scripthing

This document is the complete architecture guide for AI agents and developers working on this project. Read the entire document before making any changes.

---

## 1. Project Overview

**Scripthing** is a web-based screenplay writing application that runs locally or can be deployed to a VPS. Inspired by Final Draft, it adds optional AI features that users configure themselves using their own API keys.

### Core Principles
- **Local-first**: All data is stored in a local SQLite database. No mandatory cloud dependency.
- **AI optional**: AI features only activate when the user provides an API key. The app is fully functional without one.
- **Multi-provider AI**: Supports OpenAI, Anthropic, Google Gemini, and Ollama (offline).
- **Screenplay formatting**: The editor understands screenplay elements (Scene Heading, Action, Character, Dialogue, Parenthetical, Transition).
- **Self-hostable**: Can be run via `docker-compose` on any VPS.

---

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
| Radix UI | latest | Headless UI components |
| Lucide React | latest | Icon set |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20.x LTS | Runtime |
| Fastify | 4.x | HTTP framework |
| TypeScript | 5.x | Type safety |
| Prisma | 5.x | ORM |
| SQLite | 3.x | Database (via better-sqlite3) |
| Zod | 3.x | Schema validation |
| JWT (jose) | 5.x | Stateless authentication |
| bcrypt | 5.x | Password hashing |

### AI Providers
| Provider | SDK | Default Model |
|---|---|---|
| OpenAI | `openai` npm | `gpt-4o` |
| Anthropic | `@anthropic-ai/sdk` npm | `claude-sonnet-4-5` |
| Google Gemini | `@google/gen-ai` npm | `gemini-3.1-flash-lite-preview` |
| Ollama | Direct REST API | user-selected model |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerization & orchestration |
| Nginx | Reverse proxy (for VPS) |
| pnpm workspaces | Monorepo package manager |

---

## 3. Monorepo Structure

```
scriptwriter-app/
├── AGENTS.md                  # This document
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # Workspace definition
├── docker-compose.yml         # VPS deployment
├── docker-compose.dev.yml     # Local development
├── .env.example               # Example environment variables
│
├── apps/
│   ├── frontend/              # React app (Vite)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── routes/        # Pages / route definitions
│   │   │   │   ├── index.tsx          # Dashboard / project list
│   │   │   │   ├── editor.$id.tsx     # Screenplay editor
│   │   │   │   ├── settings.tsx       # Settings & API keys
│   │   │   │   └── auth.tsx           # Login / register
│   │   │   ├── components/    # Shared UI components
│   │   │   │   ├── ui/                # Radix-based primitives
│   │   │   │   ├── layout/            # Sidebar, Topbar, Shell
│   │   │   │   └── screenplay/        # Editor-specific components
│   │   │   ├── editor/        # Tiptap editor & extensions
│   │   │   │   ├── extensions/        # Custom Tiptap extensions
│   │   │   │   │   ├── SceneHeading.ts
│   │   │   │   │   ├── Action.ts
│   │   │   │   │   ├── Character.ts
│   │   │   │   │   ├── Dialogue.ts
│   │   │   │   │   ├── Parenthetical.ts
│   │   │   │   │   └── Transition.ts
│   │   │   │   ├── ScreenplayEditor.tsx
│   │   │   │   └── toolbar/
│   │   │   ├── ai/            # AI sidebar & hooks
│   │   │   │   ├── AISidebar.tsx
│   │   │   │   ├── AIChat.tsx
│   │   │   │   ├── AISuggestion.tsx
│   │   │   │   └── hooks/
│   │   │   │       ├── useAIChat.ts
│   │   │   │       └── useAISuggest.ts
│   │   │   ├── settings/      # App settings
│   │   │   │   ├── APIKeyManager.tsx
│   │   │   │   ├── ProviderSelector.tsx
│   │   │   │   └── ModelSelector.tsx
│   │   │   ├── store/         # Zustand stores
│   │   │   │   ├── authStore.ts
│   │   │   │   ├── editorStore.ts
│   │   │   │   ├── projectStore.ts
│   │   │   │   └── settingsStore.ts
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── lib/           # Utilities & API client
│   │   │   │   ├── api.ts             # Axios/fetch wrapper
│   │   │   │   ├── export.ts          # PDF & FDX export
│   │   │   │   └── screenplay.ts      # Format helpers
│   │   │   └── types/         # Shared TypeScript types
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── tailwind.config.ts
│   │
│   └── backend/               # Fastify API
│       ├── src/
│       │   ├── main.ts                # Entry point & server bootstrap
│       │   ├── app.ts                 # Fastify app factory
│       │   ├── config.ts              # Environment config (zod-validated)
│       │   ├── routes/                # HTTP route handlers
│       │   │   ├── auth.ts            # POST /auth/login, /auth/register
│       │   │   ├── projects.ts        # CRUD /projects
│       │   │   ├── scripts.ts         # CRUD /scripts
│       │   │   ├── ai.ts              # POST /ai/chat, /ai/suggest, /ai/analyze
│       │   │   └── settings.ts        # GET/PUT /settings (API keys)
│       │   ├── services/              # Business logic
│       │   │   ├── auth.service.ts
│       │   │   ├── project.service.ts
│       │   │   ├── script.service.ts
│       │   │   ├── settings.service.ts
│       │   │   └── ai/                # AI provider abstraction
│       │   │       ├── ai.service.ts          # Main router (facade)
│       │   │       ├── base.provider.ts       # Abstract base class
│       │   │       ├── openai.provider.ts
│       │   │       ├── anthropic.provider.ts
│       │   │       ├── gemini.provider.ts
│       │   │       └── ollama.provider.ts
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts  # JWT verification
│       │   │   └── error.middleware.ts
│       │   ├── plugins/
│       │   │   ├── cors.ts
│       │   │   ├── jwt.ts
│       │   │   └── prisma.ts
│       │   └── db/
│       │       └── prisma/
│       │           ├── schema.prisma
│       │           └── migrations/
│       ├── tsconfig.json
│       └── package.json
│
└── packages/
    └── shared/                # Types shared between frontend & backend
        ├── src/
        │   ├── types/
        │   │   ├── screenplay.types.ts
        │   │   ├── ai.types.ts
        │   │   └── api.types.ts
        │   └── constants/
        │       ├── screenplay.constants.ts  # Element types, shortcuts
        │       └── ai.constants.ts          # Provider names, model lists
        └── package.json
```

---

## 4. Database Schema (Prisma)

```prisma
// apps/backend/src/db/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL") // file:./data/scripthing.db
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  projects     Project[]
  settings     Settings?
}

model Project {
  id          String    @id @default(cuid())
  title       String
  description String?
  format      String    @default("screenplay") // screenplay | teleplay | stageplay | podcast
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  scripts     Script[]
}

model Script {
  id          String    @id @default(cuid())
  title       String
  content     String    // JSON string (Tiptap/ProseMirror doc)
  version     Int       @default(1)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  projectId   String
  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  snapshots   Snapshot[]
}

model Snapshot {
  id          String    @id @default(cuid())
  content     String    // JSON string
  label       String?   // e.g. "Draft 1", "Before AI edit"
  createdAt   DateTime  @default(now())

  scriptId    String
  script      Script    @relation(fields: [scriptId], references: [id], onDelete: Cascade)
}

model Settings {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // API Keys (encrypted at rest)
  openaiApiKey      String?
  anthropicApiKey   String?
  geminiApiKey      String?
  ollamaEndpoint    String?  @default("http://localhost:11434")

  // AI Preferences
  activeProvider    String?  // "openai" | "anthropic" | "gemini" | "ollama"
  activeModel       String?  // model selected by the user
  aiTemperature     Float    @default(0.7)

  // Editor Preferences
  theme             String   @default("dark")  // "light" | "dark"
  fontSize          Int      @default(12)
  fontFamily        String   @default("Courier Prime")
  autoSaveInterval  Int      @default(30)  // seconds

  updatedAt         DateTime @updatedAt
}
```

---

## 5. API Endpoints

All endpoints are prefixed with `/api/v1`. Endpoints requiring authentication are marked 🔒.

### Auth
```
POST   /api/v1/auth/register        Register a new account
POST   /api/v1/auth/login           Login and receive a JWT
POST   /api/v1/auth/logout          Invalidate token
GET    /api/v1/auth/me          🔒  Get currently authenticated user info
```

### Projects
```
GET    /api/v1/projects         🔒  List all projects owned by the user
POST   /api/v1/projects         🔒  Create a new project
GET    /api/v1/projects/:id     🔒  Get project details
PUT    /api/v1/projects/:id     🔒  Update a project
DELETE /api/v1/projects/:id     🔒  Delete a project (cascades to scripts)
```

### Scripts
```
GET    /api/v1/projects/:projectId/scripts      🔒  List scripts in a project
POST   /api/v1/projects/:projectId/scripts      🔒  Create a new script
GET    /api/v1/scripts/:id                      🔒  Fetch a script with its content
PUT    /api/v1/scripts/:id                      🔒  Update script content
DELETE /api/v1/scripts/:id                      🔒  Delete a script
POST   /api/v1/scripts/:id/snapshot             🔒  Save a manual snapshot
GET    /api/v1/scripts/:id/snapshots            🔒  List snapshot history
POST   /api/v1/scripts/:id/export/pdf           🔒  Export script to PDF
POST   /api/v1/scripts/:id/export/fdx           🔒  Export script to Final Draft .fdx
```

### AI
```
POST   /api/v1/ai/chat              🔒  Chat with AI about the script
POST   /api/v1/ai/suggest           🔒  Get a continuation suggestion based on cursor context
POST   /api/v1/ai/rewrite           🔒  Rewrite selected text
POST   /api/v1/ai/analyze           🔒  Analyze characters, structure, or plot
POST   /api/v1/ai/generate          🔒  Generate a scene or dialogue from a prompt
POST   /api/v1/ai/providers/test    🔒  Test an API key connection
GET    /api/v1/ai/models            🔒  List available models per provider
```

### Settings
```
GET    /api/v1/settings         🔒  Retrieve user settings
PUT    /api/v1/settings         🔒  Update settings (API keys, preferences)
```

---

## 6. AI Provider Architecture

All providers implement the same interface, making them interchangeable.

### Base Interface

```typescript
// apps/backend/src/services/ai/base.provider.ts

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AICompletionOptions {
  messages: AIMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AICompletionResult {
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export abstract class BaseAIProvider {
  abstract readonly name: string;
  abstract readonly supportedModels: string[];

  abstract complete(options: AICompletionOptions): Promise<AICompletionResult>;
  abstract stream(options: AICompletionOptions): AsyncGenerator<string>;
  abstract testConnection(apiKey: string): Promise<boolean>;
  abstract listModels(apiKey: string): Promise<string[]>;
}
```

### AI Router (Facade)

```typescript
// apps/backend/src/services/ai/ai.service.ts
// Responsible for selecting the correct provider based on user settings.
// Injects settings from the DB — never from environment variables.

export class AIService {
  private getProvider(providerName: string, apiKey: string): BaseAIProvider {
    switch (providerName) {
      case "openai":    return new OpenAIProvider(apiKey);
      case "anthropic": return new AnthropicProvider(apiKey);
      case "gemini":    return new GeminiProvider(apiKey);
      case "ollama":    return new OllamaProvider(apiKey); // apiKey = endpoint URL
      default: throw new Error(`Unknown provider: "${providerName}"`);
    }
  }

  async complete(
    userId: string,
    options: Omit<AICompletionOptions, "model">
  ): Promise<AICompletionResult> {
    const settings = await getSettingsByUserId(userId);
    if (!settings.activeProvider) throw new Error("No AI provider configured");
    const apiKey = this.getApiKey(settings, settings.activeProvider);
    const provider = this.getProvider(settings.activeProvider, apiKey);
    return provider.complete({ ...options, model: settings.activeModel });
  }
}
```

### Screenplay System Prompt

Every AI request must include the following system prompt so the AI understands the screenplay writing context:

```
You are a professional screenplay writing assistant.
You understand industry-standard formatting: Scene Heading, Action, Character, Dialogue, Parenthetical, and Transition.
Always respond in the same language the user writes in.
When generating or revising script content, use the correct screenplay format.
Do not add lengthy explanations unless explicitly asked.
```

---

## 7. Screenplay Editor (Tiptap)

The editor uses Tiptap with custom extensions for each screenplay element.

### Element Types

| Element | Keyboard Shortcut | Visual Format |
|---|---|---|
| `scene-heading` | `Cmd/Ctrl + 1` | ALL CAPS, left-aligned |
| `action` | `Cmd/Ctrl + 2` | Normal, full width |
| `character` | `Cmd/Ctrl + 3` | ALL CAPS, centered |
| `dialogue` | `Cmd/Ctrl + 4` | Indented left & right |
| `parenthetical` | `Cmd/Ctrl + 5` | (in parentheses), indented |
| `transition` | `Cmd/Ctrl + 6` | ALL CAPS, right-aligned |

### Auto-Format Rules

1. New line after `scene-heading` → automatically becomes `action`
2. New line after `character` → automatically becomes `dialogue`
3. New line after `dialogue` → returns to `action`
4. Typing `INT.` or `EXT.` → automatically detected as `scene-heading`
5. Tab on an empty line → toggles between `character` and `action`

### Content Stored as JSON

```json
{
  "type": "doc",
  "content": [
    {
      "type": "scene-heading",
      "content": [{ "type": "text", "text": "INT. OFFICE - DAY" }]
    },
    {
      "type": "action",
      "content": [{ "type": "text", "text": "JOHN sits in front of his laptop." }]
    },
    {
      "type": "character",
      "content": [{ "type": "text", "text": "JOHN" }]
    },
    {
      "type": "dialogue",
      "content": [{ "type": "text", "text": "Finally done." }]
    }
  ]
}
```

---

## 8. Security

### API Key Storage
- API keys are **never** stored in plaintext.
- Keys are encrypted using **AES-256-GCM** with an encryption key derived from `APP_SECRET` in the environment variables.
- API keys are never returned to the frontend in full. Only the last 4 characters are exposed (e.g. `****xxxx`).

### Authentication
- All endpoints except `/auth/*` require a JWT Bearer token.
- JWT is stored in `localStorage` on the frontend (suitable for local use), or in an `httpOnly cookie` for VPS deployments.
- Tokens expire after **7 days**.

### Input Validation
- All request bodies are validated with **Zod** on the backend before processing.
- Script content is limited to a maximum of **2MB** per request.
- AI prompts are limited to a maximum of **4000 characters**.

---

## 9. Environment Variables

```bash
# apps/backend/.env

# Database
DATABASE_URL="file:./data/scripthing.db"

# Server
PORT=3001
HOST=0.0.0.0
NODE_ENV=development

# Security
APP_SECRET="replace-with-a-random-32-character-string"  # used for API key encryption & JWT signing
JWT_EXPIRES_IN="7d"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

```bash
# apps/frontend/.env

VITE_API_URL="http://localhost:3001/api/v1"
```

---

## 10. Docker & Deployment

### docker-compose.yml (Production VPS)

```yaml
version: "3.8"

services:
  backend:
    build: ./apps/backend
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: file:/data/scripthing.db
      APP_SECRET: ${APP_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    volumes:
      - db_data:/data
    expose:
      - "3001"

  frontend:
    build: ./apps/frontend
    restart: always
    expose:
      - "80"

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - backend
      - frontend

volumes:
  db_data:
```

### Deploy to VPS

```bash
# 1. Clone the repository
git clone https://github.com/abengkris/scripthing.git && cd scripthing

# 2. Create .env from the example
cp .env.example .env
# Edit APP_SECRET and FRONTEND_URL

# 3. Start all services
docker-compose up -d

# 4. Check status
docker-compose ps
docker-compose logs -f
```

### Run Locally (Without Docker)

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm --filter backend prisma migrate dev

# Start all services
pnpm dev
# → Frontend: http://localhost:5173
# → Backend:  http://localhost:3001
```

---

## 11. Code Conventions

### Naming
- **Files**: `kebab-case.ts` for all files
- **React Components**: `PascalCase.tsx`
- **Functions / variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types / Interfaces**: `PascalCase`, with `Type` or `Interface` suffix if ambiguous

### Backend Function Structure
```typescript
// Route handlers are only responsible for:
// validating the request → calling a service → sending the response.
// All business logic MUST live in service files, never in route handlers.
// Errors MUST be thrown as Error objects and handled by the error middleware.
```

### Frontend Component Structure
```typescript
// Order inside a component:
// 1. Hooks (useState, useEffect, useStore, etc.)
// 2. Derived state / computed values
// 3. Handler functions
// 4. Return JSX
```

### Commit Messages
```
feat: add a new feature
fix: fix a bug
refactor: restructure code without changing behavior
docs: update documentation
chore: update dependencies / config
```

---

## 12. Development Roadmap

Recommended implementation order:

```
Phase 1 — Core Foundation
  [x] Monorepo setup (pnpm workspaces)
  [x] Backend setup (Fastify + Prisma + SQLite)
  [x] Frontend setup (Vite + React + Tailwind)
  [x] Authentication (register, login, JWT)
  [x] CRUD for Projects & Scripts

Phase 2 — Editor
  [x] Tiptap integration
  [x] Custom extensions for all screenplay elements
  [x] Auto-format rules
  [x] Auto-save to backend every 30 seconds
  [x] Snapshot / version history

Phase 3 — AI Integration
  [ ] Settings page (input & store encrypted API keys)
  [x] Base provider interface
  [ ] OpenAI provider implementation
  [ ] Anthropic provider implementation
  [x] Google Gemini provider implementation
  [ ] Ollama provider implementation
  [ ] AI Sidebar (chat + suggest + rewrite)
  [ ] Streaming responses

Phase 4 — Export & Polish
  [ ] Export to PDF
  [ ] Export to FDX (Final Draft format)
  [ ] Dark / Light mode
  [ ] Onboarding for new users
  [ ] Docker setup & deployment guide

Phase 5 — Testing & Quality Assurance
  [ ] Unit tests for all backend services & AI providers (Vitest)
  [ ] Unit tests for frontend hooks & store logic (Vitest)
  [ ] Integration tests for all API endpoints (supertest + Vitest)
  [ ] E2E tests for the editor, export, and AI flows (Playwright)
  [ ] Load testing for VPS deployment (k6 or autocannon)
  [ ] Test coverage report (target: ≥ 80% coverage)

Phase 6 — Security Hardening
  [ ] Security audit for API key encryption (AES-256-GCM)
  [ ] Per-user rate limiting on AI endpoints to prevent abuse (fastify-rate-limit)
  [ ] CSRF protection for VPS / cookie-based auth deployments
  [ ] HTTP security headers (Helmet.js)
  [ ] Dependency vulnerability scan (npm audit / Snyk)
  [ ] Basic penetration testing (OWASP checklist)

Phase 7 — Performance Optimization
  [ ] Lazy loading for editor and AI sidebar components (React.lazy)
  [ ] Prisma query optimization: add indexes, use pagination on all list endpoints
  [ ] Cache repeated AI responses per session (in-memory or Redis)
  [ ] Frontend bundle size audit and optimization (Vite rollup config)
  [ ] Debounce auto-save to reduce write frequency
  [ ] Virtual scrolling for long scripts in the editor

Phase 8 — UX & Feature Polish
  [ ] Real-time word count and page count in the status bar
  [ ] Character report: list all characters with scene appearances
  [ ] Find & replace across the entire script
  [ ] Full undo/redo history (ProseMirror history plugin)
  [ ] Keyboard shortcut reference panel (Cmd/Ctrl + ?)
  [ ] Drag-and-drop scene reordering in the Navigator
  [ ] Script notes / annotation layer per scene
  [ ] Print preview before PDF export

Phase 9 — Distribution & CI/CD
  [ ] Set up GitHub Actions pipeline: lint → test → build → deploy
  [ ] Auto-deploy to VPS on push to main branch (via SSH + Docker)
  [ ] Write user-facing documentation (README, usage guide, FAQ)
  [ ] Create CHANGELOG.md with semantic versioning (semver)
  [ ] Publish repository as open-source on GitHub (MIT License)
  [ ] Create a landing page with feature overview and self-hosting guide
```

---

*This document must be updated whenever a significant architectural change is made.*
