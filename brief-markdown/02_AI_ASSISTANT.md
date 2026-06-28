# Modul 02 — AI Assistant (Talk-to-Data + Persistensi)

## 1. Gambaran Umum

AI Assistant adalah **jantung** situs: chat talk-to-data yang menjawab pertanyaan tentang Feri secara *grounded* (tersitasi) berbasis knowledge base markdown (modul 03), di-stream real-time via **SSE**. Agent dibangun dengan **`agno`** dan memanggil LLM lewat **OpenRouter**. Modul ini juga mencakup **persistensi history** — sesi & pesan disimpan berkala ke SQLite (lokal) / Turso libSQL (produksi) agar percakapan tidak hilang dan bisa dilanjutkan.

Agent talk-to-data terdaftar di Agent Registry (modul 04/05) dengan id `talk_to_data`, mode `chat`, `streaming: true`. Ia memakai tool `read_knowledge()` (modul 03) untuk membuka file `.md` relevan sebelum menjawab. Prinsip desain dari deep research: **transparent AI** — tampilkan sumber, nama model, dan status, supaya terasa hidup dan tepercaya.

### 1.1 Tujuan Modul

| Tujuan | Deskripsi |
|--------|-----------|
| Jawaban grounded | Setiap jawaban faktual bersandar pada file knowledge + sitasi |
| Streaming hidup | SSE token-by-token, TTFT < 800ms, indikator < 300ms |
| Transparan & tepercaya | Tampilkan sumber, nama model, status pesan |
| Kontinuitas | History tersimpan; sesi bisa dilanjutkan lintas kunjungan |
| Bilingual | Menjawab mengikuti bahasa penanya (ID/EN) |

### 1.2 Target Pengguna

| Pengguna | Kebutuhan |
|----------|-----------|
| Recruiter / klien | Jawaban cepat, spesifik, terbukti (sitasi project) |
| Engineer | Diskusi teknis mendalam tentang arsitektur project |
| Feri | Percakapan tersimpan; bisa meninjau apa yang sering ditanya |

---

## 2. Fitur Utama

### 2.1 Chat Streaming (SSE)

**Deskripsi**: Antarmuka percakapan dengan streaming token-by-token. Berawal sebagai chat box di hero (modul 01), berekspansi jadi panel penuh saat dipakai.

**Komponen Visual**:

| Komponen | Tipe | Data | Update |
|----------|------|------|--------|
| Message list | Bubble list | `useChatStore` | Real-time (SSE) |
| Composer | Textarea + send | Input user | On submit |
| Typing indicator | Animasi caret/dots | Status streaming | < 300ms |
| Stop button | Button | Saat `streaming` | Toggle |
| Citation cards | Expandable card | Dari event SSE | Saat ada sumber |
| Model badge | Label kecil | Dari event SSE | Per pesan AI |

**Layout Chat (panel penuh, max-width 768px)**:

```
┌──────────────────────────────────────────────────────────┐
│  💬 Tanya Feri AI                          [ × tutup ]    │  ← header
├──────────────────────────────────────────────────────────┤
│                                                          │
│                          ┌─────────────────────────────┐ │
│                          │ Apa pengalaman multi-agent  │ │  ← user bubble
│                          │ Feri?                       │ │     (align kanan)
│                          └─────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🤖 Feri membangun banyak sistem multi-agent      │    │  ← AI bubble
│  │ produksi. Contohnya NETRA (28 agent) untuk       │    │  (surface-2 + sentuhan --ai)
│  │ defense intelligence [1], dan Cognitive          │    │
│  │ Warfare Engine (13 agent) [2]▌                   │    │  ← ▌ caret streaming
│  │                                                  │    │
│  │ 📎 Sumber:                                        │    │
│  │  [1] projects/netra.md          [buka ▸]         │    │  ← citation card
│  │  [2] projects/cognitive_warfare.md [buka ▸]      │    │
│  │                                                  │    │
│  │  ⚙ via openrouter/anthropic/claude  ·  ⧉ salin   │    │  ← model badge + actions
│  └─────────────────────────────────────────────────┘    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  ╭────────────────────────────────────────╮ [⏹ Stop]    │  ← composer + stop
│  │ Ketik pertanyaan...                      │ [ ➤ Kirim ] │
│  ╰────────────────────────────────────────╯             │
│  [Project untuk fintech?] [Skill utama?]                 │  ← chips (saat idle)
└──────────────────────────────────────────────────────────┘
   bubble user=--accent-soft · bubble AI=--surface-2 · caret=--accent
```

**Aturan streaming (deep research):**
- TTFT < 800ms; typing indicator muncul < 300ms (blinking caret = sinyal minimal "hidup").
- Render token tiap 30–60ms; **layout stabil** (teks tidak melompat saat streaming).
- **Tombol Stop wajib** selama generasi; menekan Stop → status `final` dengan konten parsial.
- Hindari animasi mengetik palsu yang memperlambat model cepat.

### 2.2 Suggested Prompt Chips

**Deskripsi**: 3–5 chip spesifik (bukan generik) di empty-state & saat idle. Mengajari kapabilitas assistant dalam satu klik.

**Contoh chip (bisa ditarik dari manifest/statis):**
- "Apa pengalaman Feri dengan multi-agent systems?"
- "Project mana yang cocok untuk role fintech?"
- "Ringkas latar belakang Feri dalam 3 poin"
- "Stack teknologi yang paling dikuasai?"

**Interaksi**: chip **dismissible**; klik = kirim sebagai pesan; menghilang setelah percakapan dimulai, muncul lagi (kontekstual) saat idle.

### 2.3 Citations & Trust Signals

**Deskripsi**: Jawaban faktual wajib menyertakan sumber file knowledge yang dibuka agent.

- Nomor sitasi inline `[1]` → kartu sumber yang bisa di-expand (nama file + tombol "buka").
- Batasi **top 3–5 sumber** (hindari banjir).
- **Nama model** ditampilkan di tiap pesan AI (transparansi).
- (Opsional) indikator confidence + progressive disclosure reasoning.

### 2.4 Persistensi History

**Deskripsi**: Sesi & pesan disimpan berkala agar percakapan persist dan bisa dilanjutkan. SQLite untuk dev, Turso (libSQL) untuk prod.

- `sessionId` dibuat di FE (UUID), disimpan di `localStorage`, dikirim tiap request.
- Backend menyimpan pesan **setelah pesan AI selesai** (status `final`) — bukan tiap token (hemat I/O).
- "Simpan berkala": untuk task panjang, checkpoint tiap N detik/chunk (debounce) agar tahan crash.
- Pengunjung bisa **lanjut sesi** saat kembali (load history by `sessionId`), atau **mulai baru**.

---

## 3. Alur Bisnis (User Flow Experience)

### 3.1 Alur Utama — Tanya-Jawab Grounded (happy path)

**Actor**: Pengunjung (recruiter/engineer)
**Trigger**: Mengetik/klik chip pertanyaan
**Goal**: Mendapat jawaban akurat + bukti

```
┌─────────────┐   ┌──────────────────┐   ┌───────────────────────┐
│ 1. User     │──▶│ 2. FE POST/SSE   │──▶│ 3. agno agent baca    │
│ kirim tanya │   │ /agents/         │   │ _index.md → pilih file│
│             │   │ talk_to_data/    │   │                       │
└─────────────┘   │ stream           │   └───────────┬───────────┘
                  └──────────────────┘               │ tool-call
   ┌──────────────────────┐   ┌──────────────────┐   ▼
   │ 7. Simpan ke SQLite  │◀──│ 6. Event 'done'  │ ┌─────────────────┐
   │ (status final)       │   │ + citations+model│ │ 4. read_knowledge│
   └──────────────────────┘   └────────▲─────────┘ │   (1+ file .md)  │
                                        │           └────────┬─────────┘
                              ┌─────────┴────────┐           │
                              │ 5. Stream token  │◀──────────┘
                              │ (SSE) → FE render│  LLM via OpenRouter
                              └──────────────────┘
```
**Outcome**: User melihat jawaban mengalir real-time, dengan sitasi file + nama model; percakapan tersimpan.

### 3.2 Alur — Lanjut Sesi Lama

```
1. User kembali ke situs (sessionId ada di localStorage)
2. FE GET history by sessionId
3. Backend kembalikan pesan tersimpan dari SQLite/Turso
4. FE render percakapan sebelumnya → user lanjut bertanya
→ Outcome: kontinuitas, tidak mulai dari nol
```

### 3.3 Alur — Pre-fill dari Project Card

```
1. User klik "🤖 Ask" di kartu NETRA (modul 01)
2. FE buka chat dengan pesan pre-fill "Ceritakan tentang NETRA"
3. Agent tool-call read_knowledge("projects/netra.md")
4. Jawaban + sitasi netra.md
→ Outcome: jembatan mulus dari konten ke percakapan
```

### 3.4 Edge Cases

| Kasus | Penanganan |
|-------|-----------|
| LLM/provider error | Event SSE `error` → status `failed` + tombol "Coba lagi"; konteks dipertahankan |
| Context limit terlampaui | Agent ringkas/seleksi file; beri tahu user bila perlu mempersempit pertanyaan |
| User klik Stop | Hentikan stream, simpan konten parsial sebagai `final` |
| Pertanyaan di luar topik Feri | Agent menolak sopan + arahkan ke topik yang bisa dijawab |
| File knowledge tidak ditemukan | Agent fallback ke `_index.md`/profile.md + tandai tidak yakin (jangan halusinasi) |
| Tulisan ambigu | Agent tanya klarifikasi spesifik ("Maksud Anda X atau Y?") |

---

## 4. Struktur Data

### 4.1 Data Model (Chat History — SQLite / Turso libSQL)

```sql
-- Sesi percakapan
CREATE TABLE chat_sessions (
    id            TEXT PRIMARY KEY,        -- UUID dari FE
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lang          TEXT,                    -- "id" | "en" (terdeteksi)
    user_agent    TEXT,                    -- konteks ringan (opsional)
    meta          TEXT                     -- JSON bebas (referrer, dll)
);

-- Pesan per sesi
CREATE TABLE chat_messages (
    id            TEXT PRIMARY KEY,        -- UUID
    session_id    TEXT NOT NULL REFERENCES chat_sessions(id),
    role          TEXT NOT NULL,           -- "user" | "assistant"
    content       TEXT NOT NULL,
    status        TEXT NOT NULL,           -- "final" | "failed" (disimpan saat selesai)
    agent_id      TEXT,                    -- "talk_to_data" dll
    model         TEXT,                    -- model OpenRouter yang dipakai
    citations     TEXT,                    -- JSON array [{n, file, label}]
    tokens_in     INTEGER,
    tokens_out    INTEGER,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_session ON chat_messages(session_id, created_at);
CREATE INDEX idx_sessions_active  ON chat_sessions(last_active);
```

### 4.2 Sample Data

#### chat_sessions
| id | created_at | last_active | lang |
|----|-----------|-------------|------|
| 7f3a…e1 | 2026-06-28 09:12:03 | 2026-06-28 09:15:40 | id |
| a92c…b4 | 2026-06-28 10:01:55 | 2026-06-28 10:02:10 | en |

#### chat_messages
| id | session_id | role | content (ringkas) | status | model | citations |
|----|-----------|------|-------------------|--------|-------|-----------|
| m1 | 7f3a…e1 | user | "pengalaman multi-agent?" | final | — | — |
| m2 | 7f3a…e1 | assistant | "Feri membangun NETRA (28 agent)…" | final | anthropic/claude | [{"n":1,"file":"projects/netra.md"}] |
| m3 | a92c…b4 | user | "best project for fintech role?" | final | — | — |

### 4.3 Pilihan Persistensi (dev vs prod)

| Aspek | Dev (lokal) | Prod (Render) |
|-------|-------------|---------------|
| Engine | SQLite file (`data/chat.db`) | **Turso (libSQL)** — direkomendasikan |
| Alasan | Nol setup, cukup untuk testing | Persist meski instance restart; free tier |
| Alternatif prod | — | SQLite di persistent disk Render (1 disk, single instance) |
| Driver | `sqlite3` / `libsql` | `libsql` (client Turso) |

> **Keputusan default: Turso untuk prod** (persisten, free tier, drop-in libSQL). Alternatif persistent-disk dicatat bila ingin tanpa layanan eksternal. *Final saat deploy (modul 05).*

---

## 5. API Endpoints

### 5.1 Chat (SSE streaming)

```yaml
# Streaming chat (SSE) — endpoint seragam Agent Registry
GET /api/agents/talk_to_data/stream
parameters:
  - q:          string  (required)   # pertanyaan user
  - session_id: string  (required)   # UUID sesi
  - lang:       string  (optional)   # "id"|"en" (auto-detect bila kosong)

# Format event SSE:
event: token        # data: {"delta":"...token..."}
event: citation     # data: {"n":1,"file":"projects/netra.md","label":"NETRA"}
event: done         # data: {"message_id":"m2","model":"anthropic/claude","tokens":{...}}
event: error        # data: {"code":"provider_error","message":"..."}
```

### 5.2 History

```yaml
GET /api/sessions/{session_id}/messages    # load history utk lanjut sesi
response:
  { "session_id":"7f3a…", "messages":[ {role,content,status,model,citations,created_at}, ... ] }

POST /api/sessions/{session_id}/reset       # mulai sesi baru (opsional)
```

---

## 6. Konfigurasi (Agent talk_to_data)

```json
{
  "id": "talk_to_data",
  "label": { "id": "Tanya Feri AI", "en": "Ask Feri AI" },
  "mode": "chat",
  "streaming": true,
  "model": "via OPENROUTER (configurable .env, default: model hemat+cepat)",
  "tools": ["read_knowledge"],
  "system_prompt": "Persona ramah, jawab grounded dari knowledge base, wajib sitasi, jujur bila tidak tahu, ikuti bahasa penanya.",
  "guardrails": {
    "scope": "hanya topik tentang Feri",
    "no_hallucination": true,
    "max_files_per_turn": 4
  }
}
```

---

## 7. Spesifikasi Teknis

### 7.1 Backend

| Komponen | Teknologi |
|----------|-----------|
| Agent | `agno` Agent + tool `read_knowledge` |
| LLM gateway | OpenRouter (key `.env`) |
| Streaming | FastAPI `StreamingResponse` / SSE (`text/event-stream`) |
| Persistensi | SQLite (dev) / Turso libSQL (prod) |
| Async | `asyncio` (non-blocking saat LLM call) |

### 7.2 Performance

| Metrik | Target |
|--------|--------|
| Time-to-first-token | < 800 ms |
| Typing indicator muncul | < 300 ms |
| Token paint window | 30–60 ms |
| Simpan pesan ke DB | async, tidak blok stream |

### 7.3 Aksesibilitas Chat

- Area streaming dibungkus `aria-live="polite"` → screen reader umumkan saat user idle.
- Composer tetap fokus saat streaming (ketikan tidak terganggu).
- Tombol Stop/Kirim punya label ARIA; tap target ≥44px.
- Bubble AB punya kontras AA di kedua tema; caret streaming kontras ≥3:1.

---

## 8. Use Case Scenarios

### 8.1 Skenario Rutin — Recruiter Tanya Skill
**Actor**: Recruiter · **Goal**: nilai kecocokan
```
1. Klik chip "Stack teknologi yang paling dikuasai?"
2. Agent baca profile.md + _index.md
3. Stream jawaban: Python/asyncio/multi-agent/RAG... + sitasi profile.md
4. Recruiter lanjut "ada pengalaman fintech?"
5. Agent tool-call ke project finance (equity/Document-ETL)
→ Jawaban terbukti, percakapan tersimpan
```

### 8.2 Skenario Edge — Provider Error
**Actor**: Pengunjung · **Goal**: tetap dapat respons
```
1. Kirim pertanyaan
2. OpenRouter timeout → event SSE 'error'
3. UI tampilkan status failed + "Coba lagi"
4. User klik retry → berhasil
→ Konteks percakapan tidak hilang
```

### 8.3 Skenario — Lanjut Sesi Esok Hari
**Actor**: Klien · **Goal**: lanjut diskusi
```
1. Buka situs lagi (sessionId tersimpan)
2. History 5 pesan ter-load dari Turso
3. Lanjut "tadi soal Document-ETL, bisa diintegrasi ke sistem kami?"
4. Agent jawab dengan konteks sebelumnya
→ Kontinuitas penuh
```

---

## 9. Referensi Implementasi

### 9.1 Claude.ai
**Yang Diadaptasi**: lebar pesan ~768px, pola citation (inline → kartu sumber), transparansi model.

### 9.2 Stellar Deep Research Agent (project Feri)
**Yang Diadaptasi**: SSE streaming agent + knowledge retrieval on-demand.

### 9.3 Command AI (project Feri)
**Yang Diadaptasi**: talk-to-data assistant via SSE untuk eksekutif.

---

*Dokumen ini bagian dari Dokumentasi Implementasi Situs Personal Feri + AI Assistant.*
*Modul: AI Assistant (Chat + Persistensi) | Versi: 1.0.0 | Konsisten dengan `00_OVERVIEW.md`, `03_KNOWLEDGE_BASE.md`, `DESIGN_SYSTEM.md`*
