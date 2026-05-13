"""Application settings loaded from environment (.env)."""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

_BACKEND_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(_BACKEND_ROOT / ".env")
load_dotenv()


def _env_bool(key: str, default: bool) -> bool:
    raw = os.getenv(key)
    if raw is None or raw.strip() == "":
        return default
    return raw.strip().lower() in ("1", "true", "yes", "on")


def _env_int(key: str, default: int) -> int:
    raw = os.getenv(key)
    if raw is None or raw.strip() == "":
        return default
    return int(raw)


@dataclass(frozen=True)
class Settings:
    """Database and pool configuration (PostgreSQL-first)."""

    database_url: str
    pool_size: int
    max_overflow: int
    pool_pre_ping: bool
    sql_echo: bool
    validate_on_startup: bool


@lru_cache
def get_settings() -> Settings:
    url = (os.getenv("DATABASE_URL") or "").strip()
    if not url:
        raise RuntimeError(
            "DATABASE_URL is not set. Create a .env file in the backend folder "
            "(see .env.example). Example: "
            "postgresql+psycopg2://user:password@localhost:5432/freshsave"
        )

    return Settings(
        database_url=url,
        pool_size=_env_int("DB_POOL_SIZE", 5),
        max_overflow=_env_int("DB_MAX_OVERFLOW", 10),
        pool_pre_ping=_env_bool("DB_POOL_PRE_PING", True),
        sql_echo=_env_bool("DB_ECHO_SQL", False),
        validate_on_startup=_env_bool("DB_VALIDATE_ON_STARTUP", True),
    )
