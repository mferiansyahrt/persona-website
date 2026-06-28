# Modul 04 — Agent Endpoints (Agent Registry Extensible)

## 1. Gambaran Umum

Modul ini mendefinisikan **pola seragam** untuk semua kapabilitas agent di situs — bukan hanya chat. Daripada membuat endpoint baru tiap menambah fitur agent, sistem memakai **Agent Registry**: setiap kemampuan adalah satu `AgentDefinition` yang didaftarkan ke registry, lalu otomatis terekspos lewat endpoint generik (`/api/agents/...`). Frontend menampilkan "agent launcher" yang **dirender dinamis** dari manifest `/api/agents`, sehingga **menambah agent = mendaftarkan 1 definisi**, tanpa menyentuh plumbing API maupun UI.

Pola ini meniru *tool/MCP registry* yang sudah Feri kuasai (Document-ETL, Stellar). v1 mengisi tiga agent: `talk_to_data` (chat — detail di modul 02), `executive_summary`, dan `tailored_pitch`. Kapabilitas masa depan (mis. `project_deepdive`, `skill_match`) cukup ditambahkan sebagai definisi baru.

### 1.1 Tujuan Modul

| Tujuan | Deskripsi |
|--------|-----------|
| Extensible | Tambah agent tanpa ubah endpoint/UI — cukup register definisi |
| Seragam | Satu kontrak: run (non-stream) & stream (SSE) untuk semua agent |
| Self-describing | `/api/agents` jadi manifest → FE auto-render launcher |
| Konsisten | Semua agent berbagi tool `read_knowledge` (modul 03) & guardrail |
| Bernilai | v1: executive summary + tailored pitch (nilai jual ke recruiter/klien) |

### 1.2 Target Pengguna

| Pengguna | Kebutuhan |
|----------|-----------|
| Recruiter | `tailored_pitch` — tempel JD, lihat kecocokan Feri |
| Klien / eksekutif | `executive_summary` — ringkasan padat tentang Feri |
| Pengunjung umum | `talk_to_data` — chat bebas (modul 02) |
| Feri (developer) | Menambah agent baru dengan mudah |

---

## 2. Fitur Utama

### 2.1 Agent Registry & AgentDefinition

**Deskripsi**: Registry menyimpan kumpulan `AgentDefinition`. Tiap definisi mendeklarasikan identitas, mode, streaming, input schema, prompt, dan tool yang boleh dipakai.

```python
@dataclass
class AgentDefinition:
    id: str                       # "executive_summary"
    label: dict                   # {"id": "Ringkasan Eksekutif", "en": "Executive Summary"}
    description: str              # untuk manifest & UI
    mode: str                     # "chat" | "task"
    streaming: bool               # True → tersedia di /stream
    input_schema: dict | None     # JSON Schema input (utk task), None utk chat bebas
    system_prompt: str
    tools: list[str]              # mis. ["read_knowledge"]
    model: str | None = None      # override model OpenRouter (else default .env)
    guardrails: dict | None = None

class AgentRegistry:
    def register(self, defn: AgentDefinition): ...
    def get(self, agent_id: str) -> AgentDefinition: ...
    def manifest(self) -> list[dict]:   # ringkasan publik utk /api/agents
        ...
```

**Menambah agent baru** (contoh): cukup tulis definisi + daftarkan:

```python
registry.register(AgentDefinition(
    id="project_deepdive",
    label={"id":"Bedah Project","en":"Project Deep-Dive"},
    description="Penjelasan mendalam satu project atas permintaan.",
    mode="task", streaming=True,
    input_schema={"type":"object","properties":{"project_id":{"type":"string"}},"required":["project_id"]},
    system_prompt="...",
    tools=["read_knowledge"],
))
# → langsung muncul di /api/agents & launcher FE, tanpa kode endpoint baru.
```

### 2.2 Endpoint Seragam

**Deskripsi**: Tiga endpoint generik melayani **semua** agent.

```yaml
GET  /api/agents
  # Manifest semua agent (FE render launcher & chips)
  response: [ { id, label, description, mode, streaming, input_schema }, ... ]

POST /api/agents/{id}/run
  # Eksekusi task → hasil terstruktur (non-stream). Untuk task pendek/sinkron.
  body: { ...sesuai input_schema..., session_id? }
  response: { agent_id, output, citations?, model, created_at }

GET  /api/agents/{id}/stream
  # SSE streaming (chat & task panjang). Event: token/citation/done/error (lihat modul 02).
  parameters: { ...input..., session_id }
```

> Validasi `body`/`parameters` terhadap `input_schema` (Pydantic dari schema). Tidak match → 400 dengan pesan jelas.

### 2.3 Agent v1

#### a) `talk_to_data` (chat) — detail di Modul 02
Chat bebas, streaming, tool `read_knowledge`. Tidak diulang di sini.

#### b) `executive_summary` (task)
**Tujuan**: Ringkasan eksekutif padat tentang Feri (siapa, kekuatan, project unggulan, fit).
```json
{
  "id": "executive_summary",
  "label": {"id":"Ringkasan Eksekutif","en":"Executive Summary"},
  "mode": "task", "streaming": true,
  "input_schema": {
    "type":"object",
    "properties": {
      "focus": {"type":"string","description":"opsional: fokus (mis. 'LLM','computer vision')"},
      "lang":  {"type":"string","enum":["id","en"]}
    }
  },
  "tools": ["read_knowledge"],
  "system_prompt": "Susun ringkasan eksekutif 4–6 paragraf/poin tentang Feri, grounded + sitasi, sesuai focus & bahasa."
}
```
**Output**: ringkasan terstruktur (poin/paragraf) + sitasi file knowledge yang dipakai.

#### c) `tailored_pitch` (task)
**Tujuan**: Pengunjung menempel **job description / kebutuhan**, agent menilai kecocokan Feri & menyusun pitch.
```json
{
  "id": "tailored_pitch",
  "label": {"id":"Pitch Sesuai Kebutuhan","en":"Tailored Pitch"},
  "mode": "task", "streaming": true,
  "input_schema": {
    "type":"object",
    "properties": {
      "job_description": {"type":"string","description":"JD atau kebutuhan yang ditempel"},
      "lang": {"type":"string","enum":["id","en"]}
    },
    "required": ["job_description"]
  },
  "tools": ["read_knowledge"],
  "system_prompt": "Analisis JD, cocokkan dengan profil & project Feri (grounded+sitasi). Hasil: skor kecocokan, kekuatan relevan, project pendukung, gap jujur, paragraf pitch."
}
```
**Output**: skor/level kecocokan + kekuatan relevan + project pendukung (sitasi) + gap jujur + paragraf pitch siap pakai.

### 2.4 Agent Launcher (Frontend)

**Deskripsi**: Bagian UI yang merender daftar agent dari `/api/agents` secara dinamis. Agent `task` tampil sebagai kartu/aksi; `chat` adalah hero (modul 01/02).

**Wireframe — Agent Launcher (desktop)**:

```
┌────────────────────────────────────────────────────────────────────┐
│  ⚡ Agent — minta AI lakukan tugas spesifik                          │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐   ┌──────────────────────────────┐   │
│  │ 📄 Ringkasan Eksekutif    │   │ 🎯 Pitch Sesuai Kebutuhan     │   │
│  │ Ringkasan padat tentang   │   │ Tempel JD → lihat kecocokan   │   │
│  │ Feri.                     │   │ Feri & pitch siap pakai.      │   │
│  │ [ Jalankan ▸ ]            │   │ [ Jalankan ▸ ]                │   │
│  └──────────────────────────┘   └──────────────────────────────┘   │
│       (kartu dirender dari manifest — bertambah otomatis)            │
└────────────────────────────────────────────────────────────────────┘

  Saat "Jalankan" tailored_pitch → modal input dinamis (dari input_schema):
  ┌────────────────────────────────────────────────────┐
  │ 🎯 Pitch Sesuai Kebutuhan                  [ × ]    │
  │ ╭────────────────────────────────────────────────╮ │
  │ │ Tempel job description / kebutuhan Anda...      │ │  ← field dari schema
  │ │                                                 │ │
  │ ╰────────────────────────────────────────────────╯ │
  │ Bahasa: ( • ID )( EN )                              │
  │                                   [ Jalankan ▸ ]    │
  ├────────────────────────────────────────────────────┤
  │ → hasil streaming SSE (skor, kekuatan, sitasi...)  │
  └────────────────────────────────────────────────────┘
```

> Form input di modal **di-generate dari `input_schema`** → agent baru otomatis dapat form tanpa kode UI khusus.

---

## 3. Alur Bisnis

### 3.1 Alur — Discovery & Render Dinamis

```
1. FE load → GET /api/agents
2. Backend kembalikan manifest (3 agent v1)
3. FE render: chat (hero) + kartu task (exec summary, tailored pitch)
4. (kelak) agent ke-4 didaftarkan di backend → muncul otomatis, FE tak berubah
→ Outcome: UI selalu sinkron dengan kapabilitas backend
```

### 3.2 Alur Utama — Tailored Pitch (happy path)

**Actor**: Recruiter · **Trigger**: punya JD spesifik · **Goal**: tahu fit Feri

```
┌──────────────┐  ┌───────────────────┐  ┌────────────────────────┐
│1. Klik kartu │─▶│2. Modal form dari │─▶│3. Tempel JD + pilih    │
│ Tailored Pitch│  │   input_schema    │  │   bahasa → Jalankan    │
└──────────────┘  └───────────────────┘  └───────────┬────────────┘
                                                      │ GET .../tailored_pitch/stream
   ┌────────────────────────┐  ┌──────────────────┐  ▼
   │6. Recruiter baca skor +│◀─│5. Stream hasil   │ ┌──────────────────────┐
   │  pitch → ambil putusan │  │ (SSE) + sitasi   │ │4. Agent: baca profile│
   └────────────────────────┘  └──────────────────┘ │ + projects relevan   │
                                                     │ (read_knowledge)     │
                                                     └──────────────────────┘
```
**Outcome**: Recruiter menerima skor kecocokan + kekuatan relevan + project pendukung (tersitasi) + gap jujur + paragraf pitch.

### 3.3 Alur — Executive Summary

```
1. Klik "Ringkasan Eksekutif" (opsional isi focus)
2. GET /api/agents/executive_summary/stream
3. Agent baca profile.md + experience.md + project unggulan
4. Stream ringkasan 4–6 poin + sitasi
→ Outcome: ringkasan padat, bisa di-copy
```

### 3.4 Edge Cases

| Kasus | Penanganan |
|-------|-----------|
| Input tak sesuai schema | 400 + pesan field mana yang salah (FE highlight) |
| Agent id tidak dikenal | 404 "agent tidak ditemukan" |
| JD kosong (tailored_pitch) | Validasi required → minta user isi |
| Task panjang | Pakai `/stream` + checkpoint (modul 02 persistensi) |
| Gap besar antara JD & profil | Agent jujur menyebут gap, tidak melebih-lebihkan |
| Agent non-streaming dipanggil di /stream | Fallback: jalankan run lalu kirim sebagai satu event |

---

## 4. Struktur Data

Modul ini **tidak** punya tabel sendiri. Output task yang relevan ditautkan ke history chat (modul 02 — `chat_messages.agent_id`) bila dijalankan dalam konteks sesi. Registry hidup di memori (didefinisikan di kode, dimuat saat startup).

**Bentuk manifest (`GET /api/agents`):**
```json
[
  {"id":"talk_to_data","label":{"id":"Tanya Feri AI","en":"Ask Feri AI"},
   "description":"Chat bebas tentang Feri.","mode":"chat","streaming":true,"input_schema":null},
  {"id":"executive_summary","label":{"id":"Ringkasan Eksekutif","en":"Executive Summary"},
   "description":"Ringkasan padat tentang Feri.","mode":"task","streaming":true,
   "input_schema":{"type":"object","properties":{"focus":{"type":"string"}}}},
  {"id":"tailored_pitch","label":{"id":"Pitch Sesuai Kebutuhan","en":"Tailored Pitch"},
   "description":"Tempel JD → kecocokan + pitch.","mode":"task","streaming":true,
   "input_schema":{"type":"object","properties":{"job_description":{"type":"string"}},"required":["job_description"]}}
]
```

---

## 5. API Endpoints

```yaml
GET  /api/agents                  # manifest (lihat §4)
GET  /api/agents/{id}             # detail satu agent (schema lengkap) — opsional
POST /api/agents/{id}/run         # task non-stream
  body: { ...input..., session_id? }
  response: { agent_id, output, citations?, model, created_at }
GET  /api/agents/{id}/stream      # SSE (chat & task) — event token/citation/done/error
```
- Konvensi error: 400 (schema), 404 (agent), 429 (rate limit), 500 (provider).
- Semua response menyertakan `model` & `created_at` (transparansi).

---

## 6. Spesifikasi Teknis

### 6.1 Backend

| Komponen | Teknologi |
|----------|-----------|
| Registry | dict in-memory `id → AgentDefinition` |
| Eksekusi | `agno` Agent dibangun dari definisi saat request |
| Validasi input | Pydantic dari `input_schema` |
| Streaming | FastAPI SSE (shared dgn modul 02) |
| Tools | `read_knowledge` (modul 03), bisa ditambah per-agent |

### 6.2 Prinsip Extensibility

- **Open-Closed**: tambah agent = tambah definisi, tidak ubah handler.
- **Single contract**: FE tidak perlu tahu jenis agent — cukup baca manifest + schema.
- **Tool reuse**: agent berbagi pustaka tool yang sama; tool baru didaftarkan terpisah.

### 6.3 Performance & Keamanan

- Rate limiting per-IP (lindungi biaya OpenRouter) — wajib untuk endpoint run/stream.
- Validasi ketat input (cegah prompt injection lewat field bebas; batasi panjang JD).
- Guardrail scope: semua agent hanya menjawab seputar Feri.

---

## 7. Use Case Scenarios

### 7.1 Skenario — Recruiter Tailored Pitch
**Actor**: Recruiter · **Goal**: cek fit untuk role "LLM Engineer"
```
1. Buka launcher, klik Tailored Pitch
2. Tempel JD role LLM Engineer, pilih EN
3. Stream: match 90%, kekuatan (multi-agent, RAG, eval LLM), project (NETRA, Doc-ETL), gap (production MLOps tooling), pitch paragraph
→ Recruiter yakin, lanjut kontak
```

### 7.2 Skenario — Eksekutif Minta Ringkasan
**Actor**: Calon klien · **Goal**: paham Feri cepat
```
1. Klik Ringkasan Eksekutif, focus="computer vision"
2. Agent baca profile + thesis (CycleGAN, hyperspectral) + project relevan
3. Ringkasan 5 poin + sitasi
→ Konteks cepat untuk meeting
```

### 7.3 Skenario — Developer Menambah Agent
**Actor**: Feri · **Goal**: tambah `project_deepdive`
```
1. Tulis AgentDefinition + registry.register(...)
2. Restart backend
3. /api/agents kini berisi 4 agent → launcher FE menampilkan kartu baru otomatis
→ Tanpa ubah endpoint atau komponen UI
```

---

## 8. Referensi Implementasi

### 8.1 Document-ETL / MA-TAG (project Feri)
**Yang Diadaptasi**: tool registry seragam (35 tool modules) → pola Agent Registry.

### 8.2 MCP Protocol (dipakai Feri)
**Yang Diadaptasi**: kontrak tool self-describing + manifest.

### 8.3 OpenAI/Anthropic tool-calling
**Yang Diadaptasi**: input schema → validasi → eksekusi seragam.

---

*Dokumen ini bagian dari Dokumentasi Implementasi Situs Personal Feri + AI Assistant.*
*Modul: Agent Endpoints | Versi: 1.0.0 | Konsisten dengan `00_OVERVIEW.md`, `02_AI_ASSISTANT.md`, `03_KNOWLEDGE_BASE.md`*
