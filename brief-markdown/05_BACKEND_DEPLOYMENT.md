# Modul 05 — Backend & Deployment

## 1. Gambaran Umum

Modul ini menyatukan **fondasi backend** (struktur FastAPI, Swagger `/docs`, CORS, env, infra SSE) dan **strategi deployment** (jalan lokal untuk testing FE+BE, lalu deploy Netlify + Render). Backend adalah satu aplikasi **Python FastAPI** yang menghosting Agent Registry (modul 04), agent `agno` (modul 02/04), tool knowledge (modul 03), dan persistensi (modul 02). Frontend (modul 01) di-build statis dan di-deploy terpisah ke Netlify.

Prioritas eksplisit Feri di modul ini: **(1)** keduanya bisa dijalankan lokal untuk testing, dan **(2)** backend punya **Swagger UI** (`/docs`) sebagai antarmuka eksplorasi & uji endpoint.

### 1.1 Tujuan Modul

| Tujuan | Deskripsi |
|--------|-----------|
| Struktur backend jelas | Layout `source/backend` rapi, modular, mudah dirawat |
| Swagger `/docs` | FastAPI auto-docs untuk eksplorasi & uji semua endpoint |
| Local dev mudah | FE (vite) + BE (uvicorn) jalan lokal dengan satu langkah masing-masing |
| Deploy gratis | Netlify (FE) + Render (BE) + Turso (persistensi) |
| Aman & hemat | CORS allowlist, rate limit, secret via `.env` |

### 1.2 Target Pengguna

| Pengguna | Kebutuhan |
|----------|-----------|
| Feri (developer) | Setup cepat, test lokal, deploy tanpa ribet |
| Tim/kolaborator | Onboard cepat lewat README + Swagger |

---

## 2. Fitur Utama

### 2.1 Struktur Repo & Backend

```
source/
├── frontend/                      # modul 01 (React+TS+Vite) → Netlify
│   ├── src/ ...
│   ├── .env                       # VITE_API_BASE_URL
│   └── package.json
└── backend/                       # Python FastAPI → Render
    ├── app/
    │   ├── main.py                # entrypoint FastAPI (mount router, CORS, /docs)
    │   ├── config.py              # baca .env (pydantic-settings)
    │   ├── api/
    │   │   ├── agents.py          # /api/agents, /run, /stream (modul 04)
    │   │   ├── sessions.py        # /api/sessions/... history (modul 02)
    │   │   └── health.py          # /api/health
    │   ├── agents/
    │   │   ├── registry.py        # AgentRegistry + definisi (modul 04)
    │   │   ├── definitions.py     # talk_to_data, executive_summary, tailored_pitch
    │   │   └── runner.py          # bangun & jalankan agno agent + SSE
    │   ├── tools/
    │   │   └── knowledge.py       # read_knowledge + guardrail (modul 03)
    │   ├── db/
    │   │   ├── database.py        # koneksi SQLite/Turso (libsql)
    │   │   └── models.py          # chat_sessions, chat_messages
    │   └── core/
    │       ├── sse.py             # helper SSE (text/event-stream)
    │       └── ratelimit.py       # throttle per-IP
    ├── knowledge/                 # modul 03 (markdown KB, ikut di-deploy)
    ├── scripts/
    │   └── build_knowledge.py     # konversi HTML/PDF → markdown (modul 03)
    ├── data/                      # SQLite lokal (dev); gitignored
    ├── .env.example               # template env (tanpa secret asli)
    ├── requirements.txt
    └── README.md
```

### 2.2 FastAPI App + Swagger

**Deskripsi**: `main.py` memasang router, CORS, dan mengaktifkan Swagger UI bawaan FastAPI.

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import agents, sessions, health

app = FastAPI(
    title="Feri Personal Site API",
    version="1.0.0",
    description="Talk-to-data AI assistant + agent endpoints tentang Feri.",
    docs_url="/docs",        # Swagger UI
    redoc_url="/redoc",      # ReDoc (opsional)
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,   # ["http://localhost:5173", "https://<situs>.netlify.app"]
    allow_methods=["*"], allow_headers=["*"],
)

app.include_router(health.router,   prefix="/api")
app.include_router(agents.router,   prefix="/api")
app.include_router(sessions.router, prefix="/api")
```

> **Swagger**: buka `http://localhost:8000/docs` → semua endpoint (`/api/agents`, `/run`, `/stream`, `/sessions/...`, `/health`) terdaftar otomatis dengan schema request/response (dari Pydantic) dan tombol "Try it out".

### 2.3 Konfigurasi Environment

**`.env.example` (backend):**
```bash
# LLM
OPENROUTER_API_KEY=sk-or-...           # WAJIB (diisi Feri)
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
DEFAULT_MODEL=anthropic/claude-3.5-... # model default (hemat+cepat)

# CORS
CORS_ORIGINS=http://localhost:5173,https://<situs>.netlify.app

# Persistensi
DB_BACKEND=sqlite                      # "sqlite" (dev) | "turso" (prod)
SQLITE_PATH=./data/chat.db
TURSO_DATABASE_URL=                     # diisi saat prod
TURSO_AUTH_TOKEN=

# Rate limit
RATE_LIMIT_PER_MIN=20
```

**`.env` (frontend):**
```bash
VITE_API_BASE_URL=http://localhost:8000   # dev
# prod: https://<app>.onrender.com
```

> `.env` **tidak di-commit** (`.gitignore`). Hanya `.env.example` yang masuk repo.

### 2.4 SSE Infrastructure

```python
# core/sse.py — format event seragam (dipakai chat & task streaming)
async def sse_event(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"

# di endpoint:
return StreamingResponse(generator(), media_type="text/event-stream",
    headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"})
```
- Header `X-Accel-Buffering: no` & `Cache-Control: no-cache` agar proxy tidak buffer stream.
- Event: `token`, `citation`, `done`, `error` (konsisten modul 02 & 04).

---

## 3. Alur Bisnis

### 3.1 Alur — Menjalankan Lokal (Local Dev, FE + BE)

**Backend (terminal 1):**
```bash
cd source/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # isi OPENROUTER_API_KEY
python scripts/build_knowledge.py   # generate knowledge/*.md + _index.md (sekali)
uvicorn app.main:app --reload --port 8000
# → API di http://localhost:8000 , Swagger di http://localhost:8000/docs
```

**Frontend (terminal 2):**
```bash
cd source/frontend
npm install
cp .env.example .env            # VITE_API_BASE_URL=http://localhost:8000
npm run dev
# → Situs di http://localhost:5173
```

**Diagram:**
```
Terminal 1: uvicorn :8000  ──┐
                             ├─ CORS allow localhost:5173
Terminal 2: vite    :5173  ──┘
   Browser → :5173 (UI) → fetch/SSE → :8000 (API + /docs)
```

### 3.2 Alur — Testing via Swagger

```
1. Buka http://localhost:8000/docs
2. Coba GET /api/agents → lihat manifest 3 agent
3. Coba GET /api/agents/talk_to_data/stream?q=...&session_id=test → lihat stream
4. Coba POST /api/agents/tailored_pitch/run dengan body JD → lihat output
→ Outcome: validasi endpoint tanpa perlu FE
```

### 3.3 Alur — Deploy ke Produksi

```
┌─────────────────────┐     ┌──────────────────────────┐
│ git push (monorepo) │────▶│ Netlify (FE)             │
└─────────────────────┘     │ base: source/frontend    │
          │                 │ build: npm run build      │
          │                 │ publish: dist            │
          │                 │ env: VITE_API_BASE_URL    │
          │                 └──────────────────────────┘
          │                 ┌──────────────────────────┐
          └────────────────▶│ Render (BE)              │
                            │ root: source/backend      │
                            │ build: pip install -r ... │
                            │ start: uvicorn app.main:app│
                            │        --host 0.0.0.0      │
                            │        --port $PORT        │
                            │ env: OPENROUTER_API_KEY,   │
                            │      CORS_ORIGINS,         │
                            │      DB_BACKEND=turso, ... │
                            └──────────┬────────────────┘
                                       ▼
                            ┌──────────────────────────┐
                            │ Turso (libSQL) — history  │
                            └──────────────────────────┘
```
Langkah:
1. **Render**: buat Web Service, root `source/backend`, set env (OpenRouter key, CORS origin Netlify, Turso URL/token, `DB_BACKEND=turso`).
2. **Turso**: buat database, salin URL + auth token ke env Render.
3. **Netlify**: base `source/frontend`, build `npm run build`, publish `dist`, set `VITE_API_BASE_URL` = URL Render.
4. Update `CORS_ORIGINS` di Render dengan domain Netlify final.

### 3.4 Edge Cases

| Kasus | Penanganan |
|-------|-----------|
| Render cold start | Health check + pesan ramah di FE (modul 01); opsional cron keep-alive ping |
| CORS error | Pastikan origin Netlify ada di `CORS_ORIGINS`; localhost untuk dev |
| SSE ke-buffer proxy | Header `X-Accel-Buffering: no`, `Cache-Control: no-cache` |
| Secret bocor | `.env` gitignored; rotate key bila perlu; tidak pernah log key |
| Build knowledge belum jalan | Startup check: jika `knowledge/_index.md` tak ada → warning + petunjuk |
| Port bentrok lokal | Ubah `--port`; sesuaikan `VITE_API_BASE_URL` |

---

## 4. Struktur Data

Backend mengonsolidasi data model dari modul lain (tidak mendefinisikan tabel baru):
- **Chat history**: `chat_sessions`, `chat_messages` (modul 02).
- **Knowledge**: file `.md` (modul 03) — bukan DB.
- **Registry**: in-memory (modul 04).

**Koneksi DB (abstraksi dev/prod):**
```python
# db/database.py
def get_db():
    if settings.db_backend == "turso":
        return libsql.connect(settings.turso_url, auth_token=settings.turso_token)
    return sqlite3.connect(settings.sqlite_path)   # dev
```

---

## 5. API Endpoints (ringkasan seluruh sistem)

```yaml
GET  /api/health                     # liveness (untuk cold-start UX)
GET  /api/agents                     # manifest agent (modul 04)
GET  /api/agents/{id}                # detail agent (opsional)
POST /api/agents/{id}/run            # task non-stream
GET  /api/agents/{id}/stream         # SSE chat & task
GET  /api/sessions/{id}/messages     # history (modul 02)
POST /api/sessions/{id}/reset        # reset sesi (opsional)
# Semua terdokumentasi otomatis di /docs (Swagger) & /redoc.
```

---

## 6. Spesifikasi Teknis

### 6.1 Backend Requirements

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Runtime | Python | 3.11 |
| Framework | FastAPI | latest |
| Server | Uvicorn | latest |
| Agent | agno | latest |
| LLM client | OpenRouter (via SDK OpenAI-compatible) | — |
| Config | pydantic-settings | 2.x |
| DB (dev) | sqlite3 (stdlib) | — |
| DB (prod) | libsql (Turso client) | latest |
| Konversi KB | beautifulsoup4, markdownify, pymupdf4llm | latest |

### 6.2 Performance & Reliability

| Aspek | Target / Catatan |
|-------|------------------|
| Startup | < 5 detik (load registry + manifest knowledge) |
| TTFT chat | < 800 ms (modul 02) |
| Async | semua I/O LLM & DB non-blocking |
| Degraded-safe | jika DB gagal → chat tetap jalan (history best-effort) |
| Health | `/api/health` cek proses + (opsional) konektivitas DB |

### 6.3 Keamanan

| Aspek | Implementasi |
|-------|--------------|
| Secret | `.env` (gitignored), tidak pernah di-log |
| CORS | Allowlist origin (Netlify prod + localhost dev) |
| Rate limit | Per-IP (`RATE_LIMIT_PER_MIN`) di endpoint run/stream |
| Input validation | Pydantic dari `input_schema`; batasi panjang field bebas (anti prompt-injection) |
| Path guard | `read_knowledge` whitelist (modul 03) |

### 6.4 Hosting (free tier)

| Layanan | Peran | Catatan |
|---------|-------|---------|
| Netlify | FE static | build dari `source/frontend`, CDN, domain custom |
| Render | BE Python | Web Service, free tier (cold start), `$PORT` env |
| Turso | Persistensi | libSQL, free tier, persist lintas restart |

---

## 7. Use Case Scenarios

### 7.1 Skenario — Onboarding Developer Baru
**Actor**: Kolaborator · **Goal**: jalankan lokal
```
1. Clone repo, baca README
2. Backend: venv → pip install → .env → build_knowledge → uvicorn
3. Buka /docs, test GET /api/agents
4. Frontend: npm install → .env → npm run dev
5. Buka :5173 → chat jalan
→ Onboard < 15 menit
```

### 7.2 Skenario — Uji Endpoint Sebelum Integrasi FE
**Actor**: Feri · **Goal**: pastikan tailored_pitch benar
```
1. /docs → POST /api/agents/tailored_pitch/run
2. Tempel JD contoh di body, Execute
3. Cek output skor + sitasi
→ Yakin sebelum sambungkan ke UI
```

### 7.3 Skenario — Deploy Pertama
**Actor**: Feri · **Goal**: situs live
```
1. Render: deploy backend, set env (OpenRouter, CORS, Turso)
2. Turso: buat DB, isi env Render
3. Netlify: deploy FE, set VITE_API_BASE_URL
4. Update CORS_ORIGINS dengan domain Netlify
5. Smoke test: buka situs, kirim 1 pertanyaan
→ Live & grounded
```

---

## 8. Referensi Implementasi

### 8.1 FastAPI + SSE (umum)
**Yang Diadaptasi**: `StreamingResponse` text/event-stream, auto Swagger `/docs`.

### 8.2 Stack produksi Feri (Indonesia Indicator)
**Yang Diadaptasi**: FastAPI + asyncio + agent + OpenRouter fallback; pola degraded-safe.

### 8.3 Netlify + Render + Turso (jamstack + Python + libSQL)
**Yang Diadaptasi**: split deploy FE static / BE Python / DB managed — semua free tier.

---

## 9. Catatan Penutup Brief

Dengan modul 00–05 lengkap, brief ini **execution-ready**: arsitektur, desain, knowledge base, agent extensible, chat+persistensi, dan deployment+local-dev sudah terdefinisi konkret. Asumsi yang ditandai (Turso vs disk, cold start Render, bilingual final) tercatat di Blind Spot Review `00_OVERVIEW.md` untuk divalidasi saat implementasi.

---

*Dokumen ini bagian dari Dokumentasi Implementasi Situs Personal Feri + AI Assistant.*
*Modul: Backend & Deployment | Versi: 1.0.0 | Konsisten dengan `00_OVERVIEW.md` & modul 01–04*
