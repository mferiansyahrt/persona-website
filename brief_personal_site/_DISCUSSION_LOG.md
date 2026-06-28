# Discussion Log — Situs Personal + AI Assistant Talk-to-Data

> **Status:** Discovery in progress (belum brief final). Catatan ini akan jadi dasar `00_OVERVIEW.md` + feature briefs.
> **Tanggal:** 2026-06-28
> **Klien/Subjek:** M. Feriansyah Raihan Taufiq (AI/ML Engineer) — app berbasis dirinya sendiri.

---

## 1. Produk yang Akan Dibangun

Situs web personal "berbasis diri sendiri" yang berfungsi sebagai portfolio interaktif **plus** AI assistant yang bisa **talk-to-data** tentang Feri — pengunjung (recruiter, klien, kolaborator) dapat bertanya soal pengalaman, skill, dan 12 project, dijawab AI berbasis data CV + katalog project.

**Tujuan inti (sementara):**
- Memperkenalkan profil & kapabilitas Feri secara interaktif, bukan CV statis.
- Memungkinkan tanya-jawab natural tentang Feri (talk-to-data).
- Menyediakan endpoint agent untuk tugas terstruktur (mis. executive summary).

---

## 2. Desain & Bahasa

- **Tema:** Dark theme, kesan *friendly* (bukan korporat kaku).
- **Bahasa:** Bilingual ID + EN (assistant menjawab sesuai bahasa penanya). *(Disepakati di sesi awal — perlu re-konfirmasi saat synthesis.)*

---

## 3. Tech Stack (Disepakati)

| Layer | Teknologi |
|-------|-----------|
| Frontend | React + TypeScript (`.ts`, `.tsx`, `.css`) |
| Backend | Python penuh (FastAPI), agent framework **agno** |
| LLM | **OpenRouter** (API key via `.env`, disediakan Feri nanti) |
| Streaming | **SSE** untuk AI assistant |
| Persistensi | **SQLite** untuk history chat (disimpan berkala) |

### Struktur Repo (DISEPAKATI)

Monorepo dengan pemisahan tegas frontend & backend:

```
source/
├── frontend/        ← React + TypeScript (.ts/.tsx/.css) → deploy Netlify
│   ├── src/
│   ├── public/
│   └── ...
└── backend/         ← Python + FastAPI + agno → deploy Render
    ├── app/         ← API, SSE, agent (agno)
    ├── knowledge/   ← markdown knowledge base (lihat §6)
    ├── data/        ← SQLite chat history (persistent disk)
    ├── .env         ← OPENROUTER_API_KEY dll
    └── requirements.txt
```

> `source/frontend` dan `source/backend` di-deploy terpisah (lihat §4), tapi tinggal satu repo.

---

## 4. Keputusan Arsitektur Deployment (Disepakati)

**Masalah:** Netlify free tier **tidak bisa** menjalankan backend Python seperti yang diinginkan:
1. Netlify Functions tidak mendukung Python (hanya JS/TS & Go) → `agno` tidak jalan.
2. SQLite tidak persist di serverless (filesystem ephemeral/read-only) → history hilang.
3. SSE long-lived kena batas durasi function (~10–26 dtk).

**Keputusan — split deployment:**

```
┌────────────────────────┐         ┌──────────────────────────────┐
│  FRONTEND (React/TS)   │  HTTPS  │  BACKEND (Python/FastAPI)     │
│  Netlify (gratis)      │ ──────► │  Render free tier (rekomendasi)│
│  - static build        │  SSE    │  - agno agents                 │
│  - dark theme UI       │ ◄────── │  - OpenRouter calls            │
└────────────────────────┘         │  - SSE streaming               │
                                    │  - SQLite (persistent disk     │
                                    │    atau Turso/libSQL)          │
                                    └──────────────────────────────┘
```

- **Frontend** → Netlify (sweet spot untuk static React).
- **Backend Python** → host ramah-Python free tier: **Render** (rekomendasi), alternatif Railway / Fly.io / Hugging Face Spaces.
- **SQLite** → tetap konsep SQLite, tapi *persist*: pakai **Turso (libSQL)** free tier, atau SQLite file di persistent disk/volume backend. *(Pilihan final ditentukan saat deep-dive.)*

> Catatan: Feri menyatakan belum sepenuhnya paham deployment → keputusan deployment dipercayakan ke rekomendasi (ditandai sebagai asumsi yang akan dijelaskan ulang saat implementasi).

---

## 5. Endpoint Agent (Awal — perlu didetailkan)

- **AI Assistant (talk-to-data)** — chat streaming SSE tentang diri Feri, dengan agentic file retrieval (lihat §6).
- **Execute Executive Summary** — agent menghasilkan ringkasan eksekutif tentang Feri.
- **"Hal lain"** — endpoint agent tambahan lain (BELUM final). Kandidat yang diusulkan: (a) tailored pitch / job-match, (b) project deep-dive, (c) skill-match analyzer → akan difinalkan saat feature decomposition.

---

## 6. Knowledge Base AI — Agentic File Retrieval (DISEPAKATI)

**Pendekatan:** bukan vector DB / RAG, bukan context-stuffing penuh. Pakai **agentic file retrieval** — agent membaca file markdown relevan *on-demand* via tool-call.

**Pre-processing (sekali, saat build):**
- Tiap `portfolio_*.html` (12 project) → 1 markdown per project.
- `M_Feriansyah_Resume.pdf` → markdown profil.

**Struktur file:**
```
source/backend/knowledge/
├── profile.md              ← dari CV (PDF)
├── _index.md               ← manifest: daftar semua file + deskripsi 1 baris per project
└── projects/
    ├── command_ai.md       ← dari portofolio_command_ai.html
    ├── netra.md            ← dari portfolio_netra.html
    ├── cognitive_warfare.md
    └── ... (total 12 project)
```

**Runtime flow:**
1. `_index.md` (manifest) di-load ke **system prompt** agent → agent tahu file apa yang tersedia.
2. User bertanya → agent pilih file relevan dari manifest.
3. Agent **tool-call** `read_knowledge(file)` yang melakukan `with open(...)` membaca 1+ file `.md`.
4. Agent menjawab tersitasi berbasis isi file.

**Keputusan tambahan (disepakati):**
- ✅ Ada `_index.md` (manifest) terpisah supaya tool-call akurat (agent tidak menebak nama file).
- ✅ **Guardrail path:** tool `with open` dibatasi whitelist hanya ke folder `knowledge/` — tidak boleh buka file sembarang di server.

> Knowledge base = read-only, statis, di-version-control di repo backend, ikut ter-deploy ke Render. Terpisah dari chat history (SQLite, read-write).

---

## 7. Yang Masih Terbuka (Next Steps)

- [ ] Konfirmasi bilingual ID+EN final.
- [ ] Finalkan daftar endpoint agent ("hal lain" → pilih dari kandidat a/b/c atau ide Feri).
- [ ] Tentukan storyline pemakaian utama (siapa pengunjung, alur khasnya).
- [ ] Feature decomposition → jumlah file brief (`NN_*.md`).
- [ ] Pilihan SQLite persistence (Turso vs persistent disk).
- [ ] MoSCoW prioritas fitur.

---

*Checkpoint discovery — akan dikembangkan menjadi brief lengkap (00_OVERVIEW.md + NN_FEATURE.md) setelah parameter Tier 1 selesai.*
