# Design System — Situs Personal Feri (Warm Dark · Conversational-First)

> Disintesis dari deep research (Material Design, MDN, WebAIM, Figma, Awwwards case studies, blog desain 2025–2026 — lolos verifikasi adversarial). Tanggal: 2026-06-28.

---

## 0. Arah Visual (north star)

**"Warm, calm, human-yet-technical."** Bukan platform intelijen yang dingin — ini orang. Lima prinsip dari riset:

1. **Calm over spectacle.** Tren 2026 = antarmuka tenang, mengurangi overstimulasi. Restraint > dekorasi.
2. **Motion menjelaskan, bukan pamer.** Micro-interaction fungsional (state, progress), bukan hiasan.
3. **Transparent AI.** AI assistant menunjukkan sumber + model + confidence. "Interface yang menyembunyikan logikanya terasa mengelak, bukan canggih." → kunci kepercayaan talk-to-data.
4. **Aksesibilitas = infrastruktur**, bukan fitur tambahan.
5. **Identitas: warm serif moment + technical mono.** Sisi manusia (serif/hangat) + sisi engineer (mono presisi).

Referensi estetik utama: **Isabel Moranta** (Awwwards SOTD — premium+warm di dark, noise bg, serif+mono), **Conversational AI Portfolio** (Awwwards — conversational-first), **Josh W Comeau** (#0d0f12 + accent coral hangat), **Brittany Chiang** (dark dev + accent teal).

---

## 1. Palette — Warm Dark (hex final)

Background **bercast hangat (cokelat/amber tipis)**, bukan navy dingin. Tidak ada pure-black, tidak ada pure-white (hindari halation).

```css
:root{
  /* Surfaces — warm near-black, elevasi via warna (bukan border) */
  --bg:          #15110C;   /* base — warm charcoal, cast amber tipis */
  --surface-1:   #1E1812;   /* card / panel                          */
  --surface-2:   #29211A;   /* elevated (chat bubble AI, modal)      */
  --border:      #3A2F24;   /* hairline hangat (kontras non-text 3:1)*/

  /* Text — warm off-white, hierarki via opacity */
  --text:        #F5EFE7;   /* primary  (~14:1 di --bg → AAA)        */
  --muted:       #B7AC9B;   /* secondary(~7:1  → AAA large / AA body)*/
  --dim:         #8A7F6F;   /* tertiary / hint                       */

  /* Accent — AMBER hangat (brand) */
  --accent:      #F5A524;   /* amber — 8.9:1 di dark → AAA           */
  --accent-soft: #2A2114;   /* amber 8% di atas bg (chip/hover bg)   */
  --accent-2:    #F97316;   /* coral/terracotta — companion gradient */

  /* AI accent — teal lembut, KHUSUS elemen AI (purposeful, bukan dekor) */
  --ai:          #2DD4BF;   /* sinyal "ini AI" — desaturasi ~80%     */

  /* State */
  --ok:#34D399; --warn:#FBBF24; --err:#F87171;
}
```

**Aturan dari riset:**
- Desaturasi accent 10–20% (70–80% saturation) → warna tidak "bergetar" di dark & lolos 4.5:1.
- Elevasi = surface lebih terang berlapis (overlay putih tipis), **bukan** shadow tebal/border.
- Verifikasi tiap pasangan di WebAIM Contrast Checker. Target: AA 4.5:1 (teks), AAA 7:1 bila bisa; non-text (focus ring, border, ikon) 3:1.

### 1b. Light Theme (companion — warm, bukan putih steril)

Dark = default & identitas utama. Light = companion via toggle. Arsitektur token bikin ini murah: swap nilai di `[data-theme="light"]`.

```css
[data-theme="light"]{
  --bg:          #FBF7F0;   /* warm off-white (bukan pure white)      */
  --surface-1:   #FFFFFF;   /* card                                   */
  --surface-2:   #F4ECDF;   /* elevated / chat bubble AI              */
  --border:      #E5DAC7;   /* hairline hangat                        */

  --text:        #2A2118;   /* warm near-black (~13:1 di --bg → AAA)  */
  --muted:       #6B5F4E;   /* secondary (~5.5:1 → AA)                */
  --dim:         #9A8C77;

  --accent:      #F5A524;   /* amber tetap untuk FILL tombol          */
  --accent-ink:  #B45309;   /* amber gelap untuk TEKS/LINK (≥4.5:1)   */
  --accent-soft: #FBEAD0;   /* bg chip/hover amber muda               */
  --accent-2:    #EA580C;   /* coral gelap utk teks (kontras cukup)   */

  --ai:          #0D9488;   /* teal gelap — KHUSUS elemen AI di light  */

  --ok:#15803D; --warn:#B45309; --err:#DC2626;
}
```

**Aturan penting light theme:**
- **Amber `#F5A524` hanya untuk fill** (tombol/badge) dengan teks gelap di atasnya — JANGAN untuk teks di atas putih (gagal kontras ~1.9:1).
- Teks/link aksen → pakai `--accent-ink` (`#B45309`, amber-700), lolos AA di atas `--bg`.
- Tambah token `--accent-ink` juga di dark theme (= `--accent` `#F5A524`) supaya komponen pakai satu variabel lintas tema.

**Strategi toggle:**
- Default mengikuti `prefers-color-scheme` user, dengan **toggle manual** yang menimpa + disimpan di `localStorage`.
- Implementasi: atribut `data-theme` di `<html>`; semua komponen baca CSS var → otomatis ikut.
- Hormati `color-scheme: dark light` untuk form control native.

---

## 2. Tipografi (Google Fonts, gratis)

| Peran | Font | Alasan |
|-------|------|--------|
| Display / Heading | **Space Grotesk** | geometric, "tech-forward", pas untuk AI/startup |
| Body / UI | **Inter** | x-height tinggi, aperture terbuka — best body sans GFonts |
| Mono / kode / label | **JetBrains Mono** | mono coding terbaik, ligatur, disambiguasi karakter |
| (Opsional) serif moment | **Instrument Serif / Fraunces** | 1 momen hangat di hero (sisi "manusia") |

**Skala tipe (modular ratio 1.25 — major third):**
```
--fs-xs: 0.8rem    /* 12.8px — caption, label mono */
--fs-sm: 0.9rem    /* 14.4px */
--fs-base:1.0625rem/* 17px   — body, line-height 1.6 */
--fs-lg: 1.25rem
--fs-xl: 1.563rem
--fs-2xl:1.953rem
--fs-3xl:2.441rem
--fs-4xl:3.052rem  /* hero headline */
```
- Body 16–18px / line-height 1.6 ; panjang baris 45–75 karakter (chat 65–72).
- Naikkan weight body *sedikit* di dark mode (jangan bold semua).
- Loading: WOFF2 + subset, `font-display:swap`, `preconnect`; self-host bila bisa. Variable font hanya jika butuh ≥3 weight.

---

## 3. Spacing, Radius, Shadow

```css
:root{
  /* Spacing — base 4px */
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px;
  --s-5:24px; --s-6:32px; --s-8:48px; --s-10:64px; --s-12:96px;

  /* Radius — membulat = friendly */
  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:24px; --r-full:999px;

  /* Shadow — lembut & hangat (jangan keras) */
  --shadow-sm: 0 1px 2px rgba(0,0,0,.4);
  --shadow-md: 0 6px 24px rgba(0,0,0,.35);
  --glow-accent: 0 0 0 1px var(--accent-soft), 0 8px 32px rgba(245,165,36,.10);
}
```

---

## 4. Chat AI — spesifikasi (centerpiece)

**Streaming & responsiveness (SSE):**
- Stream token-by-token via SSE. **Time-to-first-token < 800ms.**
- Typing/thinking indicator muncul < 300ms (blinking caret = sinyal minimal "hidup").
- Render token tiap 30–60ms; **stabilkan layout** supaya teks tidak melompat saat streaming.
- **Tombol Stop/Cancel wajib** selama generasi.

**Status & error:**
- Tiap pesan punya `status`: `pending | streaming | final | failed` (drive retry/abort).
- Error spesifik (provider / limit konteks / input) — bukan satu pesan generik. Lebih baik tanya klarifikasi ("Maksud Anda X atau Y?").
- Pertahankan konteks percakapan (jangan paksa restart).

**Suggested prompt chips (empty state):**
- **3–5 chip**, spesifik bukan generik. Contoh bagus:
  - "Apa pengalaman Feri dengan multi-agent systems?"
  - "Project mana yang cocok untuk role fintech?"
  - "Ringkas latar belakang Feri dalam 3 poin"
- Chip harus bisa di-dismiss.

**Citation & trust:**
- Jawaban faktual **wajib sitasi** (link ke file knowledge / project) — top 3–5 sumber, jangan banjir.
- Pola: nomor sitasi inline → kartu sumber yang bisa di-expand.
- Tampilkan **nama model** di tiap pesan AI (transparansi). Indikator confidence + progressive disclosure reasoning.

**Layout:**
- Max-width pesan ~768px (rujukan Claude.ai). Tap target mobile ≥44px. Keyboard tidak menutup composer.
- Bubble AI pakai `--surface-2` + sentuhan `--ai` (border/ikon) supaya jelas "ini AI".

**Aksesibilitas chat:**
- Bungkus area streaming dengan `aria-live="polite"` → screen reader umumkan saat user idle; composer tetap fokus.

**Anti-pattern:** animasi mengetik palsu yang *memperlambat* model cepat; chip tak bisa ditutup; error generik.

---

## 5. Layout & Micro-interaction

- **Hero conversational-first** (chat = bintang, lihat brief layout) + foto profil dengan **blur-on-rest → sharp-on-hover** (reveal bermakna, bukan dekor).
- **Noise/grain texture** halus di background — masih segar 2026 (intensitas bisa ikut kecepatan mouse, à la Isabel Moranta).
- Hover state **hanya menerangkan sedikit** (lighten), bukan transform berlebihan.
- **Glassmorphism**: hemat & purposeful saja (depth pada card/chat surface) — bukan hiasan; trend mentah sudah klise.
- Project card: grid, filter per domain (defense/OSINT/finance), tiap card punya tombol **"Tanya AI tentang ini"** → jembatan konten↔AI.
- Elevasi via warna surface, bukan border tebal.

---

## 6. Aksesibilitas & Performa

- Kontras: AA 4.5:1 / non-text 3:1, target AAA 7:1; jaga di semua level elevasi.
- Hindari halation: off-white di near-black, jangan pure white/black.
- **`prefers-reduced-motion: reduce`** → ganti scale/parallax dengan opacity fade + durasi pendek (jangan matikan semua, *kurangi*). Baseline aman sejak 2020.
- Font: WOFF2, subset, `swap`, preconnect/self-host.
- Dark theme: hemat baterai OLED, premium bila dieksekusi rapi.

---

## 7. Token siap pakai (ringkas untuk implementasi React/CSS)

Semua token di atas → taruh di `source/frontend/src/styles/tokens.css` sebagai CSS custom properties, konsumsi via Tailwind theme extend atau CSS vanilla. Font via `<link preconnect>` + `font-display:swap`.

---

*Bagian dari brief situs personal Feri. Lihat `_DISCUSSION_LOG.md`.*
