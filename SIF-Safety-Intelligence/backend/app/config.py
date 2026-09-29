import os
from pathlib import Path

# Load backend/.env (independent of the current working directory). Variables
# already set in the real environment always win.
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parents[1] / ".env")
except ImportError:  # python-dotenv is listed in requirements.txt
    pass


class Settings:
    app_env: str = os.getenv("APP_ENV", "development")
    cors_origins: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    mongodb_url: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    mongodb_database: str = os.getenv("MONGODB_DATABASE", "precursorlens")
    mongodb_timeout_ms: int = int(os.getenv("MONGODB_TIMEOUT_MS", "3000"))


settings = Settings()
