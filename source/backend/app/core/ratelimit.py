"""Rate limiting per-IP (slowapi) untuk lindungi biaya OpenRouter (modul 05)."""
from __future__ import annotations

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import settings

limiter = Limiter(key_func=get_remote_address)

# string limit dipakai sebagai dependency/decorator di route
DEFAULT_LIMIT = f"{settings.rate_limit_per_min}/minute"
