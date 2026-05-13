"""
Public database API for the rest of the app.

Imports use ``from database import Base, engine, get_db`` so the project
stays flat without turning every file into ``from db...``.
"""

from db import Base, SessionLocal, engine, get_db, verify_connection
from db.settings import get_settings

__all__ = ["Base", "engine", "SessionLocal", "get_db", "get_settings", "verify_connection"]
