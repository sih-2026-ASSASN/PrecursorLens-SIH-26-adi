from fastapi import HTTPException

REQUIRED_TEXT_FIELDS = ["report_type", "location", "department", "description"]


def validate_normalized_record(record: dict):
    missing = [f for f in REQUIRED_TEXT_FIELDS if not record.get(f)]
    if missing:
        raise HTTPException(status_code=422, detail=f"Missing required field(s): {', '.join(missing)}")


def validate_file_type(filename: str, allowed_ext: str):
    if not filename.lower().endswith(allowed_ext):
        raise HTTPException(status_code=422, detail=f"File must be a {allowed_ext} file")


def validate_file_size(size_bytes: int, max_mb: int = 5):
    if size_bytes > max_mb * 1024 * 1024:
        raise HTTPException(status_code=422, detail=f"File exceeds {max_mb}MB limit")
