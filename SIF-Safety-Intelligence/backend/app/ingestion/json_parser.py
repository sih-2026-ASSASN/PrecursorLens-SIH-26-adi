import json
from fastapi import HTTPException
from app.ingestion.normalizer import normalize_record


def parse_json_bytes(content: bytes) -> list[dict]:
    try:
        data = json.loads(content.decode("utf-8"))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid JSON: {e}")

    records = data if isinstance(data, list) else [data]
    if not records:
        raise HTTPException(status_code=422, detail="JSON file has no records")

    return [normalize_record(r, source_format="json") for r in records]
