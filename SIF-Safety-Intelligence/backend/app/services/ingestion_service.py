from app.ingestion.text_parser import parse_text_report
from app.ingestion.csv_parser import parse_csv_bytes
from app.ingestion.json_parser import parse_json_bytes
from app.ingestion.validator import validate_normalized_record
from app.services.report_service import create_report, bulk_create_reports


def ingest_text(payload: dict):
    normalized = parse_text_report(payload)
    validate_normalized_record(normalized)
    report = create_report(normalized)
    return {"id": report.id, "message": "Report submitted successfully"}


def ingest_csv(content: bytes):
    records = parse_csv_bytes(content)
    for r in records:
        validate_normalized_record(r)
    reports = bulk_create_reports(records)
    return {"imported": len(reports), "ids": [r.id for r in reports]}


def ingest_json(content: bytes):
    records = parse_json_bytes(content)
    for r in records:
        validate_normalized_record(r)
    reports = bulk_create_reports(records)
    return {"imported": len(reports), "ids": [r.id for r in reports]}
