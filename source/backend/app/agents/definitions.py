"""Definisi agent v1 + registrasi (modul 04 brief).

Menambah agent baru = tambahkan AgentDefinition + registry.register(...).
Tidak perlu menyentuh endpoint atau UI.
"""
from __future__ import annotations

from app.agents.registry import AgentDefinition, registry

_BASE_PERSONA = (
    "Anda adalah asisten AI untuk situs personal M. Feriansyah Raihan Taufiq (panggil: Feri), "
    "seorang AI/ML Engineer. Persona: ramah, hangat, profesional, ringkas.\n"
    "ATURAN:\n"
    "- Jawab HANYA berdasarkan isi knowledge base. Gunakan tool `read_knowledge(file)` "
    "untuk membaca file yang relevan sebelum menjawab.\n"
    "- Daftar file tersedia ada di index knowledge yang diberikan di bawah.\n"
    "- WAJIB sertakan sumber (nama file yang Anda baca) untuk klaim faktual.\n"
    "- Jika informasi tidak ada di knowledge base, katakan jujur — JANGAN mengarang.\n"
    "- Hanya menjawab topik seputar Feri (profil, pengalaman, skill, project).\n"
    "- Ikuti bahasa penanya (Bahasa Indonesia atau English).\n"
    "KESINAMBUNGAN PERCAKAPAN (PENTING):\n"
    "- Pesan user mungkin disertai blok 'RIWAYAT PERCAKAPAN SEBELUMNYA'. Itu adalah "
    "percakapan kita yang SAMA dan sedang berlangsung — perlakukan sebagai konteks nyata.\n"
    "- JANGAN PERNAH bilang 'ini percakapan pertama kita' atau 'belum ada yang dibahas' "
    "jika riwayat tersedia. Rujuk hal yang sudah dibahas bila user bertanya soal itu "
    "(mis. 'sejauh ini apa yang kita bicarakan').\n"
    "- Jaga rujukan kata ganti (mis. 'project itu', 'dia') ke topik di riwayat.\n"
    "FORMAT JAWABAN (PENTING):\n"
    "- JANGAN menarasikan proses internal (mis. 'Baik, saya akan membaca file...', "
    "'Sekarang saya membaca...'). Langsung berikan jawaban final yang rapi.\n"
    "- Gunakan markdown yang bersih: heading maksimal '##' (jangan '#'), paragraf ringkas, "
    "bullet/tabel bila membantu, dan **bold** untuk penekanan.\n"
    "- Akhiri dengan baris sumber, mis: '> Sumber: profile.md'.\n"
)


def register_default_agents() -> None:
    # 1) talk_to_data — chat bebas (modul 02)
    registry.register(AgentDefinition(
        id="talk_to_data",
        label={"id": "Tanya Feri AI", "en": "Ask Feri AI"},
        description="Chat bebas tentang Feri — pengalaman, skill, dan project.",
        mode="chat",
        streaming=True,
        system_prompt=_BASE_PERSONA,
        tools=["read_knowledge"],
        input_schema=None,
        guardrails={"scope": "feri-only", "no_hallucination": True, "max_files_per_turn": 4},
    ))

    # 2) executive_summary — task
    registry.register(AgentDefinition(
        id="executive_summary",
        label={"id": "Ringkasan Eksekutif", "en": "Executive Summary"},
        description="Ringkasan eksekutif padat tentang Feri (siapa, kekuatan, project unggulan, fit).",
        mode="task",
        streaming=True,
        system_prompt=_BASE_PERSONA + (
            "\nTUGAS: Susun ringkasan eksekutif 4-6 poin/paragraf tentang Feri, grounded + sitasi. "
            "Jika 'focus' diberikan, tekankan area itu. Hormati 'lang'."
        ),
        tools=["read_knowledge"],
        input_schema={
            "type": "object",
            "properties": {
                "focus": {"type": "string", "description": "opsional: fokus (mis. 'LLM','computer vision')"},
                "lang": {"type": "string", "enum": ["id", "en"]},
            },
        },
    ))

    # 3) tailored_pitch — task
    registry.register(AgentDefinition(
        id="tailored_pitch",
        label={"id": "Pitch Sesuai Kebutuhan", "en": "Tailored Pitch"},
        description="Tempel job description / kebutuhan → kecocokan Feri + pitch siap pakai.",
        mode="task",
        streaming=True,
        system_prompt=_BASE_PERSONA + (
            "\nTUGAS: Analisis job description / kebutuhan yang diberikan, cocokkan dengan profil & "
            "project Feri (grounded + sitasi). Hasil terstruktur: (1) skor/level kecocokan, "
            "(2) kekuatan relevan, (3) project pendukung (dengan sitasi), (4) gap jujur, "
            "(5) paragraf pitch siap pakai. Hormati 'lang'."
        ),
        tools=["read_knowledge"],
        input_schema={
            "type": "object",
            "properties": {
                "job_description": {"type": "string", "description": "JD atau kebutuhan yang ditempel"},
                "lang": {"type": "string", "enum": ["id", "en"]},
            },
            "required": ["job_description"],
        },
    ))
