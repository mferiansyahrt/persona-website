"""Koneksi DB — SQLite (dev) / Turso libSQL (prod) + schema (modul 02/05)."""
from __future__ import annotations

import sqlite3
from pathlib import Path

from app.config import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS chat_sessions (
    id          TEXT PRIMARY KEY,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lang        TEXT,
    user_agent  TEXT,
    meta        TEXT
);
CREATE TABLE IF NOT EXISTS chat_messages (
    id          TEXT PRIMARY KEY,
    session_id  TEXT NOT NULL,
    role        TEXT NOT NULL,
    content     TEXT NOT NULL,
    status      TEXT NOT NULL,
    agent_id    TEXT,
    model       TEXT,
    citations   TEXT,
    tokens_in   INTEGER,
    tokens_out  INTEGER,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_messages_session ON chat_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_active  ON chat_sessions(last_active);
"""


def _connect():
    """Kembalikan koneksi DB sesuai backend (sqlite dev / turso prod)."""
    if settings.db_backend == "turso" and settings.turso_database_url:
        import libsql_client  # noqa
        # Untuk Turso, gunakan client libsql (sinkron via create_client_sync)
        return libsql_client.create_client_sync(
            url=settings.turso_database_url,
            auth_token=settings.turso_auth_token,
        )
    # SQLite (dev)
    db_path = Path(settings.sqlite_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(db_path), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


# koneksi global sederhana (cukup untuk situs personal single-instance)
_conn = None


def get_conn():
    global _conn
    if _conn is None:
        _conn = _connect()
    return _conn


def init_db() -> None:
    """Buat tabel bila belum ada (dipanggil saat startup)."""
    conn = get_conn()
    if settings.db_backend == "turso" and settings.turso_database_url:
        for stmt in filter(str.strip, SCHEMA.split(";")):
            conn.execute(stmt)
    else:
        conn.executescript(SCHEMA)
        conn.commit()
