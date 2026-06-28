"""Health endpoint — untuk UX cold-start di frontend (modul 01/05)."""
from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get("/health", tags=["system"])
async def health() -> dict:
    return {"status": "ok"}
