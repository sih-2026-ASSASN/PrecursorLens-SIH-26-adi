from datetime import datetime, timezone


def normalize_record(raw: dict, source_format: str) -> dict:
    """Convert any source record into the canonical normalized report shape."""
    return {
        "report_type": str(raw.get("report_type") or raw.get("type") or "Near Miss").strip(),
        "location": str(raw.get("location") or "Unknown").strip(),
        "department": str(raw.get("department") or "Unknown").strip(),
        "description": str(raw.get("description") or "").strip(),
        "source_format": source_format,
        "submitted_at": raw.get("submitted_at") or datetime.now(timezone.utc).isoformat(),
    }
