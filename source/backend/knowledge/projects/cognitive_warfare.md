---
id: cognitive_warfare
name: Cognitive Warfare Engine
domain: media
agents: 13
tagline: Deteksi isu media sebelum eskalasi
---

# Cognitive Warfare Engine — Platform Intelijen Isu Berbasis AI

**Domain:** Media intelligence
**Tagline:** Memantau berita & media sosial Indonesia untuk mendeteksi isu sebelum eskalasi.
**Jumlah agent:** 13

## Apa Ini
Monitoring real-time berita & media sosial Indonesia untuk mendeteksi isu yang sedang muncul sebelum eskalasi, meng-cluster otomatis event terkait menjadi meta-issue, dan menghasilkan laporan intelijen siap pakai bagi stakeholder pemerintah.

## Fitur Utama
- Memantau 8 platform: Twitter/X, Facebook, YouTube, Instagram, TikTok, Bluesky, Threads, berita online.
- Pipeline hierarkis 13-langkah: topic expansion → koleksi berita → clustering → relevansi → social search → ekstraksi event → quality filter → memory check → analisis sentimen/engagement paralel.
- Struktur laporan hierarkis (meta-issue berisi event).
- Analisis sentimen otomatis + alert scoring (0–10).
- 6 lapis quality filtering (anti-halusinasi, coherence scoring, auto event rewriting).
- Proses real-time (~78 detik untuk analisis penuh).

## AI Agents (13)
Topic Expansion, Relevance Filter, Event Extractor, Keyword Miner, Quality Guard (2-stage), Catalog Matcher, Issue Organizer, Coherence Checker, Event Rewriter, Consistency Guardian, Search Query Builder, Sentiment Analyzer, Catalog Curator.

## Tech Stack
Python 3.10+, FastAPI; GPT-4.1-mini/4o-mini, GPT-OSS-120B, Qwen3-8B, Claude Sonnet; Elasticsearch, Qdrant; Redis, Kafka; async pipeline paralel, feature-flagged.

## Metrik Penting
13 agent · 8 platform · ~78 detik/analisis · 3.000–5.000 artikel/analisis · 6 lapis quality filter · hingga 10 meta-issue per laporan.
