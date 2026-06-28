---
id: argus_mro
name: ARGUS MRO
domain: defense
agents: 1
tagline: Naval MRO dashboard KRI Brawijaya-320 + 3D digital twin
---

# ARGUS MRO Dashboard — KRI Brawijaya-320

**Domain:** Pertahanan (naval MRO)
**Tagline:** Decision support untuk kesiapan kapal & lifecycle komponen.
**Jumlah agent:** 1 (ArgusAgent, 21 tools)

## Apa Ini
Dashboard decision-support untuk visibilitas real-time status maintenance frigate kelas PPA (KRI Brawijaya-320), prioritisasi perbaikan, dan kapabilitas tempur lintas 6 dimensi kesiapan. Menjembatani data kondisi kapal dengan keputusan strategis.

## Fitur Utama
- 8 halaman dashboard modular (Ringkasan Kesiapan, Status Sistem, MRO Plan, Logistik, SEWACO, Analisis Tempur, Fault Reports, Digital Twin).
- Inventory 488 komponen + scoring kesiapan tempur 6 dimensi (TC ~98% vs CRS ~58%).
- 3D Digital Twin interaktif dengan hotspot komponen kritis P1.
- AI assistant multi-mode (INTERNAL/SPECIFIC/GENERAL) + chat SSE.
- 21 AI tools (lookup komponen, cross-ref amunisi, analisis gap FFBNW).
- Per-page tool scoping untuk respons kontekstual.

## AI Agents (1)
ArgusAgent dengan 21 tools + LLM fallback chain.

## Tech Stack
React 19, TypeScript, Vite 5, React Router v7, Zustand, Three.js; FastAPI, SQLite, Redis; gpt-4o-mini → OpenRouter Llama 3.3 → vLLM gpt-oss-20b; Brave Search, SSE; Nginx, postMessage IPC.

## Metrik Penting
488 komponen · 230 dimensi-detail · 21 tools · 3 mode · 6 dimensi kesiapan · 8 modul dashboard.
