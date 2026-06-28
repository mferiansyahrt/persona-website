# Situs Personal Feri + AI Assistant Talk-to-Data — Dokumentasi Implementasi

## Ringkasan Eksekutif

Sistem ini adalah **situs web personal** untuk **M. Feriansyah Raihan Taufiq** (AI/ML Engineer) yang berfungsi bukan sebagai CV statis, melainkan **portfolio interaktif berbasis percakapan**. Inti produk adalah **AI Assistant "talk-to-data"** — pengunjung (recruiter, calon klien, kolaborator) dapat bertanya secara natural tentang pengalaman, keahlian, dan 12 project Feri, lalu dijawab AI secara *grounded* (tersitasi) berdasarkan knowledge base markdown yang dibangun dari CV dan halaman portfolio.

Arsitektur dipisah tegas: **frontend React + TypeScript** (deploy Netlify) dan **backend Python FastAPI + agent `agno`** (deploy Render), berkomunikasi via REST + **SSE streaming**. Knowledge base memakai pola **agentic file retrieval** — agent membaca file markdown relevan *on-demand* lewat tool-call, bukan vector DB. Endpoint agent didesain **extensible** lewat pola Agent Registry sehingga kapabilitas baru cukup didaftarkan tanpa mengubah plumbing. Desain visual: **warm dark theme** (default) + light theme companion, conversational-first, dengan prinsip *calm, human-yet-technical*.

---

## 1. Visi dan Tujuan Sistem

### 1.1 Visi

Menjadikan profil profesional Feri dapat "diajak bicara" — mengubah CV dan portfolio yang biasanya dibaca pasif menjadi pengalaman percakapan yang hangat, kredibel, dan instan. Situs ini sekaligus menjadi **demonstrasi langsung** kapabilitas Feri sebagai AI Engineer: pengunjung tidak hanya membaca bahwa ia membangun sistem multi-agent talk-to-data, tetapi langsung memakainya.

### 1.2 Tujuan Utama

| Tujuan | Deskripsi |
|--------|-----------|
| Portfolio interaktif | Memperkenalkan profil & 12 project secara interaktif, bukan dokumen statis |
| Talk-to-data tentang Feri | Tanya-jawab natural (ID/EN) yang dijawab grounded + tersitasi dari knowledge base |
| Demonstrasi kapabilitas | Situs itu sendiri = bukti hidup skill AI Engineering Feri |
| Endpoint agent terstruktur | Tugas bernilai tinggi (executive summary, tailored pitch) yang bisa tumbuh |
| Friendly & kredibel | Desain warm dark yang hangat namun profesional & transparan (sumber, model) |
| Mudah dirawat & di-deploy | Bisa jalan lokal untuk testing, deploy gratis (Netlify + Render) |

---

## 2. Arsitektur Sistem

### 2.1 Topologi Deployment (split FE/BE)

```
┌──────────────────────────────┐          ┌──────────────────────────────────────┐
│  FRONTEND (React + TS + CSS)  │  HTTPS   │  BACKEND (Python · FastAPI · agno)     │
│  Netlify (static, gratis)     │ ───────► │  Render (free tier)                    │
│                               │   REST   │                                        │
│  • Hero conversational-first  │          │  • REST API + Swagger /docs            │
│  • Project gallery + filter   │ ◄─────── │  • SSE streaming (chat & task)         │
│  • Theme toggle dark/light    │   SSE    │  • Agent Registry (agno agents)        │
│  • Agent launcher (dinamis)   │          │  • OpenRouter (LLM, via .env)          │
└──────────────────────────────┘          │  • Knowledge base (markdown, on-demand)│
                                           │  • SQLite/Turso (chat history)         │
                                           └───────────────┬────────────────────────┘
                                                           │
                                          ┌────────────────┴───────────────┐
                                          ▼                                 ▼
                                  ┌─────────────────┐             ┌──────────────────┐
                                  │ OpenRouter API  │             │ Knowledge files  │
                                  │ (LLM provider)  │             │ knowledge/*.md   │
                                  └─────────────────┘             └──────────────────┘
```

### 2.2 Layer Arsitektur (logis)

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER (Netlify)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐        │
│  │ Hero+Chat│ │ Projects │ │  About   │ │ ThemeToggle  │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘        │
├─────────────────────────────────────────────────────────────────┤
│                     API LAYER (FastAPI · Render)               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REST endpoints + Swagger /docs + SSE streaming + CORS    │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                     AGENT LAYER (agno)                         │
│  ┌──────────────┐ ┌──────────────────┐ ┌────────────────────┐  │
│  │ Agent Registry│ │ talk_to_data     │ │ executive_summary  │  │
│  │ (manifest)   │ │ tailored_pitch   │ │ ...(growth)         │  │
│  └──────────────┘ └──────────────────┘ └────────────────────┘  │
│        │ tool-call: read_knowledge(file) [guardrailed]          │
├─────────────────────────────────────────────────────────────────┤
│                     DATA LAYER                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐│
│  │ Knowledge base (read-only)│  │ Chat history (read-write)    ││
│  │ knowledge/*.md + _index.md│  │ SQLite / Turso (libSQL)      ││
│  └──────────────────────────┘  └──────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                     INTEGRATION LAYER                           │
│  ┌──────────────┐                                               │
│  │ OpenRouter   │  (LLM completions, API key via .env)          │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Komponen Utama

| Komponen | Teknologi | Fungsi |
|----------|-----------|--------|
| Frontend | React 18/19 + TypeScript + CSS (Vite) | UI conversational-first, gallery, theme toggle |
| Backend | Python 3.11 + FastAPI + Uvicorn | REST API, SSE, Swagger `/docs` |
| Agent framework | `agno` | Definisi & orkestrasi agent, tool-calling |
| LLM | OpenRouter (key via `.env`) | Completions untuk chat & task agent |
| Knowledge base | Markdown files (`knowledge/*.md`) | Sumber fakta tentang Feri (agentic file retrieval) |
| Chat history | SQLite (lokal) / Turso libSQL (prod) | Persistensi sesi & pesan |
| Hosting FE | Netlify (free) | Static hosting + CDN |
| Hosting BE | Render (free tier) | Python runtime + persistent disk |

---

## 3. Modul Sistem

### 3.1 Daftar Modul

| No | Modul | File | Prioritas (MoSCoW) |
|----|-------|------|--------------------|
| 1 | Frontend Web | `01_FRONTEND_WEB.md` | Must |
| 2 | AI Assistant (chat + persistensi) | `02_AI_ASSISTANT.md` | Must |
| 3 | Knowledge Base (agentic retrieval) | `03_KNOWLEDGE_BASE.md` | Must |
| 4 | Agent Endpoints (extensible) | `04_AGENT_ENDPOINTS.md` | Must (core) / Should (growth) |
| 5 | Backend & Deployment | `05_BACKEND_DEPLOYMENT.md` | Must |

### 3.2 Integrasi Antar Modul

```
                         ┌─────────────────────────┐
                         │   01 FRONTEND_WEB        │
                         │   (hero + gallery + UI)  │
                         └───────────┬─────────────┘
                                     │ REST + SSE
                         ┌───────────▼─────────────┐
                         │   05 BACKEND_DEPLOYMENT  │
                         │   (FastAPI · Swagger)    │
                         └───────────┬─────────────┘
                                     │ Agent Registry
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                       ▼
   ┌───────────────────┐  ┌───────────────────┐  ┌────────────────────┐
   │ 02 AI_ASSISTANT   │  │ 04 AGENT_ENDPOINTS│  │ (future agents)    │
   │ (talk_to_data)    │  │ (exec summary,    │  │                    │
   │                   │  │  tailored pitch)  │  │                    │
   └─────────┬─────────┘  └─────────┬─────────┘  └────────────────────┘
             │ tool-call: read_knowledge()       │
             └───────────────┬───────────────────┘
                             ▼
                  ┌────────────────────────┐
                  │ 03 KNOWLEDGE_BASE       │
                  │ knowledge/*.md+_index   │
                  └────────────────────────┘
```

**Catatan integrasi:**
- Semua agent (02 & 04) berbagi tool `read_knowledge()` dari modul 03 (guardrailed ke folder `knowledge/`).
- Semua agent diekspos lewat pola seragam Agent Registry di modul 05 (`/api/agents/...`).
- Chat history (di 02) read-write; knowledge base (03) read-only.

---

## 4. Referensi Sistem Serupa

### 4.1 Pola Estetik & UX (hasil deep research)

| Referensi | Yang Diadaptasi |
|-----------|-----------------|
| Conversational AI Portfolio (Awwwards) | Pola conversational-first sebagai hero |
| Isabel Moranta (Awwwards SOTD) | Warm-on-dark premium, serif+mono, noise texture, blur-reveal |
| Josh W Comeau | Warm dark base (#0d0f12) + accent hangat |
| Claude.ai | Lebar pesan chat ~768px, citation pattern |

### 4.2 Pola Arsitektur (dari pengalaman Feri sendiri)

| Sistem | Pola yang Dipinjam |
|--------|--------------------|
| Document-ETL / MA-TAG (MCP) | Tool registry seragam (jadi Agent Registry) |
| Stellar Deep Research Agent | SSE streaming agent, knowledge retrieval |
| Command AI | Talk-to-data assistant via SSE |

---

## 5. Standar Teknis

### 5.1 Keamanan

| Aspek | Standar | Implementasi |
|-------|---------|--------------|
| Secret management | `.env` (tidak di-commit) | `OPENROUTER_API_KEY`, dll. via env var |
| Path traversal guard | Whitelist | Tool `read_knowledge` dibatasi folder `knowledge/` |
| CORS | Origin allowlist | Hanya origin Netlify (prod) + localhost (dev) |
| Rate limiting | Per-IP throttle | Lindungi endpoint LLM dari abuse (biaya OpenRouter) |
| Input validation | Pydantic v2 | Validasi body request di FastAPI |

### 5.2 API Standards

```yaml
openapi: 3.0.0
info:
  title: Feri Personal Site API
  version: 1.0.0
servers:
  - url: http://localhost:8000      # local dev (uvicorn) — Swagger di /docs
  - url: https://<app>.onrender.com # production
# Konvensi: /api/... , versioned bila perlu, response selalu ada timestamp,
# SSE untuk streaming, Bearer/none (situs publik read-mostly).
```

### 5.3 Design System

Detail palette (warm dark + light), tipografi (Space Grotesk / Inter / JetBrains Mono), spacing, radius, shadow, dan spesifikasi UI chat ada di **`DESIGN_SYSTEM.md`** (di folder `brief_personal_site/`). Semua brief frontend WAJIB konsisten dengan token di sana.

---

## 6. Roadmap Implementasi

### Fase 1: Fondasi (Setup)
- Scaffold `source/frontend` (Vite React TS) + `source/backend` (FastAPI).
- Setup `.env`, CORS, Swagger `/docs`, local dev (uvicorn + vite).
- Pipeline konversi knowledge: `portfolio_*.html` + CV PDF → `knowledge/*.md` + `_index.md`.

### Fase 2: Core Features
- Agent Registry + tool `read_knowledge` (guardrailed).
- `talk_to_data` chat via SSE + persistensi SQLite.
- Frontend: hero conversational-first + chat UI + design system.

### Fase 3: Konten & Agent Tambahan
- Project gallery + filter + tombol "Tanya AI".
- `executive_summary` + `tailored_pitch`.
- Theme toggle dark/light, polish micro-interaction.

### Fase 4: Deploy & Hardening
- Deploy FE Netlify + BE Render, Turso untuk persistensi prod.
- Rate limiting, aksesibilitas (kontras, reduced-motion), performa font.

---

## 7. Struktur Dokumen

| File | Deskripsi |
|------|-----------|
| `00_OVERVIEW.md` | Dokumen ini — gambaran umum sistem |
| `01_FRONTEND_WEB.md` | Situs React/TS: layout, user flow, wireframe, theme |
| `02_AI_ASSISTANT.md` | Chat talk-to-data SSE + persistensi history |
| `03_KNOWLEDGE_BASE.md` | Agentic file retrieval, manifest, pipeline konversi |
| `04_AGENT_ENDPOINTS.md` | Agent Registry extensible + endpoint terstruktur |
| `05_BACKEND_DEPLOYMENT.md` | FastAPI/Swagger, local dev FE+BE, deployment |

> Referensi lintas-dokumen: `DESIGN_SYSTEM.md` dan `_DISCUSSION_LOG.md` di folder `brief_personal_site/`.

---

## 8. Blind Spot Review

### Gap Teridentifikasi
- **Knowledge base belum dibuat** — konversi 12 HTML + PDF → markdown masih pending (didetailkan di modul 03).
- **Pilihan persistensi prod** (Turso vs persistent disk Render) belum final — didetailkan di modul 02.
- **Skala tipe & beberapa nilai design** sudah ditetapkan, tapi belum ada mockup hi-fi (wireframe ASCII di modul 01/02 sebagai pengganti).

### Asumsi Belum Tervalidasi
- Render free tier mencukupi (cold start ~beberapa detik dapat diterima untuk situs personal). *Asumsi — perlu re-validate saat deploy.*
- OpenRouter dipakai untuk chat; **embedding tidak diperlukan** karena memakai agentic file retrieval (bukan RAG vektor). Valid selama knowledge base tetap kecil.
- Bilingual ID+EN: assistant menjawab mengikuti bahasa penanya. *Disepakati lisan, ditandai untuk konfirmasi final.*
- `tailored_pitch` masuk v1 sebagai agent ketiga (disetujui user).

### Risiko yang Ditandai
- **Cold start Render free tier**: request pertama setelah idle bisa lambat → pertimbangkan keep-alive ping atau pesan loading yang ramah di FE.
- **Biaya OpenRouter**: situs publik tanpa rate limit bisa disalahgunakan → rate limiting wajib di Fase 4.
- **Akurasi tool-call file**: jika `_index.md` tidak deskriptif, agent salah pilih file → manifest harus dijaga kualitasnya (modul 03).

### Tingkat Kepercayaan
**medium-high** — arsitektur, stack, dan desain sudah jelas dan disepakati; gap utama adalah eksekusi (pembuatan knowledge base) dan validasi deployment, bukan ketidakpastian desain.

### Status Brief
**ready_for_execution (overview)** — modul fitur (01–05) menyusul. Overview ini menjadi acuan koherensi untuk semua modul.

---

*Dokumen ini bagian dari Dokumentasi Implementasi Situs Personal Feri + AI Assistant.*
*Versi: 1.0.0 | Terakhir diperbarui: Juni 2026*
