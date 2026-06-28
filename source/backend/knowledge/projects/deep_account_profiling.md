---
id: deep_account_profiling
name: Deep Account Profiling Engine (DAPE)
domain: osint
agents: 24
tagline: OSINT profiling lintas 6 platform + vision + risk scoring
---

# Deep Account Profiling Engine (DAPE)

**Domain:** OSINT / risk assessment
**Tagline:** Sistem multi-agent yang menganalisis jejak digital seseorang dan menyusun profil risiko dalam hitungan menit.
**Jumlah agent:** 24

## Apa Ini
Sistem AI multi-agent yang menganalisis jejak digital seseorang lintas 6 platform media sosial dan menghasilkan profil risiko komprehensif dalam beberapa menit — untuk due diligence, investigasi, dan risk scoring.

## Fitur Utama
- Koleksi data lintas platform via RapidAPI (Instagram, TikTok, X, Facebook, YouTube, LinkedIn) dengan normalizer per platform.
- Analisis Vision AI untuk semua citra post (deskripsi konten, biometrik).
- 24 agent paralel untuk profiling, scoring, riset rekam jejak, dan analisis visual.
- Scoring deterministik: Digital Risk Score (6 aspek) + Potential Positive Score (6 aspek).
- Riset rekam jejak otonom via Google Search & Brave Search.
- Enrichment dari 3 sumber + deteksi afiliasi & analisis relasi.

## AI Agents (24)
Tier profiling (Parser, Analysis, Post Activity, Affiliation, Fact Check, Knowledge Repo), scoring & criminal-research agents, visual & summary agents.

## Tech Stack
Python, AsyncIO, FastAPI; GPT-4.1-mini, Gemini 2.5 Flash; Elasticsearch, Redis; Kafka; RapidAPI (6 platform), Google/Brave Search; Vision Language Model.

## Metrik Penting
24 agent · 6 platform · ~5 menit/analisis · 12 aspek penilaian · 5 model · 3 search engine.
