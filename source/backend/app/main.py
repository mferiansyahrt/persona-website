"""Entrypoint FastAPI — CORS, Swagger /docs, routes, startup (modul 05 brief)."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.agents.definitions import register_default_agents
from app.api import agents, health, sessions
from app.config import settings
from app.core.ratelimit import limiter
from app.db.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    register_default_agents()      # daftarkan agent v1 ke registry
    init_db()                      # buat tabel chat bila belum ada
    yield


app = FastAPI(
    title="Feri Personal Site API",
    version="1.0.0",
    description="Talk-to-data AI assistant + agent endpoints tentang Feri. Swagger di /docs.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda r, e: _rate_limit_response())
app.add_middleware(SlowAPIMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes
app.include_router(health.router, prefix="/api")
app.include_router(agents.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")


def _rate_limit_response():
    from fastapi.responses import JSONResponse
    return JSONResponse(status_code=429, content={"detail": "Terlalu banyak permintaan. Coba lagi nanti."})


@app.get("/", tags=["system"])
async def root() -> dict:
    return {"name": "Feri Personal Site API", "docs": "/docs", "health": "/api/health"}
