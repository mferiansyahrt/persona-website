---
id: fire_intelligence
name: FIP v2 (Fire Intelligence Platform)
domain: geospatial
agents: 2
tagline: Pemetaan & prediksi karhutla untuk respons taktis
---

# FIP v2 — Fire Intelligence Platform (Karhutla Intelligence)

**Domain:** Geospatial / penegakan hukum
**Tagline:** Pemetaan hotspot real-time & prediksi sebaran api untuk respons taktis.
**Jumlah agent:** 2

## Apa Ini
Sistem pemetaan kebakaran hutan real-time dan prediksi untuk respons penegakan hukum di Provinsi Riau — deteksi hotspot, atribusi penyebab, dan prediksi sebaran api 14 hari untuk memandu unit mobile polisi dan pre-positioning sumber daya pemadam.

## Fitur Utama
- 6 engine analitik (DBSCAN hotspot clustering, cause classification, intent detection, temporal stats, spatial assignment, cellular-automata fire spread).
- Dual-view dashboard (Intel Historis untuk forensik, Prediksi Risiko untuk perencanaan).
- Risk scoring 1.076 zona desa (heatmap choropleth 0–100).
- Window prediksi H-7 → T+7 dengan animasi sebaran kumulatif.
- 6 sumber data heterogen dinormalisasi ke silver layer.
- 2 LLM agent (Cluster Intel, Prediksi Briefing) dengan fallback template deterministik.

## AI Agents (2)
Cluster Intel Agent, Prediksi Briefing Agent.

## Tech Stack
Python 3.11, FastAPI; React 18, TypeScript, Vite 5, Mapbox GL, TailwindCSS, ECharts; PostgreSQL+PostGIS (3 cluster), Elasticsearch, Redis; DBSCAN, Convex Hull, Cellular Automata; gpt-4.1-mini / vLLM gpt-oss-20b; Docker.

## Metrik Penting
1.076 zona desa · 12 kabupaten · 6 engine analitik · 2 LLM agent · 6 sumber data · prediksi H-7→T+7 · pipeline 7 lapis.
