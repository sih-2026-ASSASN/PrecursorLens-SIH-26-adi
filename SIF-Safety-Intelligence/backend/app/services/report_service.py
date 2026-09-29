"""
MongoDB-backed store for reports, AI analyses, reviews, alerts and id counters.

Collections: reports, analyses, reviews, alerts, counters (database name from
MONGODB_DATABASE). Function names, arguments and return types (the dataclasses
in app/database/models.py) are unchanged from the earlier in-memory version, so
routes and analytics modules work as before — but every read/write now goes to
MongoDB. Nothing is cached in process memory.
"""
import re
from dataclasses import asdict, fields
from datetime import datetime, timezone

from fastapi import HTTPException
from pymongo import ReturnDocument
from pymongo.errors import PyMongoError

from app.database.connection import get_db, ensure_indexes_once
from app.database.models import Report, Analysis, Review, Alert
from app.ai.client import analyze_report
from app.ai.response_mapper import map_to_analysis

RISK_ORDER = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}


# ---------- helpers ----------

def _col(name: str):
    return get_db()[name]


def _next_id(counter_name: str) -> int:
    doc = _col("counters").find_one_and_update(
        {"_id": counter_name},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return int(doc["seq"])


def _to(cls, doc):
    if not doc:
        return None
    names = {f.name for f in fields(cls)}
    return cls(**{k: v for k, v in doc.items() if k in names})


def _ts(value) -> float:
    """submitted_at -> epoch seconds (tolerates date-only / naive / 'Z' strings)."""
    try:
        dt = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except (ValueError, TypeError):
        return 0.0
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.timestamp()


def _risk_sort_key(risk_level: str, submitted_at, item_id: int):
    """CRITICAL -> HIGH -> MEDIUM -> LOW, newest first inside each level."""
    return (RISK_ORDER.get(str(risk_level).upper(), len(RISK_ORDER)), -_ts(submitted_at), -item_id)


def _contains(value: str) -> dict:
    return {"$regex": re.escape(value), "$options": "i"}


# ---------- creation (AI analysis -> MongoDB) ----------

def _run_ai(normalized: dict) -> dict:
    """Send one report to the real AI/NLP engine. Never substitutes fake output."""
    try:
        return analyze_report(normalized)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"AI/NLP engine failed to analyze the report ({type(exc).__name__}: {exc}). Nothing was saved.",
        ) from exc


def _persist(normalized: dict, ai_result: dict) -> Report:
    ensure_indexes_once()
    report_id = _next_id("report")
    review_id = None
    alert_id = None
    try:
        report = Report(
            id=report_id,
            report_type=normalized["report_type"],
            location=normalized["location"],
            department=normalized["department"],
            description=normalized["description"],
            source_format=normalized["source_format"],
            submitted_at=normalized["submitted_at"],
            risk_level=ai_result["risk_level"],
            sif_detected=ai_result["sif_detected"],
            review_status="Pending",
        )
        analysis = map_to_analysis(report_id, ai_result)
        review_id = _next_id("review")
        review = Review(
            id=review_id,
            report_id=report_id,
            description=report.description,
            risk_level=report.risk_level,
            evidence=analysis.evidence,
            status="Pending",
        )
        _col("reports").insert_one(asdict(report))
        _col("analyses").insert_one(asdict(analysis))
        _col("reviews").insert_one(asdict(review))

        if ai_result["risk_level"] in ("HIGH", "CRITICAL"):
            alert_id = _next_id("alert")
            _col("alerts").insert_one(asdict(Alert(
                id=alert_id,
                severity=ai_result["risk_level"],
                message=f"{ai_result['risk_level'].title()}-risk {report.report_type.lower()} reported at {report.location}",
                time=datetime.now(timezone.utc).isoformat(),
                related_report_id=report_id,
                status="Open",
            )))
        return report
    except PyMongoError:
        # Standalone MongoDB has no multi-document transactions: undo this report's partial writes.
        try:
            _col("reports").delete_many({"id": report_id})
            _col("analyses").delete_many({"report_id": report_id})
            _col("reviews").delete_many({"report_id": report_id})
            _col("alerts").delete_many({"related_report_id": report_id})
        except PyMongoError:
            pass
        raise


def create_report(normalized: dict) -> Report:
    return _persist(normalized, _run_ai(normalized))


def bulk_create_reports(normalized_list: list[dict]) -> list[Report]:
    # Analyse every row with the real engine first, so an engine failure cannot leave a half-imported file.
    results = [(n, _run_ai(n)) for n in normalized_list]
    return [_persist(n, ai) for n, ai in results]


# ---------- reports ----------

def list_reports(filters: dict = None) -> list[Report]:
    filters = filters or {}
    query: dict = {}
    if filters.get("report_type"):
        query["report_type"] = filters["report_type"]
    if filters.get("department"):
        query["department"] = _contains(filters["department"])
    if filters.get("location"):
        query["location"] = _contains(filters["location"])
    if filters.get("risk_level"):
        query["risk_level"] = str(filters["risk_level"]).upper()
    if filters.get("search"):
        rx = _contains(filters["search"])
        query["$or"] = [{"description": rx}, {"location": rx}]
    items = [_to(Report, d) for d in _col("reports").find(query)]
    return sorted(items, key=lambda r: _risk_sort_key(r.risk_level, r.submitted_at, r.id))


def get_report(report_id: int) -> Report | None:
    return _to(Report, _col("reports").find_one({"id": report_id}))


def all_reports() -> list[Report]:
    return [_to(Report, d) for d in _col("reports").find({})]


# ---------- analyses ----------

def get_analysis(report_id: int) -> Analysis | None:
    return _to(Analysis, _col("analyses").find_one({"report_id": report_id}))


def list_analyses() -> list[Analysis]:
    return [_to(Analysis, d) for d in _col("analyses").find({})]


def all_analyses() -> dict[int, Analysis]:
    return {a.report_id: a for a in list_analyses()}


# ---------- reviews ----------

def list_reviews(risk_level: str | None = None) -> list[Review]:
    query = {"risk_level": risk_level.upper()} if risk_level else {}
    items = [_to(Review, d) for d in _col("reviews").find(query)]
    ids = [r.report_id for r in items]
    submitted = {d["id"]: d.get("submitted_at") for d in _col("reports").find({"id": {"$in": ids}}, {"id": 1, "submitted_at": 1})}
    return sorted(items, key=lambda r: _risk_sort_key(r.risk_level, submitted.get(r.report_id), r.id))


def get_review(review_id: int) -> Review | None:
    return _to(Review, _col("reviews").find_one({"id": review_id}))


def update_review(review_id: int, status: str, comment: str) -> Review | None:
    doc = _col("reviews").find_one_and_update(
        {"id": review_id},
        {"$set": {"status": status, "comment": comment}},
        return_document=ReturnDocument.AFTER,
    )
    review = _to(Review, doc)
    if not review:
        return None
    _col("reports").update_one(
        {"id": review.report_id},
        {"$set": {"review_status": "Reviewed" if status in ("Confirmed", "Modified") else "Pending"}},
    )
    return review


# ---------- alerts ----------

def list_alerts() -> list[Alert]:
    return sorted((_to(Alert, d) for d in _col("alerts").find({})), key=lambda a: a.id, reverse=True)


def get_alert(alert_id: int) -> Alert | None:
    return _to(Alert, _col("alerts").find_one({"id": alert_id}))
