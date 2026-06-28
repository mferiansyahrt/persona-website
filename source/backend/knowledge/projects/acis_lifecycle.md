---
id: acis_lifecycle
name: ACIS Lifecycle Engine
domain: infra
agents: 4
tagline: Object monitoring state machine, event-driven
---

# ACIS Lifecycle Engine — Object Monitoring State Machine

**Domain:** Infrastruktur intelijen / monitoring
**Tagline:** Health assessment real-time & manajemen lifecycle untuk objek yang dipantau.
**Jumlah agent:** 4

## Apa Ini
Mesin event-driven untuk menilai kesehatan (velocity, volume, recency, relevance) dan mentransisikan objek (keyword, akun, media entity) antar lifecycle state (TRIAL → ACTIVE HOT/COLD/ON_DEMAND → INACTIVE DORMANT/DECAYING → RETIRED) merespons sinyal crawling berkelanjutan.

## Fitur Utama
- 4 state (TRIAL, ACTIVE, INACTIVE, RETIRED) + 5 mode (HOT, COLD, ON_DEMAND, DORMANT, DECAYING).
- Health score real-time dari agregasi Elasticsearch (velocity·0.30 + volume·0.20 + relevance·0.30 + recency·0.20).
- Precedence ruleset dengan hysteresis (band 75–80, cegah flapping HOT↔COLD).
- Dual decision mode: deterministik (rules) atau agent-assisted (LLM + fallback).
- Anti-twin object retrieval; lucene query refinement per-objek (cache Redis 24h TTL).
- Reasoning text di setiap transisi untuk audit trail.

## AI Agents (4)
relevance_scorer, lifecycle_decision, lucene_refiner, transition_reasoner.

## Tech Stack
Python 3.11, AsyncIO, eb_labs agent framework, Pydantic v2, loguru; Apache Kafka (kafka-to-kafka worker); PostgreSQL (read-only), Elasticsearch, Redis; gpt-4o-mini / vLLM Qwen / OpenRouter fallback.

## Metrik Penting
4 state · 5 mode · 4 komponen health score · 4 agent · 2 decision mode · degraded-safe.
