#!/usr/bin/env python3
"""
build_knowledge.py — Pipeline konversi knowledge base (modul 03 brief).

Mengubah materi sumber Feri menjadi markdown knowledge base:
  - list_projects/portfolio_*.html  -> knowledge/projects/_raw/*.md   (untuk dikurasi)
  - M_Feriansyah_Resume.pdf         -> knowledge/_raw/profile_raw.md  (untuk dikurasi)
  - regenerate knowledge/_index.md  dari frontmatter file project terkurasi

Catatan penting:
  * File terkurasi (projects/*.md, profile.md, experience.md) DITULIS TANGAN/dikurasi
    dan TIDAK ditimpa oleh script ini. Hasil konversi mentah masuk ke folder `_raw/`
    sebagai bahan referensi saat kurasi.
  * Index (_index.md) di-generate otomatis dari frontmatter file project terkurasi.

Jalankan:
    python scripts/build_knowledge.py            # konversi mentah + regen index
    python scripts/build_knowledge.py --index    # hanya regen _index.md
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

# --- Path ---
BACKEND_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_DIR = BACKEND_DIR / "knowledge"
PROJECTS_DIR = KNOWLEDGE_DIR / "projects"
# Sumber asli berada di root repo (sesuaikan bila berbeda)
REPO_ROOT = BACKEND_DIR.parent.parent
HTML_SRC_DIR = REPO_ROOT / "list_projects"
PDF_SRC = REPO_ROOT / "list_projects" / "M_Feriansyah_Resume.pdf"

# Pemetaan nama file HTML -> nama file markdown project
HTML_TO_MD = {
    "portofolio_command_ai.html": "command_ai",
    "portfolio_netra.html": "netra",
    "portofolio_cw.html": "cognitive_warfare",
    "portofolio_contextual_intelligence.html": "contextual_intelligence",
    "portofolio_profacc.html": "deep_account_profiling",
    "portoflio_docetl.html": "document_etl",
    "portofolio_argus_mro.html": "argus_mro",
    "portfolio_fip.html": "fire_intelligence",
    "portfolio_lifecycle.html": "acis_lifecycle",
    "portfolio_data_auditor.html": "veridocs",
    "portofolio_campaign_alert.html": "campaign_alert",
    "portofolio_iterative_data.html": "iterative_data_searcher",
}


def html_to_markdown(html: str) -> str:
    """Konversi HTML -> markdown (buang style/script, ambil teks bermakna)."""
    try:
        from bs4 import BeautifulSoup
        from markdownify import markdownify as md
    except ImportError:
        raise SystemExit(
            "Butuh beautifulsoup4 & markdownify. Jalankan: pip install -r requirements.txt"
        )
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["style", "script", "noscript", "svg"]):
        tag.decompose()
    body = soup.body or soup
    text = md(str(body), heading_style="ATX", strip=["a"])
    # rapikan baris kosong berlebih
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text


def pdf_to_markdown(pdf_path: Path) -> str:
    """Konversi PDF -> markdown via pymupdf4llm."""
    try:
        import pymupdf4llm
    except ImportError:
        raise SystemExit("Butuh pymupdf4llm. Jalankan: pip install -r requirements.txt")
    return pymupdf4llm.to_markdown(str(pdf_path))


def convert_sources() -> None:
    """Konversi HTML & PDF mentah ke folder _raw/ untuk dikurasi."""
    raw_projects = PROJECTS_DIR / "_raw"
    raw_kb = KNOWLEDGE_DIR / "_raw"
    raw_projects.mkdir(parents=True, exist_ok=True)
    raw_kb.mkdir(parents=True, exist_ok=True)

    if HTML_SRC_DIR.exists():
        for html_name, md_id in HTML_TO_MD.items():
            src = HTML_SRC_DIR / html_name
            if not src.exists():
                print(f"  [skip] {html_name} tidak ditemukan")
                continue
            out = raw_projects / f"{md_id}.md"
            out.write_text(html_to_markdown(src.read_text(encoding="utf-8", errors="ignore")),
                           encoding="utf-8")
            print(f"  [html] {html_name} -> projects/_raw/{md_id}.md")
    else:
        print(f"  [skip] folder sumber HTML tidak ada: {HTML_SRC_DIR}")

    if PDF_SRC.exists():
        out = raw_kb / "profile_raw.md"
        out.write_text(pdf_to_markdown(PDF_SRC), encoding="utf-8")
        print(f"  [pdf ] {PDF_SRC.name} -> _raw/profile_raw.md")
    else:
        print(f"  [skip] PDF tidak ditemukan: {PDF_SRC}")

    print("\n  -> Kurasi file di _raw/ lalu pindahkan/edit menjadi file final "
          "(projects/*.md, profile.md, experience.md).")


def parse_frontmatter(text: str) -> dict:
    """Ambil frontmatter YAML sederhana (key: value) dari awal file."""
    m = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    if not m:
        return {}
    data = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, _, v = line.partition(":")
            data[k.strip()] = v.strip()
    return data


def first_paragraph_after(text: str, anchor: str = "## Apa Ini") -> str:
    """Ambil 1 baris deskripsi ringkas dari section tertentu."""
    idx = text.find(anchor)
    if idx == -1:
        return ""
    after = text[idx + len(anchor):].strip()
    para = after.split("\n\n", 1)[0].replace("\n", " ").strip()
    return para[:160]


def regenerate_index() -> None:
    """Regenerate _index.md dari frontmatter + ringkasan file project terkurasi."""
    lines = [
        "# Knowledge Base Index — Feri",
        "",
        "> Manifest ini dimuat ke system prompt agent. Agent memilih file relevan dari sini,",
        '> lalu memanggil tool `read_knowledge("<file>")` untuk membaca isinya.',
        "",
        "## Profil & Pengalaman",
        "- `profile.md` — Identitas, pendidikan, core stack, sertifikat, kontak.",
        "- `experience.md` — Riwayat kerja Feri.",
        "",
        "## Projects",
    ]
    project_files = sorted(p for p in PROJECTS_DIR.glob("*.md"))
    for pf in project_files:
        text = pf.read_text(encoding="utf-8")
        fm = parse_frontmatter(text)
        name = fm.get("name", pf.stem)
        tagline = fm.get("tagline", "")
        desc = tagline or first_paragraph_after(text)
        lines.append(f"- `projects/{pf.name}` — {name}: {desc}")
    lines += [
        "",
        "## Catatan untuk Agent",
        "- Jawab HANYA berbasis isi file di atas. Bila tidak ada, katakan jujur — jangan mengarang.",
        "- Selalu sertakan sumber (nama file) untuk klaim faktual.",
        "- Ikuti bahasa penanya (Indonesia atau Inggris).",
    ]
    (KNOWLEDGE_DIR / "_index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"  [index] _index.md di-regenerate dari {len(project_files)} project.")


def main() -> None:
    ap = argparse.ArgumentParser(description="Build knowledge base Feri.")
    ap.add_argument("--index", action="store_true", help="hanya regenerate _index.md")
    args = ap.parse_args()

    print("== build_knowledge ==")
    if not args.index:
        print("[1] Konversi sumber HTML/PDF -> _raw/ ...")
        convert_sources()
    print("[2] Regenerate _index.md ...")
    regenerate_index()
    print("Selesai.")


if __name__ == "__main__":
    main()
