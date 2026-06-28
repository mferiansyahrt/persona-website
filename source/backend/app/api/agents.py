"""Endpoint seragam Agent Registry (modul 04 brief)."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.agents.registry import registry
from app.agents.runner import run_agent, stream_agent
from app.core.sse import SSE_HEADERS
from app.db import models as db

router = APIRouter(tags=["agents"])


@router.get("/agents")
async def list_agents() -> list[dict[str, Any]]:
    """Manifest semua agent — frontend render launcher & chips."""
    return registry.manifest()


@router.get("/agents/{agent_id}")
async def get_agent(agent_id: str) -> dict[str, Any]:
    defn = registry.get(agent_id)
    if not defn:
        raise HTTPException(404, f"Agent '{agent_id}' tidak ditemukan.")
    return defn.public()


class RunRequest(BaseModel):
    session_id: str | None = None
    payload: dict[str, Any] = {}


@router.post("/agents/{agent_id}/run")
async def run(agent_id: str, body: RunRequest) -> dict[str, Any]:
    """Eksekusi task non-stream → hasil terstruktur."""
    defn = registry.get(agent_id)
    if not defn:
        raise HTTPException(404, f"Agent '{agent_id}' tidak ditemukan.")
    result = await run_agent(defn, body.payload)
    if body.session_id:
        db.ensure_session(body.session_id)
        db.save_message(body.session_id, "assistant", result["output"],
                        agent_id=agent_id, model=result.get("model"),
                        citations=result.get("citations"))
    return result


@router.get("/agents/{agent_id}/stream")
async def stream(agent_id: str, request: Request) -> StreamingResponse:
    """SSE streaming (chat & task). Param input dikirim sebagai query string."""
    defn = registry.get(agent_id)
    if not defn:
        raise HTTPException(404, f"Agent '{agent_id}' tidak ditemukan.")

    params = dict(request.query_params)
    session_id = params.pop("session_id", None)

    # validasi field required dari input_schema
    schema = defn.input_schema or {}
    for req_field in schema.get("required", []):
        if not params.get(req_field):
            raise HTTPException(400, f"Field wajib '{req_field}' kosong.")

    # ambil riwayat (5 pesan terakhir) SEBELUM menyimpan pesan user baru
    history: list = []
    if session_id:
        db.ensure_session(session_id, lang=params.get("lang"))
        history = db.get_messages(session_id)[-5:]
        user_text = params.get("q") or params.get("job_description")
        if user_text:
            db.save_message(session_id, "user", user_text, agent_id=agent_id)

    async def event_source():
        final = {"content": "", "model": None, "citations": []}
        async for ev in stream_agent(defn, params, history):
            if ev.startswith("event: done"):
                import json
                final = json.loads(ev.split("data: ", 1)[1].strip())
            yield ev
        # persist hasil AI (status final)
        if session_id and final.get("content"):
            db.save_message(session_id, "assistant", final["content"],
                            agent_id=agent_id, model=final.get("model"),
                            citations=final.get("citations"))

    return StreamingResponse(event_source(), media_type="text/event-stream", headers=SSE_HEADERS)
