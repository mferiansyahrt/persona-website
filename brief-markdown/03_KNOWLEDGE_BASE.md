# Modul 03 — Knowledge Base (Agentic File Retrieval)

## 1. Gambaran Umum

Knowledge base adalah **sumber kebenaran** tentang Feri yang dibaca agent saat menjawab. Pendekatannya **agentic file retrieval**: bukan vector DB/RAG, bukan pula context-stuffing penuh. Seluruh fakta dipecah menjadi **file markdown per topik** (CV → `profile.md`, tiap project → satu `.md`), ditambah **manifest `_index.md`** yang dimuat ke system prompt agent. Saat menjawab, agent memilih file relevan dari manifest lalu memanggil tool `read_knowledge(file)` yang melakukan `with open(...)` membaca file itu **on-demand**.

Pendekatan ini tepat karena data Feri **kecil dan statis** — muat di akal sistem tanpa infrastruktur embedding. Keunggulannya: akurat (agent membaca teks asli), murah (tanpa biaya embedding), mudah dirawat (Feri cukup edit markdown), dan transparan (sumber = nama file yang dibuka → langsung jadi sitasi di modul 02).

### 1.1 Tujuan Modul

| Tujuan | Deskripsi |
|--------|-----------|
| Sumber kebenaran tunggal | Semua jawaban AI bersandar pada file di sini |
| Retrieval akurat | Manifest memandu agent memilih file yang tepat |
| Mudah dirawat | Update konten = edit markdown, tanpa ubah kode |
| Aman | Tool baca file dibatasi whitelist folder `knowledge/` |
| Murah & sederhana | Tanpa vector DB / embedding |

### 1.2 Target Pengguna

| Pengguna | Kebutuhan |
|----------|-----------|
| Agent (talk_to_data & lainnya) | Membaca fakta relevan on-demand |
| Feri (maintainer) | Menamb/mengubah konten dengan mudah (markdown) |
| Pengunjung (tidak langsung) | Menerima jawaban grounded + sitasi |

---

## 2. Fitur Utama

### 2.1 Struktur File Knowledge

**Deskripsi**: Markdown terpecah per topik di `source/backend/knowledge/`.

```
source/backend/knowledge/
├── _index.md               ← MANIFEST: daftar file + deskripsi 1 baris (dimuat ke system prompt)
├── profile.md              ← dari M_Feriansyah_Resume.pdf (profil, edukasi, skill, kontak)
├── experience.md           ← pengalaman kerja (Indonesia Indicator, Fiverr, internship)
└── projects/
    ├── command_ai.md            ← dari portofolio_command_ai.html
    ├── netra.md                 ← dari portfolio_netra.html
    ├── cognitive_warfare.md     ← dari portofolio_cw.html
    ├── contextual_intelligence.md
    ├── deep_account_profiling.md
    ├── document_etl.md
    ├── argus_mro.md
    ├── fire_intelligence.md
    ├── acis_lifecycle.md
    ├── veridocs.md
    ├── campaign_alert.md
    └── iterative_data_searcher.md   (12 project total)
```

### 2.2 Manifest `_index.md`

**Deskripsi**: Peta isi knowledge base. Dimuat penuh ke system prompt agent supaya agent **tahu file apa yang ada** dan memilih dengan tepat (tidak menebak nama file).

**Contoh isi `_index.md`:**

```markdown
# Knowledge Base Index — Feri

## Profil & Pengalaman
- `profile.md` — Identitas, pendidikan (M.Sc CS/AI & B.Sc Physics UI), core stack, kontak.
- `experience.md` — Riwayat kerja: Indonesia Indicator (AI Engineer), Fiverr, internship.

## Projects (12)
- `projects/command_ai.md` — Reality Intelligence Platform, civic, WhatsApp-native, 12 agent.
- `projects/netra.md` — Multi-agent defense intelligence (IKKEP), 28 agent, geopolitik.
- `projects/cognitive_warfare.md` — Deteksi isu media 8 platform, 13 agent.
- `projects/contextual_intelligence.md` — Social monitoring, event/issue classification, 2 agent.
- `projects/deep_account_profiling.md` — OSINT profiling 6 platform + vision, 24 agent.
- `projects/document_etl.md` — Table Augmented Generation, NL→SQL→sintesis, 8 agent, MCP.
- `projects/argus_mro.md` — Naval MRO dashboard KRI Brawijaya-320, 3D digital twin.
- `projects/fire_intelligence.md` — Karhutla mapping & prediksi sebaran, 1.076 zona desa.
- `projects/acis_lifecycle.md` — Object monitoring state machine, 4 agent, Kafka.
- `projects/veridocs.md` — Audit dokumen pemerintah (BUMD/APBD), 3 agent, output PDF.
- `projects/campaign_alert.md` — Crisis response 3-tier, 14 agent, auto-post.
- `projects/iterative_data_searcher.md` — Riset PDF agentik, jawaban tersitasi, 7 agent.
```

> Manifest = kunci akurasi. Deskripsi 1 baris harus kaya kata kunci domain (defense/OSINT/finance/dll) agar agent memetakan pertanyaan→file dengan tepat.

### 2.3 Tool `read_knowledge` (dengan Guardrail)

**Deskripsi**: Tool agno yang dipanggil agent untuk membaca file markdown.

```python
KNOWLEDGE_DIR = Path(__file__).parent / "knowledge"   # akar whitelist

def read_knowledge(file: str) -> str:
    """Baca satu file markdown dari knowledge base.
    `file` relatif terhadap knowledge/ (mis. 'projects/netra.md')."""
    # --- GUARDRAIL: cegah path traversal ---
    target = (KNOWLEDGE_DIR / file).resolve()
    if not str(target).startswith(str(KNOWLEDGE_DIR.resolve())):
        raise ValueError("Akses ditolak: di luar folder knowledge.")
    if not target.suffix == ".md" or not target.is_file():
        raise FileNotFoundError(f"File knowledge tidak ditemukan: {file}")
    with open(target, "r", encoding="utf-8") as f:
        return f.read()
```

**Aturan guardrail:**
- Hanya boleh membaca di dalam `knowledge/` (cek `resolve()` + prefix) — blokir `../` traversal.
- Hanya ekstensi `.md`.
- Maksimal file per giliran (mis. 4) — dibatasi di level agent (modul 02).
- File tidak ada → error terstruktur, agent fallback ke `_index.md`/`profile.md`, jangan halusinasi.

### 2.4 Pipeline Konversi (Build-time, sekali)

**Deskripsi**: Script konversi sumber asli → markdown knowledge. Dijalankan sekali (dan saat konten berubah).

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│ portfolio_*.html ×12│────▶│ html→md converter    │────▶│ projects/*.md       │
│ (list_projects/)    │     │ (strip CSS/JS,       │     │                     │
└─────────────────────┘     │  ambil teks bermakna)│     └─────────────────────┘
                            └──────────────────────┘
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│ M_Feriansyah_       │────▶│ pdf→md (pymupdf4llm)  │────▶│ profile.md +        │
│ Resume.pdf          │     │ + kurasi manual       │     │ experience.md       │
└─────────────────────┘     └──────────────────────┘     └─────────────────────┘
                            ┌──────────────────────┐     ┌─────────────────────┐
                            │ generate manifest    │────▶│ _index.md           │
                            └──────────────────────┘     └─────────────────────┘
```

- **HTML→MD**: `markdownify`/`BeautifulSoup` (buang `<style>/<script>`, ambil hero/heading/paragraf/feature/agent/stack). Hasil dirapikan agar ringkas & faktual.
- **PDF→MD**: `pymupdf4llm` (atau Docling) → markdown; lalu **kurasi manual** jadi `profile.md` + `experience.md`.
- **Manifest**: generator membaca judul + 1 baris deskripsi tiap file → `_index.md`.
- Output di-*commit* ke repo (version controlled), ikut deploy ke Render.

---

## 3. Alur Bisnis

### 3.1 Alur Build-time — Membangun Knowledge Base

```
1. Jalankan `python scripts/build_knowledge.py`
2. Konversi 12 HTML → projects/*.md
3. Konversi CV PDF → profile.md + experience.md (kurasi)
4. Generate _index.md dari semua file
5. Review manual (akurasi & ringkas)
6. Commit ke repo
→ Outcome: knowledge/ siap dipakai agent
```

### 3.2 Alur Runtime — Retrieval saat Menjawab

```
┌───────────────────┐   ┌─────────────────────┐   ┌──────────────────────┐
│ 1. Agent terima   │──▶│ 2. Baca _index.md   │──▶│ 3. Pilih file relevan│
│    pertanyaan     │   │ (sudah di context)  │   │ (mis. netra.md)      │
└───────────────────┘   └─────────────────────┘   └──────────┬───────────┘
                                                              │ tool-call
        ┌──────────────────────┐   ┌────────────────────┐    ▼
        │ 6. Jawab + sitasi    │◀──│ 5. Susun jawaban   │ ┌──────────────────┐
        │    (nama file dibuka)│   │    dari isi file   │ │ 4. read_knowledge│
        └──────────────────────┘   └────────────────────┘ │   (guardrailed)  │
                                                           └──────────────────┘
```
**Outcome**: jawaban grounded; file yang dibuka jadi sitasi (modul 02 §2.3).

### 3.3 Edge Cases

| Kasus | Penanganan |
|-------|-----------|
| Pertanyaan butuh banyak file | Agent buka beberapa file (≤ batas), gabungkan; bila >batas, pilih paling relevan |
| File tidak ada / typo nama | Error terstruktur → agent re-cek `_index.md`, jangan mengarang |
| Pertanyaan di luar cakupan | Agent jawab jujur "tidak ada datanya" + arahkan ke topik yang tersedia |
| Konten kedaluwarsa | Feri update markdown + regen `_index.md`; tidak perlu ubah kode |
| File terlalu besar | Saat konversi, pecah per-section bila perlu (mis. project sangat panjang) |

---

## 4. Struktur Data

### 4.1 Format Markdown per Project (konsisten)

Tiap `projects/*.md` mengikuti struktur seragam agar agent mudah mengekstrak:

```markdown
# <Nama Project> (<akronim/arti bila ada>)

**Domain:** <defense | osint | finance | media | docs | ...>
**Tagline:** <satu kalimat>
**Jumlah agent:** <n>

## Apa Ini
<1–2 paragraf>

## Fitur Utama
- ...

## AI Agents
<jumlah + peran ringkas>

## Tech Stack
<bahasa, framework, model, DB, infra>

## Metrik Penting
<angka kunci>
```

### 4.2 Frontmatter (opsional, untuk manifest otomatis)

```yaml
---
id: netra
name: NETRA
domain: defense
agents: 28
tagline: Multi-agent defense intelligence
---
```
> Frontmatter memudahkan generator `_index.md` dan sinkron dengan `projects.json` di FE (modul 01) — satu sumber metadata.

### 4.3 Tabel Inventory File (target)

| File | Sumber | Status |
|------|--------|--------|
| `profile.md` | CV PDF | perlu dibuat |
| `experience.md` | CV PDF | perlu dibuat |
| `projects/*.md` ×12 | `portfolio_*.html` | perlu dibuat |
| `_index.md` | generator | perlu dibuat |

---

## 5. API Endpoints

Knowledge base **tidak** mengekspos endpoint publik (diakses internal oleh agent). Endpoint opsional untuk maintenance/debug:

```yaml
# (opsional, internal/dev only — dilindungi)
GET /api/_debug/knowledge/index      # tampilkan _index.md
GET /api/_debug/knowledge/{file}     # tampilkan isi file (guardrailed)
```

---

## 6. Spesifikasi Teknis

### 6.1 Backend

| Komponen | Teknologi |
|----------|-----------|
| Tool | `read_knowledge` (agno tool) |
| Konversi HTML | BeautifulSoup + markdownify |
| Konversi PDF | pymupdf4llm (atau Docling) |
| Storage | File `.md` di repo (`knowledge/`) |
| Load manifest | Baca `_index.md` saat init agent → inject ke system prompt |

### 6.2 Performance

| Aspek | Catatan |
|-------|---------|
| Baca file | I/O lokal, < 5 ms per file |
| Ukuran manifest | Jaga ringkas (≤ ~1–2 KB) agar hemat token system prompt |
| Caching | File kecil; OS cache cukup. Opsional cache in-memory saat startup |

### 6.3 Keamanan

- Whitelist path (resolve + prefix check), ekstensi `.md` saja.
- Tidak ada user input yang langsung jadi path tanpa validasi.
- Endpoint debug (bila ada) hanya aktif di dev / dilindungi.

---

## 7. Use Case Scenarios

### 7.1 Skenario — Tanya Project Spesifik
**Actor**: Engineer · **Goal**: paham arsitektur NETRA
```
1. "Bagaimana arsitektur NETRA?"
2. Agent baca _index.md → pilih projects/netra.md
3. read_knowledge("projects/netra.md")
4. Jawab: 28 agent, 10 pipeline, dst + sitasi netra.md
→ Akurat, dari teks asli
```

### 7.2 Skenario — Pertanyaan Lintas Project
**Actor**: Recruiter · **Goal**: project mana yang pakai RAG
```
1. "Project mana yang pakai RAG / retrieval?"
2. Agent cek _index.md → buka document_etl.md, iterative_data_searcher.md
3. Bandingkan, jawab + 2 sitasi
→ Sintesis lintas file dalam batas aman
```

### 7.3 Skenario — Update Konten
**Actor**: Feri · **Goal**: tambah project baru
```
1. Tambah file projects/new_project.md (+ frontmatter)
2. Jalankan generator → _index.md ter-update
3. Commit & deploy
→ Agent langsung bisa menjawab tentang project baru, tanpa ubah kode
```

---

## 8. Referensi Implementasi

### 8.1 Document-ETL / Iterative Data Searcher (project Feri)
**Yang Diadaptasi**: pola retrieval on-demand + jawaban tersitasi dari sumber.

### 8.2 MCP tool pattern (project Feri)
**Yang Diadaptasi**: tool terdefinisi rapi dengan kontrak jelas + guardrail.

### 8.3 Agentic file-reading (umum)
**Yang Diadaptasi**: manifest + read-tool sebagai alternatif murah untuk korpus kecil (pengganti RAG vektor).

---

*Dokumen ini bagian dari Dokumentasi Implementasi Situs Personal Feri + AI Assistant.*
*Modul: Knowledge Base | Versi: 1.0.0 | Konsisten dengan `00_OVERVIEW.md`, `02_AI_ASSISTANT.md`*
