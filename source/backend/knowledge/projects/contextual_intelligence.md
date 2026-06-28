---
id: contextual_intelligence
name: Contextual Intelligence (ACIS)
domain: media
agents: 2
tagline: Topic management layer — event & issue classification
---

# Contextual Intelligence — Topic Management Layer (ACIS)

**Domain:** Social monitoring / media intelligence
**Tagline:** Streaming pipeline yang memperkaya anchor post, mengekstrak event, dan mengklasifikasi isu.
**Jumlah agent:** 2

## Apa Ini
Pipeline streaming yang memperkaya satu anchor post dengan konten terkait secara semantik dari media sosial & berita, mengekstrak event terstruktur, lalu mengklasifikasikannya menjadi umbrella issue. Mendeteksi, meng-cluster, dan mengklasifikasi diskursus publik menjadi topik bermakna lintas 12 platform.

## Fitur Utama
- Tahap A — context retrieval: embed anchor post, match ke 380 tag centroid via Qdrant, ambil post relevan dari Elasticsearch (window 24 jam).
- Tahap B — event/issue pipeline: ekstraksi event LLM, dedup lintas-batch, gating rules, similarity search vs issue eksisting.
- Klasifikasi 3-arah: issue (event konkret), framing (pola interpretasi), narrative (diskursus umum).
- Dual-node Qdrant failover; threshold tunable via env.
- Paralel async-bounded (15 worker per stage); health check & cold-start protection.

## AI Agents (2)
EventExtractor (ekstraksi event + filter opini), ContextLabeler (klasifikasi issue + umbrella label).

## Tech Stack
Python, AsyncIO, FastAPI; vLLM Qwen3.5-9B (default), GPT-4o-mini, OpenRouter; Elasticsearch (kNN), Qdrant (dual-node), APScheduler; Kafka; pydantic, JSON-mode validation.

## Metrik Penting
2 stage · 380 tag centroid · 2 agent · 15 worker konkuren · 3 tipe klasifikasi · 12 platform.
