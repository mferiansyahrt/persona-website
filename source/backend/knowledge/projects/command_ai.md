---
id: command_ai
name: Command AI
domain: civic
agents: 12
tagline: Reality Intelligence Platform — civic intelligence WhatsApp-native
---

# Command AI — Reality Intelligence Platform

**Domain:** Civic intelligence
**Tagline:** Platform intelijen sipil WhatsApp-native yang memfusikan suara publik dengan suara organisasi.
**Jumlah agent:** 12

## Apa Ini
Sistem yang memfusikan keluhan warga (Voice of the Public) dengan laporan petugas lapangan (Voice of the Organization) menjadi reality score yang deterministik dan auditable, untuk menyingkap gap operasional, konflik, dan intelijen yang dapat ditindaklanjuti oleh pengambil keputusan.

## Fitur Utama
- Dua kanal WhatsApp (keluhan warga + laporan petugas) dengan intake terpadu.
- 6 deterministic scoring engine (urgency, activity quality, correlation, operational gap, problem conflict, reality alignment index).
- Peta real-time click-to-fly + notifikasi live (WebSocket + HTTP polling fallback).
- Talk-to-data AI assistant (SSE) untuk eksekutif.
- Clustering keluhan otomatis + klasifikasi isu + analisis foto (vision).
- 24 halaman dashboard role-gated pada grid draggable.

## AI Agents (12)
Intent Classifier, Completion Resolver, Extraction Agent, Location Agent, Vision Agent, Vision Location Agent, Complaint Classifier, Embedding Client, Issue Labeler, AI Assistant Agent, Chat Agent, Recommendation & Summary.

## Tech Stack
Python (asyncio), FastAPI, React 19; GPT-4.1-mini/4o-mini, Qwen lokal, gpt-oss-20b; PostgreSQL+PostGIS, Qdrant, Redis, MinIO/S3; open-wa (WhatsApp), Nominatim; Mapbox GL, D3, Zustand.

## Metrik Penting
2 voices difusikan · 12 agent · 6 deterministic score · 2 kanal WhatsApp · 24 halaman dashboard · 5 model LLM.
