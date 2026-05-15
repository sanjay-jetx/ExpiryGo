import os
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "freshsave"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

# Print connection info (without emojis for Windows console safety)
host_part = settings.MONGODB_URL.split('@')[-1] if '@' in settings.MONGODB_URL else settings.MONGODB_URL
print(f"[DB] MongoDB target: {host_part}")
print(f"[DB] Database name: {settings.DATABASE_NAME}")

# Create the Motor client - this is lazy and does NOT actually connect yet.
# Motor only connects when you first perform a database operation.
client: AsyncIOMotorClient = AsyncIOMotorClient(
    settings.MONGODB_URL,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
)
db = client[settings.DATABASE_NAME]

print(f"[DB] Motor client created (lazy, connects on first query)")

async def get_db():
    """FastAPI dependency that returns the database handle."""
    return db