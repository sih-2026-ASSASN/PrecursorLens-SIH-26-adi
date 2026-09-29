import io
import pandas as pd
from fastapi import HTTPException
from app.ingestion.normalizer import normalize_record


def parse_csv_bytes(content: bytes) -> list[dict]:
    try:
        df = pd.read_csv(io.BytesIO(content), dtype=str, keep_default_na=False)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse CSV: {e}")

    if df.empty:
        raise HTTPException(status_code=422, detail="CSV file has no data rows")

    df.columns = [c.strip().lower() for c in df.columns]
    records = df.to_dict(orient="records")
    return [normalize_record(r, source_format="csv") for r in records]
