"""Konfigurasi aplikasi — dibaca dari .env (modul 05 brief)."""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- LLM / OpenRouter ---
    openrouter_api_key: str = "sk-or-REPLACE_ME"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    default_model: str = "anthropic/claude-3.5-sonnet"
    openrouter_app_url: str = "http://localhost:5179"
    openrouter_app_name: str = "Feri Personal Site"

    # --- CORS ---
    cors_origins: str = "http://localhost:5179"

    # --- Persistensi ---
    db_backend: str = "sqlite"          # "sqlite" | "turso"
    sqlite_path: str = "./data/chat.db"
    turso_database_url: str = ""
    turso_auth_token: str = ""

    # --- Rate limit ---
    rate_limit_per_min: int = 20

    # --- App ---
    app_env: str = "development"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
