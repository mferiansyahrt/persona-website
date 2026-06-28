# Situs Personal Feri + AI Assistant (Talk-to-Data)

Monorepo: `frontend` (React+TS, Netlify) + `backend` (Python FastAPI + agno, Render).
Spesifikasi lengkap ada di `../brief-markdown/` dan design system di `../brief_personal_site/DESIGN_SYSTEM.md`.

```
source/
├── frontend/   React + TypeScript + Vite  → Netlify
└── backend/    Python + FastAPI + agno     → Render
```

## Menjalankan Lokal

### Backend (terminal 1)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # isi OPENROUTER_API_KEY
python scripts/build_knowledge.py --index   # (opsional) regen _index.md
uvicorn app.main:app --reload --port 8000
# API   → http://localhost:8000
# Swagger → http://localhost:8000/docs
```

### Frontend (terminal 2)
```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_BASE_URL=http://localhost:8000
npm run dev
# Situs → http://localhost:5179
```

## Arsitektur singkat
- **Knowledge base**: markdown per topik di `backend/knowledge/` (`profile.md`, `experience.md`, `projects/*.md`) + manifest `_index.md`. Agent membaca on-demand via tool `read_knowledge` (agentic file retrieval, guardrailed).
- **Agent**: dibangun dengan **agno** + model via **OpenRouter** (`.env`). Diekspos lewat Agent Registry: `GET /api/agents`, `POST /api/agents/{id}/run`, `GET /api/agents/{id}/stream` (SSE).
- **Agent v1**: `talk_to_data` (chat), `executive_summary`, `tailored_pitch`. Menambah agent = tambah `AgentDefinition` di `app/agents/definitions.py`.
- **Persistensi**: SQLite (dev) / Turso libSQL (prod) — `chat_sessions`, `chat_messages`.

## Deploy
- **Backend → Render**: root `source/backend`, build `pip install -r requirements.txt`,
  start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set env: `OPENROUTER_API_KEY`,
  `CORS_ORIGINS` (domain Netlify), `DB_BACKEND=turso`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`.
- **Frontend → Netlify**: base `source/frontend`, build `npm run build`, publish `dist`,
  env `VITE_API_BASE_URL` = URL Render.
- **Turso**: buat DB, salin URL + token ke env Render.
