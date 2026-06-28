"""Operasi persistensi chat (modul 02). Best-effort: kegagalan DB tidak memblok chat."""
from __future__ import annotations

import json
import uuid
from typing import Any

from app.config import settings
from app.db.database import get_conn


def _is_turso() -> bool:
    return settings.db_backend == "turso" and bool(settings.turso_database_url)


def _exec(sql: str, params: tuple) -> None:
    conn = get_conn()
    if _is_turso():
        conn.execute(sql.replace("?", "?"), list(params))
    else:
        conn.execute(sql, params)
        conn.commit()


def ensure_session(session_id: str, lang: str | None = None, user_agent: str | None = None) -> None:
    try:
        _exec(
            "INSERT OR IGNORE INTO chat_sessions (id, lang, user_agent) VALUES (?, ?, ?)",
            (session_id, lang, user_agent),
        )
        _exec("UPDATE chat_sessions SET last_active = CURRENT_TIMESTAMP WHERE id = ?",
              (session_id,))
    except Exception as e:  # degraded-safe
        print(f"[db] ensure_session gagal (diabaikan): {e}")


def save_message(
    session_id: str,
    role: str,
    content: str,
    status: str = "final",
    agent_id: str | None = None,
    model: str | None = None,
    citations: list[dict[str, Any]] | None = None,
) -> str:
    msg_id = uuid.uuid4().hex
    try:
        _exec(
            """INSERT INTO chat_messages
               (id, session_id, role, content, status, agent_id, model, citations)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (msg_id, session_id, role, content, status, agent_id, model,
             json.dumps(citations, ensure_ascii=False) if citations else None),
        )
    except Exception as e:  # degraded-safe
        print(f"[db] save_message gagal (diabaikan): {e}")
    return msg_id


def get_messages(session_id: str) -> list[dict[str, Any]]:
    conn = get_conn()
    rows: list[dict[str, Any]] = []
    try:
        if _is_turso():
            rs = conn.execute(
                "SELECT role, content, status, agent_id, model, citations, created_at "
                "FROM chat_messages WHERE session_id = ? ORDER BY created_at", [session_id])
            cols = [c for c in rs.columns]
            for r in rs.rows:
                rows.append(dict(zip(cols, r)))
        else:
            cur = conn.execute(
                "SELECT role, content, status, agent_id, model, citations, created_at "
                "FROM chat_messages WHERE session_id = ? ORDER BY created_at", (session_id,))
            rows = [dict(r) for r in cur.fetchall()]
    except Exception as e:
        print(f"[db] get_messages gagal (diabaikan): {e}")
    for r in rows:
        if r.get("citations"):
            try:
                r["citations"] = json.loads(r["citations"])
            except Exception:
                pass
    return rows
