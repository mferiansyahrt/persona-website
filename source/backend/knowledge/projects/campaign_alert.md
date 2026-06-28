---
id: campaign_alert
name: Campaign Alert Agent
domain: crisis
agents: 14
tagline: Crisis response pipeline 3-tier (Normal/Crisis/War)
---

# Campaign Alert Agent — AI-Powered Crisis Response Pipeline

**Domain:** Crisis response / strategic communication
**Tagline:** Mendeteksi isu, menentukan urgensi, dan men-generate aksi komunikasi strategis otomatis.
**Jumlah agent:** 14

## Apa Ini
Menerima isu media sosial terdeteksi dari Cognitive Warfare Engine, menganalisis ulang dari perspektif klien institusional (Polri, TNI, BSSN, dll), menghitung urgensi, dan men-generate rekomendasi balasan & campaign plan untuk 10+ instansi pemerintah.

## Fitur Utama
- Menerima stream main_issue_id dari Elasticsearch tiap 60 menit (hingga 100/klien).
- Dedup event (cap 7 unik) untuk cegah sentiment skew.
- Refinement sentimen dari perspektif mandat klien (in/out-of-scope).
- Gate urgency filter (skor <70 menghentikan pipeline).
- 3 tier keputusan: Normal (0–39), Crisis (40–79), War (80–100, auto-post).
- Velocity-based action decision; rekomendasi post per platform; precision scoring 5 dimensi + PDF.

## AI Agents (14)
Event Dedup, Sentiment Refinement, Filtering Issue Campaign, Summary Description, Jurisdiction Extraction, Monitoring Decision, Action Decision, Action Detail, Campaign Planner, Key Profiles Extraction, Chronological Timeline, Event Chrono Timeline, Platform Post Recommendation, Precision Scoring.

## Tech Stack
Python, AsyncIO, FastAPI; Deepseek-v4 / OpenAI-compatible; Brave Search; Elasticsearch (6 indeks), Redis, Kafka (3 topik output); integrasi Campaign API (auto-post).

## Metrik Penting
14 agent · 3 tier urgensi · 10+ klien institusional · 6 indeks ES · 3 topik Kafka · ~60 detik/isu.
