# Modul 01 — Frontend Web

## 1. Gambaran Umum

Frontend adalah situs personal Feri berbasis **React + TypeScript + CSS (Vite)** yang di-deploy ke Netlify. Filosofinya **conversational-first**: AI Assistant bukan widget pojok, melainkan **bintang utama** di hero — pengunjung diajak bertanya sejak detik pertama. Konten statis (profil, 12 project, skill) tetap tersedia sebagai cara menjelajah klasik, dan setiap project terhubung balik ke AI ("Tanya AI tentang ini"), sehingga membaca dan bertanya menuju data yang sama.

Modul ini murni *presentation layer*: ia mengonsumsi REST + SSE dari backend (modul 05) dan tidak menyimpan data otoritatif apa pun selain preferensi UI (tema) dan id sesi chat di `localStorage`. Seluruh tampilan **wajib** memakai token dari `DESIGN_SYSTEM.md` (warm dark default + light companion).

### 1.1 Tujuan Modul

| Tujuan | Deskripsi |
|--------|-----------|
| Conversational-first | Menjadikan chat AI sebagai titik interaksi utama di hero |
| Friendly & premium | Warm dark theme, calm, human-yet-technical (sesuai deep research) |
| Jembatan konten ↔ AI | Project gallery yang bisa dibaca manual atau ditanyakan ke AI |
| Aksesibel & cepat | WCAG AA, reduced-motion, font loading optimal, mobile-first |
| Dark + Light | Toggle tema yang mulus, default ikut preferensi OS |

### 1.2 Target Pengguna

| Pengguna | Kebutuhan |
|----------|-----------|
| Recruiter / HR | Cepat menilai kecocokan Feri dengan role; ingin ringkasan & jawaban langsung |
| Calon klien | Memahami kapabilitas & project relevan dengan kebutuhan mereka |
| Sesama engineer / kolaborator | Menelusuri detail teknis project & stack |
| Feri sendiri | Mudah memperbarui konten (lewat knowledge base) tanpa ubah kode FE |

---

## 2. Fitur Utama

### 2.1 Hero Conversational-First

**Deskripsi**: Layar pembuka. Sapaan hangat orang-pertama + AI chat sebagai elemen dominan, dengan suggested prompt chips agar pengunjung langsung tahu apa yang bisa ditanya.

**Komponen Visual**:

| Komponen | Tipe | Data | Update |
|----------|------|------|--------|
| Greeting | Teks (serif moment) | Statis | - |
| Foto profil | Image (blur→sharp on hover) | Statis | - |
| Chat box | Input + stream area | API `/api/agents/talk_to_data/stream` | SSE real-time |
| Prompt chips | Button (3–5, dismissible) | Statis/manifest | - |
| Theme toggle | Switch | `localStorage` | On click |

**Layout Dashboard (desktop ≥1024px)**:

```
┌────────────────────────────────────────────────────────────────────┐
│  ● Feri                              [Projects] [About] [☀/☾ toggle] │  ← navbar (sticky, blur)
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────┐    Hai, saya Feri 👋                                  │
│   │  [foto]  │    AI/ML Engineer — bikin sistem multi-agent          │  ← serif moment
│   │ blur→    │    yang andal di produksi.                            │
│   │  sharp   │                                                       │
│   └──────────┘    Tanya apa saja tentang saya ke AI di bawah ↓       │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐ │
│   │  ╭────────────────────────────────────────────────────────╮  │ │
│   │  │  💬  Tanya apa pun tentang Feri...                       │  │ │  ← chat input
│   │  ╰────────────────────────────────────────────────────────╯  │ │     (accent ring on focus)
│   │                                                               │ │
│   │  Coba:                                                        │ │
│   │  [ Pengalaman multi-agent? ] [ Project untuk fintech? ]       │ │  ← 3–5 chips
│   │  [ Ringkas latar belakang ]                                   │ │     (dismissible)
│   └──────────────────────────────────────────────────────────────┘ │
│                                                                      │
│                         ↓ scroll untuk jelajah                       │
└────────────────────────────────────────────────────────────────────┘
   bg=#15110C · accent ring=#F5A524 · chip bg=--accent-soft · noise grain halus
```

> Saat user mengirim pesan pertama, area hero **berekspansi** menjadi panel chat penuh (lihat modul 02 untuk detail chat UI & streaming). Konten di bawah tetap dapat diakses via scroll/navbar.

### 2.2 Project Gallery

**Deskripsi**: Galeri 12 project dengan filter domain. Tiap kartu ringkas + dua aksi: buka detail, atau tanya AI tentang project itu.

**Komponen**:

| Header | Tipe | Sumber |
|--------|------|--------|
| Filter chips domain | Button group | Statis (defense/OSINT/finance/media/dll) |
| Project card | Card grid (responsive) | `projects.json` (di-bundle FE) |
| Aksi kartu | Button ×2 | "Detail" + "Tanya AI" |

**Layout (desktop, grid 3 kolom)**:

```
┌────────────────────────────────────────────────────────────────────┐
│  🗂️  Projects                                                        │
│  [ Semua ] [ Defense ] [ OSINT ] [ Finance ] [ Media ] [ Docs ]     │  ← filter (accent saat aktif)
├────────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │ NETRA          │  │ Cognitive War  │  │ Command AI     │         │
│  │ Defense · 28 ag│  │ Media · 13 ag  │  │ Civic · 12 ag  │         │  ← badge domain+agents
│  │                │  │                │  │                │         │
│  │ Multi-agent    │  │ Deteksi isu    │  │ Reality intel  │         │
│  │ defense intel  │  │ 8 platform     │  │ WhatsApp-native│         │
│  │                │  │                │  │                │         │
│  │ [Detail][🤖Ask]│  │ [Detail][🤖Ask]│  │ [Detail][🤖Ask]│         │
│  └────────────────┘  └────────────────┘  └────────────────┘         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │ DAPE  ...       │  │ Document-ETL ..│  │ ARGUS MRO  ... │         │
│  └────────────────┘  └────────────────┘  └────────────────┘         │
│                          ... (12 total)                              │
└────────────────────────────────────────────────────────────────────┘
   card bg=--surface-1 · hover: lighten + glow-accent tipis · radius=--r-lg
```

**Interaksi**:
- **Hover card**: surface menerang sedikit (`--surface-1`→ lebih terang) + soft glow accent. Bukan transform berlebihan (sesuai prinsip "calm" deep research).
- **Filter**: klik domain → grid memfilter (animasi opacity, hormati reduced-motion).
- **"🤖 Ask"**: membuka chat (modul 02) dengan konteks pre-fill, mis. *"Ceritakan tentang project NETRA"* → agent tool-call ke `netra.md`.
- **"Detail"**: membuka panel/route detail project (ringkasan dari `projects.json`; detail mendalam tetap via AI agar konsisten satu sumber).

### 2.3 Snapshot / About

**Deskripsi**: Ringkasan profil singkat (bukan dump CV) — pendidikan UI, role di Indonesia Indicator, core stack. Memberi konteks bagi yang lebih suka skim daripada bertanya.

```
┌────────────────────────────────────────────────────────────────────┐
│  📌 Snapshot                                                         │
│                                                                      │
│  🎓 M.Sc. Computer Science (AI) & B.Sc. Physics — Univ. Indonesia    │
│  💼 AI Engineer @ Indonesia Indicator (2025–now)                     │
│  🛠️  Python · asyncio · multi-agent/MCP · RAG · React · Postgres     │
│                                                                      │
│  [ 🤖 Tanya detail apa pun ke AI ]                                   │  ← CTA balik ke chat
└────────────────────────────────────────────────────────────────────┘
```

### 2.4 Theme Toggle (Dark ⇄ Light)

**Deskripsi**: Tombol di navbar. Default mengikuti `prefers-color-scheme`; pilihan manual menimpa + tersimpan di `localStorage`. Diterapkan via atribut `data-theme` di `<html>` (semua komponen baca CSS variable).

```
[☾ Dark]  ⇄  [☀ Light]      transisi warna 200ms (skip jika reduced-motion)
```

---

## 3. Alur Bisnis (User Flow Experience)

### 3.1 Alur Utama — Recruiter Menilai Kecocokan (happy path)

**Actor**: Recruiter/HR
**Trigger**: Membuka situs dari link di CV/LinkedIn Feri
**Goal**: Menilai apakah Feri cocok untuk role yang sedang dibuka

```
┌──────────────┐    ┌──────────────────┐    ┌────────────────────┐
│ 1. Buka situs│───▶│ 2. Lihat hero +  │───▶│ 3. Klik chip       │
│    (landing) │    │    sapaan hangat │    │ "Project fintech?" │
└──────────────┘    └──────────────────┘    └─────────┬──────────┘
                                                       │ SSE stream
                    ┌──────────────────┐    ┌──────────▼──────────┐
                    │ 6. Putuskan      │◀───│ 4. AI jawab grounded│
                    │    lanjut/kontak │    │    + sitasi project  │
                    └──────────────────┘    └──────────┬──────────┘
                              ▲                         │
                    ┌─────────┴────────┐    ┌───────────▼─────────┐
                    │ 5b. Jalankan     │◀───│ 5. Klik sitasi →    │
                    │ tailored_pitch   │    │ buka detail project  │
                    │ (tempel JD)      │    │ atau tanya lanjutan  │
                    └──────────────────┘    └─────────────────────┘
```
**Outcome**: Recruiter dapat jawaban spesifik + bukti project dalam < 1 menit, lalu menuju kontak atau menjalankan `tailored_pitch` dengan menempel job description.

### 3.2 Alur — Jelajah Project Manual

**Actor**: Sesama engineer
**Trigger**: Lebih suka membaca daripada bertanya

```
1. Scroll ke Project Gallery
2. Filter domain (mis. "Defense")
3. Hover kartu → baca ringkasan
4. Klik "Detail" → panel ringkas, ATAU klik "🤖 Ask" → chat dengan konteks project
5. (opsional) Lanjut tanya teknis ke AI → agent buka file .md project terkait
→ Outcome: pemahaman mendalam tanpa harus membaca semua halaman
```

### 3.3 Alur — Ganti Tema

```
1. Klik toggle ☀/☾ di navbar
2. data-theme di <html> berubah → CSS var swap (transisi 200ms)
3. Preferensi disimpan di localStorage
→ Kunjungan berikutnya: tema mengikuti pilihan tersimpan (fallback: prefers-color-scheme)
```

### 3.4 Edge Cases

| Kasus | Penanganan UI |
|-------|---------------|
| Backend cold start (Render) | Skeleton + pesan ramah: "AI sedang bangun tidur sebentar… ⏳" (bukan spinner kosong) |
| SSE gagal / putus | Tampilkan status `failed` + tombol "Coba lagi"; konteks chat dipertahankan |
| User offline | Banner non-blocking; konten statis (gallery, snapshot) tetap tampil |
| JS disabled / SEO bot | Render fallback statis berisi profil + daftar project (progressive enhancement) |
| reduced-motion aktif | Matikan parallax/blur-reveal/noise-motion → ganti fade pendek |

---

## 4. Struktur Data (Frontend State)

Frontend tidak punya database; hanya state lokal + tipe data yang dikonsumsi dari API. Tipe TypeScript inti:

```typescript
// projects.json — di-bundle bersama FE (sumber: katalog 12 project)
interface Project {
  id: string;              // "netra"
  name: string;            // "NETRA"
  domain: Domain;          // "defense" | "osint" | "finance" | "media" | "docs" | ...
  agents: number;          // 28
  tagline: string;         // "Multi-agent defense intelligence"
  summary: string;         // ringkas 1–2 kalimat
  stack: string[];         // ["FastAPI","OpenRouter",...]
  knowledgeFile: string;   // "projects/netra.md" → dipakai utk "Ask AI" & sitasi
}

// Manifest agent dari backend GET /api/agents (lihat modul 04)
interface AgentManifest {
  id: string;              // "talk_to_data" | "executive_summary" | "tailored_pitch"
  label: { id: string; en: string };
  description: string;
  mode: "chat" | "task";
  streaming: boolean;
  inputSchema?: JSONSchema;
}

// Pesan chat (selaras modul 02)
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "pending" | "streaming" | "final" | "failed";
  citations?: Citation[];
  model?: string;          // ditampilkan utk transparansi
}
```

**State management** (Zustand, ringan):
- `useThemeStore` — tema aktif (persist localStorage).
- `useChatStore` — pesan, status streaming, sessionId (persist sessionId di localStorage).
- `useAgentsStore` — manifest agent (fetch sekali dari `/api/agents`).

---

## 5. API Endpoints (yang dikonsumsi)

Frontend hanya **mengonsumsi**; definisi otoritatif ada di modul 04 & 05.

```yaml
GET  /api/agents                      # manifest → render launcher & chips
POST /api/agents/{id}/run             # task non-stream (mis. executive_summary)
GET  /api/agents/{id}/stream          # SSE chat & task streaming
GET  /api/health                      # cek backend hidup (utk pesan cold-start)
# Catatan: sessionId dikirim sebagai query/body untuk kontinuitas history.
```

---

## 6. Spesifikasi Teknis

### 6.1 Frontend Requirements

| Komponen | Library | Versi |
|----------|---------|-------|
| Framework | React | 18.x (atau 19) |
| Bahasa | TypeScript | 5.x |
| Build tool | Vite | 5.x |
| Routing | React Router | 6/7 (atau single-page anchor) |
| State | Zustand | 4.x |
| Styling | CSS variables (vanilla) + util classes | — |
| Markdown render | react-markdown | latest (untuk jawaban AI) |
| Icons | lucide-react | latest |
| SSE | Native `EventSource` / `fetch` + ReadableStream | — |

> Catatan: styling cukup CSS variables sesuai `DESIGN_SYSTEM.md`. Tailwind opsional — jika dipakai, map token ke `theme.extend`. Hindari dependency UI berat agar bundle ramping.

### 6.2 Performance Requirements

| Metrik | Target | Ukuran |
|--------|--------|--------|
| Initial Load | < 3 detik | Lighthouse |
| Time to Interactive | < 5 detik | Lighthouse |
| First contentful paint | < 1.5 detik | Lighthouse |
| Bundle JS (gzip) | < 200 KB awal | build report |
| Font load | swap, tanpa FOIT | DevTools |

### 6.3 Font & Asset Loading

- Google Fonts: Space Grotesk, Inter, JetBrains Mono (+ Instrument Serif opsional).
- `preconnect` ke fonts + `font-display: swap`; subset; prefer WOFF2; pertimbangkan self-host.
- Foto profil: format modern (WebP/AVIF) + lazy-load + `prefers-reduced-motion` mematikan efek blur-reveal.
- Noise/grain: CSS/SVG ringan atau canvas hemat; intensitas mengikuti mouse hanya bila motion diizinkan.

### 6.4 Aksesibilitas

- Kontras AA (4.5:1 teks / 3:1 non-text) di kedua tema — verifikasi WebAIM.
- `prefers-reduced-motion: reduce` → fade pendek, tanpa parallax/scale besar.
- Fokus keyboard terlihat (focus ring accent, kontras ≥3:1); semua aksi bisa via keyboard.
- Area chat streaming `aria-live="polite"` (detail modul 02).
- Tap target mobile ≥44×44px.

---

## 7. Use Case Scenarios

### 7.1 Skenario Pemakaian Rutin — Tanya Cepat
**Actor**: Recruiter
**Goal**: Tahu pengalaman multi-agent Feri

```
1. Buka situs, lihat hero
2. Klik chip "Pengalaman multi-agent?"
3. AI streaming menjawab + sitasi (Command AI, NETRA, Campaign Alert)
4. Klik sitasi NETRA → detail
5. Puas, klik kontak
→ < 1 menit dari buka sampai keputusan
```

### 7.2 Skenario Edge — Backend Cold Start
**Actor**: Pengunjung pertama setelah backend idle
**Goal**: Tetap dapat pengalaman baik meski BE lambat bangun

```
1. Kirim pesan pertama
2. FE cek /api/health → belum siap
3. Tampilkan pesan ramah "AI sedang bangun tidur… ⏳" + skeleton
4. Saat siap, stream jawaban normal
→ Tidak ada spinner kosong yang membingungkan
```

### 7.3 Skenario — Mobile, Light Mode
**Actor**: Pengunjung mobile siang hari
**Goal**: Membaca nyaman di bawah sinar matahari

```
1. OS dalam light mode → situs default light (warm off-white)
2. Hero menumpuk vertikal (foto atas, chat bawah)
3. Chips horizontal-scroll
4. Chat full-width, composer sticky di atas keyboard
→ Terbaca jelas, accent amber dipakai sebagai fill (teks pakai --accent-ink)
```

---

## 8. Wireframe — Varian Mobile (≤640px)

```
┌─────────────────────┐
│ ● Feri        ☀/☾   │  ← navbar
├─────────────────────┤
│      [ foto ]       │
│  Hai, saya Feri 👋   │
│  AI/ML Engineer     │
│                     │
│ ╭─────────────────╮ │
│ │💬 Tanya tentang │ │  ← chat input
│ │   Feri...       │ │
│ ╰─────────────────╯ │
│ [Multi-agent?]→     │  ← chips scroll-x
│                     │
│   ↓ jelajah         │
├─────────────────────┤
│ 🗂️ Projects         │
│ [Semua][Defense]→   │  ← filter scroll-x
│ ┌─────────────────┐ │
│ │ NETRA · 28 ag   │ │  ← card 1 kolom
│ │ [Detail][🤖Ask] │ │
│ └─────────────────┘ │
└─────────────────────┘
```

---

## 9. Referensi Implementasi

### 9.1 Conversational AI Portfolio (Awwwards)
**Yang Diadaptasi**: hero conversational-first; chat sebagai interaksi utama portfolio.

### 9.2 Isabel Moranta (Awwwards SOTD)
**URL**: tympanus.net/codrops/2024/12/05/case-study-isabel-moranta-portfolio-2024
**Yang Diadaptasi**: warm-on-dark premium, serif moment + mono, noise texture, blur-reveal foto (purposeful, bukan dekor).

### 9.3 Josh W Comeau / Brittany Chiang
**Yang Diadaptasi**: pola dark dev-portfolio dengan accent hangat; hierarki bersih, restraint.

---

*Dokumen ini bagian dari Dokumentasi Implementasi Situs Personal Feri + AI Assistant.*
*Modul: Frontend Web | Versi: 1.0.0 | Konsisten dengan `DESIGN_SYSTEM.md` & `00_OVERVIEW.md`*
