"""Helper Server-Sent Events (SSE) — format event seragam (modul 02/04/05)."""
from __future__ import annotations

import json
from typing import Any

# Header agar proxy tidak buffer stream
SSE_HEADERS = {
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
}


def sse_event(event: str, data: dict[str, Any]) -> str:
    """Bentuk satu pesan SSE: event + data JSON."""
    payload = json.dumps(data, ensure_ascii=False)
    return f"event: {event}\ndata: {payload}\n\n"
