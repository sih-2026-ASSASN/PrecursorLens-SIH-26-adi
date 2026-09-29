"""
MongoDB connection (pymongo).

One MongoClient is created lazily and shared. There is NO in-memory fallback:
if MongoDB is unreachable, pymongo raises and the API answers with HTTP 503
(see the PyMongoError handler in app/main.py) instead of serving fake data.
"""
from pymongo import MongoClient, ASCENDING

from app.config import settings

_client: MongoClient | None = None
_indexes_ready = False


def get_client() -> MongoClient:
    global _client, _indexes_ready
    if _client is None:
        _indexes_ready = False
        _client = MongoClient(
            settings.mongodb_url,
            serverSelectionTimeoutMS=settings.mongodb_timeout_ms,
        )
    return _client


def get_db():
    return get_client()[settings.mongodb_database]


def ping() -> dict:
    """Raises pymongo.errors.PyMongoError if the server is unreachable."""
    client = get_client()
    client.admin.command("ping")
    return {"database": settings.mongodb_database, "server_version": client.server_info().get("version")}


def ensure_indexes_once() -> None:
    """Retries index creation on first write if MongoDB was not up at startup."""
    if not _indexes_ready:
        ensure_indexes()


def ensure_indexes() -> None:
    global _indexes_ready
    db = get_db()
    db["reports"].create_index([("id", ASCENDING)], unique=True)
    db["analyses"].create_index([("report_id", ASCENDING)], unique=True)
    db["reviews"].create_index([("id", ASCENDING)], unique=True)
    db["reviews"].create_index([("report_id", ASCENDING)])
    db["alerts"].create_index([("id", ASCENDING)], unique=True)
    _indexes_ready = True
