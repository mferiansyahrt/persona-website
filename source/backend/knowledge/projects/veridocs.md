---
id: veridocs
name: VERIDOCS
domain: docs
agents: 3
tagline: AI document audit untuk dokumen pemerintah
---

# VERIDOCS — AI Document Audit Engine

**Domain:** Audit dokumen / compliance pemerintah
**Tagline:** Pipeline multi-agent yang mengaudit dokumen pemerintah terhadap kepatuhan regulasi.
**Jumlah agent:** 3

## Apa Ini
Mengaudit Studi Kelayakan BUMD dan Rancangan Perda APBD terhadap kerangka regulasi (PP 54/2017 dan framework CACS). Mengubah PDF mentah menjadi skor deterministik & auditable dengan laporan berkop resmi pemerintah.

## Fitur Utama
- Ingest PDF/DOCX → Markdown → split per heading menjadi chunk kontekstual.
- Audit chunk-by-chunk terhadap 4 weighted indicator dengan verifikasi web + calculator.
- Hierarchical map-reduce summarization (dokumen hingga 160 chunk).
- Skor deterministik (LLM hanya narasi; skor dihitung di kode).
- Render HTML berkop resmi + PDF A4.
- Dua domain audit: BUMD Feasibility (≥70 = LAYAK) & Perda APBD (band CACS).

## AI Agents (3)
ChunkAuditorAgent (Brave Search + Calculator), SummarizerAgent (map-reduce), ReportGeneratorAgent (fallback-safe).

## Tech Stack
Python, AsyncIO, FastAPI; GPT-5.4-mini (auditor), Claude Sonnet 4.5 (infografik), OpenAI/OpenRouter/vLLM; PyMuPDF4LLM, python-docx, Docling+OCR, LangChain Splitters; Brave Search, Redis Queue; output HTML/PDF/Markdown/JSON.

## Metrik Penting
5 stage pipeline · 4 weighted indicator · 2 kategori audit · hingga 160 chunk/dokumen · ~3–35 menit runtime · 3 provider LLM.
