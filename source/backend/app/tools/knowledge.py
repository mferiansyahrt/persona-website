"""Knowledge tool — agentic file retrieval dengan guardrail path (modul 03)."""
from __future__ import annotations

from pathlib import Path

# Akar whitelist: source/backend/knowledge/
KNOWLEDGE_DIR = (Path(__file__).resolve().parent.parent.parent / "knowledge").resolve()


def _safe_path(file: str) -> Path:
    """Resolve & validasi path agar tetap di dalam knowledge/ (cegah traversal)."""
    target = (KNOWLEDGE_DIR / file).resolve()
    if not str(target).startswith(str(KNOWLEDGE_DIR)):
        raise ValueError("Akses ditolak: path di luar folder knowledge.")
    if target.suffix != ".md":
        raise ValueError("Hanya file .md yang boleh dibaca.")
    return target


def load_index() -> str:
    """Baca manifest _index.md (dipanggil saat membangun system prompt agent)."""
    idx = KNOWLEDGE_DIR / "_index.md"
    return idx.read_text(encoding="utf-8") if idx.exists() else "(index belum dibuat)"


def read_knowledge(file: str) -> str:
    """Baca satu file markdown dari knowledge base Feri.

    Args:
        file: path relatif terhadap folder knowledge, mis. "profile.md"
              atau "projects/netra.md".

    Returns:
        Isi file markdown sebagai teks. Gunakan ini untuk menjawab pertanyaan
        tentang Feri secara grounded, lalu sebutkan nama file sebagai sumber.
    """
    try:
        target = _safe_path(file)
    except ValueError as e:
        return f"[ERROR] {e}"
    if not target.is_file():
        return (f"[ERROR] File '{file}' tidak ditemukan. "
                f"Cek kembali daftar file di _index.md.")
    return target.read_text(encoding="utf-8")
