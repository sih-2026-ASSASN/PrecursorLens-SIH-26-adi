from app.ingestion.normalizer import normalize_record


def parse_text_report(payload: dict) -> dict:
    return normalize_record(payload, source_format="text")
