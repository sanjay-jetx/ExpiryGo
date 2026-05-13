"""Engine and session factory."""

from __future__ import annotations

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from .base import Base
from .settings import get_settings


def _connect_args_for_url(url: str) -> dict:
    if url.startswith("sqlite"):
        return {"check_same_thread": False}
    return {}


def create_engine_from_settings():
    settings = get_settings()
    return create_engine(
        settings.database_url,
        connect_args=_connect_args_for_url(settings.database_url),
        pool_pre_ping=settings.pool_pre_ping,
        pool_size=settings.pool_size,
        max_overflow=settings.max_overflow,
        echo=settings.sql_echo,
    )


engine = create_engine_from_settings()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_connection() -> None:
    """Run a cheap round-trip to confirm the database accepts connections."""
    with engine.begin() as conn:
        conn.execute(text("SELECT 1"))
