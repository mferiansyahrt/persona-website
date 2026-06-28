"""Runner agent — bangun agno Agent (OpenRouter) & stream ke SSE (modul 02/04)."""
from __future__ import annotations

import asyncio
import threading
from typing import Any, AsyncGenerator

from app.agents.registry import AgentDefinition
from app.config import settings
from app.core.sse import sse_event
from app.tools import knowledge as kb


def _build_agent(defn: AgentDefinition, accessed: list[str]):
    """Bangun agno Agent dengan model OpenRouter + tool knowledge (mencatat file diakses)."""
    from agno.agent import Agent
    from agno.models.openrouter import OpenRouter

    def read_knowledge(file: str) -> str:
        """Baca satu file markdown knowledge base Feri (mis. 'projects/netra.md').
        Selalu gunakan ini sebelum menjawab fakta, lalu sebut nama file sebagai sumber."""
        if file not in accessed:
            accessed.append(file)
        return kb.read_knowledge(file)

    index_text = kb.load_index()
    instructions = (
        defn.system_prompt
        + "\n\n=== INDEX KNOWLEDGE BASE (pilih file relevan, lalu read_knowledge) ===\n"
        + index_text
    )

    model = OpenRouter(
        id=defn.model or settings.default_model,
        api_key=settings.openrouter_api_key,
        base_url=settings.openrouter_base_url,
    )

    tools = [read_knowledge] if "read_knowledge" in defn.tools else []
    return Agent(model=model, tools=tools, instructions=instructions, markdown=True)


def _format_history(history: list[dict[str, Any]] | None) -> str:
    """Format hingga 5 pesan terakhir menjadi transkrip ringkas untuk konteks."""
    if not history:
        return ""
    recent = history[-5:]
    lines = []
    for m in recent:
        role = "User" if m.get("role") == "user" else "Anda (AI)"
        content = (m.get("content") or "").strip()
        if content:
            lines.append(f"{role}: {content}")
    if not lines:
        return ""
    return (
        "=== RIWAYAT PERCAKAPAN SEBELUMNYA (5 pesan terakhir, untuk konteks) ===\n"
        + "\n".join(lines)
        + "\n=== AKHIR RIWAYAT ===\n\n"
    )


def _compose_message(defn: AgentDefinition, payload: dict[str, Any],
                     history: list[dict[str, Any]] | None = None) -> str:
    """Susun pesan input sesuai mode agent (+ riwayat untuk mode chat)."""
    if defn.mode == "chat":
        q = payload.get("q") or payload.get("message") or ""
        hist = _format_history(history)
        if hist:
            return (f"{hist}Pertanyaan TERBARU dari user (jawab ini, gunakan riwayat di atas "
                    f"bila relevan untuk menjaga kesinambungan):\n{q}")
        return q
    # task: gabungkan field input jadi instruksi
    if defn.id == "executive_summary":
        focus = payload.get("focus")
        lang = payload.get("lang", "id")
        msg = "Buat ringkasan eksekutif tentang Feri."
        if focus:
            msg += f" Fokus pada: {focus}."
        msg += f" Bahasa: {lang}."
        return msg
    if defn.id == "tailored_pitch":
        jd = payload.get("job_description", "")
        lang = payload.get("lang", "id")
        return (f"Berikut job description / kebutuhan:\n\n{jd}\n\n"
                f"Analisis kecocokan Feri & susun pitch. Bahasa: {lang}.")
    # fallback generic
    return payload.get("q") or str(payload)


async def stream_agent(defn: AgentDefinition, payload: dict[str, Any],
                       history: list[dict[str, Any]] | None = None) -> AsyncGenerator[str, None]:
    """Jalankan agent streaming → yield string event SSE (token/citation/done/error)."""
    accessed: list[str] = []
    queue: asyncio.Queue = asyncio.Queue()
    loop = asyncio.get_running_loop()
    full_text: list[str] = []

    def worker():
        try:
            agent = _build_agent(defn, accessed)
            message = _compose_message(defn, payload, history)
            prev_len = 0
            for chunk in agent.run(message, stream=True):
                content = getattr(chunk, "content", None)
                if not content:
                    continue
                # agno bisa mengirim konten kumulatif atau delta — ambil suffix baru
                if content.startswith("".join(full_text)) and len(content) >= prev_len:
                    delta = content[prev_len:]
                    prev_len = len(content)
                else:
                    delta = content
                    prev_len += len(content)
                if delta:
                    full_text.append(delta) if not full_text or full_text[-1] != delta else None
                    loop.call_soon_threadsafe(queue.put_nowait, ("token", {"delta": delta}))
            loop.call_soon_threadsafe(queue.put_nowait, ("__done__", None))
        except Exception as e:  # noqa
            loop.call_soon_threadsafe(queue.put_nowait, ("error", {"message": str(e)}))
            loop.call_soon_threadsafe(queue.put_nowait, ("__done__", None))

    threading.Thread(target=worker, daemon=True).start()

    text_accum: list[str] = []
    model_used = defn.model or settings.default_model
    while True:
        kind, data = await queue.get()
        if kind == "__done__":
            break
        if kind == "token":
            text_accum.append(data["delta"])
            yield sse_event("token", data)
        elif kind == "error":
            yield sse_event("error", {"code": "agent_error", **data})

    # citation events (file yang dibaca agent)
    for i, f in enumerate(accessed, start=1):
        yield sse_event("citation", {"n": i, "file": f, "label": f})

    yield sse_event("done", {
        "model": model_used,
        "content": "".join(text_accum),
        "citations": [{"n": i, "file": f} for i, f in enumerate(accessed, start=1)],
    })


async def run_agent(defn: AgentDefinition, payload: dict[str, Any],
                    history: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    """Jalankan agent non-stream → kumpulkan hasil penuh (untuk /run)."""
    content_parts: list[str] = []
    citations: list[dict] = []
    model_used = defn.model or settings.default_model
    async for ev in stream_agent(defn, payload, history):
        # parse event 'done' untuk hasil final
        if ev.startswith("event: done"):
            import json
            data = json.loads(ev.split("data: ", 1)[1].strip())
            return {
                "agent_id": defn.id,
                "output": data.get("content", ""),
                "citations": data.get("citations", []),
                "model": data.get("model", model_used),
            }
    return {"agent_id": defn.id, "output": "".join(content_parts), "citations": citations, "model": model_used}
