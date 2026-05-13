"""Pytest configuration: set env before the app imports the database engine."""

import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./pytest_freshsave.db")
os.environ.setdefault("DB_VALIDATE_ON_STARTUP", "false")
