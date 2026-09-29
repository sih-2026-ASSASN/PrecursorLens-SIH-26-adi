from collections import defaultdict
from app.services.report_service import all_reports


def sif_trend() -> dict:
    reports = sorted(all_reports(), key=lambda r: r.submitted_at)
    buckets = defaultdict(int)
    for r in reports:
        period = (r.submitted_at or "")[:7] or "Unknown"
        if r.sif_detected:
            buckets[period] += 1
    data = [{"period": k, "precursors": v} for k, v in sorted(buckets.items())]
    return {"data": data}


def report_type_distribution() -> list:
    reports = all_reports()
    counts = defaultdict(int)
    for r in reports:
        counts[r.report_type] += 1
    return [{"name": k, "value": v} for k, v in counts.items()]


def risk_distribution() -> list:
    reports = all_reports()
    counts = defaultdict(int)
    for r in reports:
        counts[r.risk_level] += 1
    return [{"name": k, "value": v} for k, v in counts.items()]
