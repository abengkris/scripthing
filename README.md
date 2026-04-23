# Scripthing ✍️

[![CI](https://github.com/abengkris/scripthing/actions/workflows/ci.yml/badge.svg)](https://github.com/abengkris/scripthing/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Scripthing** is a professional-grade, local-first, web-based screenplay writing application. It offers industry-standard formatting, distraction-free writing, and optional AI-assisted writing that keeps you in control of your data.

![App Screenshot Placeholder](https://via.placeholder.com/1200x600?text=Scripthing+Editor+Screenshot)

## Key Features
- **Industry-Standard Formatting**: Automatic formatting for Scene Headings, Action, Character, Dialogue, Parentheticals, and Transitions.
- **Local-First Architecture**: Your data stays on your machine. We use SQLite for backend persistence and debounced auto-save.
- **AI-Optional Power**: Connect your own OpenAI, Anthropic, Gemini, or Ollama (offline) keys for chat, suggestions, and rewrites.
- **Professional Exports**: Export your scripts to pixel-perfect PDF (via Puppeteer) or Final Draft .fdx format.
- **Robust Security**: AES-256-GCM encryption for your API keys and automated database backups.
- **Dark Mode Support**: Write day or night with a sleek, responsive UI built with shadcn/ui and TailwindCSS.
- **Self-Hostable**: Easily deploy to any VPS using Docker Compose.

## Tech Stack
- **Frontend**: React 18.x, TypeScript, Vite, Tiptap (ProseMirror), Zustand, TanStack Query, TailwindCSS.
- **Backend**: Node.js 22.x LTS, Fastify, Prisma, SQLite (better-sqlite3), Zod, Pino.
- **DevOps**: Docker, GitHub Actions, Nginx.

## Getting Started

### Prerequisites
- Node.js 22.x LTS
- pnpm 10.x (`npm install -g pnpm`)
- Docker & Docker Compose (optional, for self-hosting)

### Quick Start (Local Dev)
1. **Clone the repo**:
   ```bash
   git clone https://github.com/abengkris/scripthing.git && cd scripthing
   ```
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Setup environment**:
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   ```
   *Edit `apps/backend/.env` and set `APP_SECRET` to a random 32-character string.*
4. **Initialize database**:
   ```bash
   pnpm --filter backend db:migrate
   pnpm --filter backend db:seed
   ```
   *This creates a ready-to-use demo account:*
   - *Email: `demo@scripthing.local`*
   - *Password: `demo1234`*
5. **Start development server**:
   ```bash
   pnpm run dev
   ```
   *Frontend: http://localhost:5173 | Backend: http://localhost:3001*

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Prisma connection string for SQLite (e.g., `file:./data/scripthing.db`) |
| `APP_SECRET` | 32-char secret for session tokens and key encryption. |
| `PORT` | Backend port (default 3001). |
| `FRONTEND_URL` | URL of the frontend (for CORS). |
| `AI_RATE_LIMIT_RPM` | Rate limit for AI requests per user (default 20). |

## Self-Hosting with Docker

1. **Configure Compose**: Edit `docker-compose.yml` and set your `APP_SECRET`.
2. **Build and Run**:
   ```bash
   docker compose up -d
   ```
3. **Nginx Configuration**: For Production/VPS, use the provided `nginx.conf` behind a reverse proxy like Nginx or Caddy.
   *Note: To ensure the AI typing effect (Server-Sent Events) works instantly, you must disable Nginx buffering for the `/api/v1/ai/` location in your configuration (`proxy_buffering off;`).*

## Backup & Restore

### Automated Backup
The system includes a script at `scripts/backup.sh` that performs atomic SQLite backups.
- **Cronjob Example**: Run `0 0 * * * /opt/scripthing/scripts/backup.sh /opt/scripthing/apps/backend/data/scripthing.db /opt/scripthing/backups/` to backup daily.

### Restore
1. Stop the application.
2. Copy the backup `.db` file over the current `scripthing.db`.
3. Restart the application.

## Troubleshooting
- **API Key Decryption Error**: If you change `APP_SECRET`, you must provide the old secret as `APP_SECRET_PREVIOUS` to enable graceful key rotation.
- **PDF Export Fails**: Ensure Puppeteer dependencies are installed on the host or use the Docker environment which has them pre-configured.

## Contributing
Contributions are welcome! Please read `AGENTS.md` for our architectural guide and code conventions.

## License
Distributed under the MIT License. See `LICENSE` for more information.