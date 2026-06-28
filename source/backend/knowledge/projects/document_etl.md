---
id: document_etl
name: Document-ETL (MA-TAG Engine)
domain: data
agents: 8
tagline: Table Augmented Generation — NL→dataset→SQL→sintesis
---

# Multi-Agent Table Augmented Generation (Document-ETL / MA-TAG)

**Domain:** Data / statistik
**Tagline:** Tanya bahasa natural; sistem menemukan dataset relevan, mengekstrak data, dan menyajikan analisis bersumber.
**Jumlah agent:** 8

## Apa Ini
Sistem yang menerima pertanyaan bahasa natural, menemukan dataset relevan dari ribuan sumber, mengekstrak datanya, dan menyajikan analisis komprehensif dengan tabel, insight, dan referensi sumber. Diekspos sebagai layanan MCP.

## Fitur Utama
- Question expansion (singkatan, periode waktu, konteks geografis).
- Semantic search paralel lintas metadata spreadsheet + data berita/web.
- AI relevance ranking (0–100) dengan self-healing bila threshold tak terpenuhi.
- Text-to-SQL untuk ekstraksi spreadsheet multi-sheet besar.
- Pipeline DocETL: Split → Gather Context → Analyze → Synthesize.
- Smart caching + auto chart (ECharts); 3 format output (report, structured package, raw feed).

## AI Agents (8)
Question Analyzer, Relevance Judge, Time Period Detector, Data Validator, Cache Evaluator, Chart Designer, Table Formatter, Foundation Layer.

## Tech Stack
Python, DocETL; GPT-4o, Gemini 2.5 Flash, fine-tuned chart model, cross-encoder; PostgreSQL, Qdrant (dual-node), Elasticsearch, Redis; S3/MinIO; Text-to-SQL; MCP, Kafka; ECharts, Word.

## Metrik Penting
8 agent · 10 mode pipeline · 15 service · 3 format output · 35 tool module · 4 mode search · ~20 detik/query.
