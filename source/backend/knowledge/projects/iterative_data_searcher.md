---
id: iterative_data_searcher
name: Iterative Data Searcher
domain: research
agents: 7
tagline: Riset PDF agentik → jawaban tersitasi
---

# Iterative Data Searcher — AI-Powered PDF Research & Insight Pipeline

**Domain:** Riset / knowledge synthesis
**Tagline:** Mengubah pertanyaan bahasa natural menjadi jawaban bersumber dari PDF di web.
**Jumlah agent:** 7

## Apa Ini
Pipeline riset agentik yang mengubah pertanyaan bahasa natural menjadi jawaban yang grounded di sumber — menemukan, memverifikasi, dan menganalisis PDF yang dapat diunduh dari web. Dua fase: jawaban instan dalam detik + knowledge base tahan lama dibangun di background.

## Fitur Utama
- Query expansion: 1 permintaan → banyak query PDF tertarget (Query Variator).
- SerpAPI Google search paralel (location=Indonesia).
- Normalisasi URL repo akademik (arXiv, bioRxiv, PMC → direct PDF).
- Verifikasi link dengan relevance scoring 0–100 (gate >30).
- Download PDF konkuren + dual extractor (PyPDF2 → pdfplumber).
- Smart page-centering (offset 40%) untuk skip cover/TOC; per-page scoring + deep analysis paralel.
- Q&A synthesis → jawaban Bahasa Indonesia tersitasi; 2 fase (instan + background full-extraction).

## AI Agents (7)
Query Variator, URL Manipulator, PDF Verification, PDF Relevancy Analyzer, PDF Deep Analysis, PDF Q&A, Stellar Agent (+ BaseAgent).

## Tech Stack
Python, AsyncIO, FastAPI + FastMCP (SSE), CLI; GPT-4o-mini, Qwen 2.5 (7B/14B); SerpAPI, PyPDF2, pdfplumber, json_repair; Redis, Kafka, S3/MinIO; ThreadPoolExecutor.

## Metrik Penting
7 agent · 2 fase eksekusi · 3 entry point (API/MCP/CLI) · relevance 0–100 · 3 backend data · terbukti di 7+ domain.
