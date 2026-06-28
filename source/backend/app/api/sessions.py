"""Endpoint history sesi chat (modul 02)."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.db import models as db

router = APIRouter(tags=["sessions"])


@router.get("/sessions/{session_id}/messages")
async def get_messages(session_id: str) -> dict[str, Any]:
    """Load history untuk melanjutkan sesi."""
    return {"session_id": session_id, "messages": db.get_messages(session_id)}
