# WorkFlow Note AI

**메모를 보고서로, 액션아이템까지** — 한국 직장인을 위한 문서 워크플로우 도구

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  Next.js     │────▶│  FastAPI      │────▶│  Claude API   │
│  (Vercel)    │◀────│  (Railway)    │◀────│  (Anthropic)  │
└─────────────┘     └──────┬───────┘     └───────────────┘
                           │
                    ┌──────▼───────┐
                    │  Supabase    │
                    │  PostgreSQL  │
                    └──────────────┘
```

## Monorepo Structure

```
workflow-note-ai/
├── apps/
│   ├── web/          # Next.js 15 + TypeScript + Tailwind + shadcn/ui
│   └── api/          # FastAPI + Pydantic + Anthropic SDK
├── packages/
│   └── shared/       # Shared types (future)
└── README.md
```

## Quick Start

### Backend

```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your ANTHROPIC_API_KEY
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev  # http://localhost:3000
```

## Environment Variables

### Backend (`apps/api/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key |
| `PORT` | No | Server port (default: 8000) |

### Frontend (`apps/web/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | Backend URL (default: http://localhost:8000) |

## Deployment

- **Frontend**: Vercel (connect GitHub repo, set root to `apps/web`)
- **Backend**: Railway (set root to `apps/api`, start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`)

## Core Features

### Document Types
1. **회의록** — Meeting notes to structured minutes
2. **주간보고** — Weekly work memo to formal report
3. **업무일지** — Daily tasks to work log

### AI Capabilities
- Structured Korean business document generation
- Action item extraction (owner, due date, priority)
- Tone rewriting (shorter, formal, manager-ready, team-sharing)
- Email/Slack summary generation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Pydantic v2, Python 3.12 |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Database | In-memory (Phase 1), Supabase PostgreSQL (Phase 2+) |

## MVP Phases

- [x] **Phase 1**: Core generate flow (input → AI → structured output)
- [ ] **Phase 2**: Rewrite controls, copy/share, history
- [ ] **Phase 3**: Landing polish, auth, settings, prompt logging
