from collections import defaultdict
from app.services.report_service import all_reports, all_analyses


def risk_trend() -> dict:
    """Monthly mean of the AI engine's risk_score for stored reports."""
    analyses = all_analyses()
    buckets = defaultdict(list)
    for r in sorted(all_reports(), key=lambda r: r.submitted_at or ""):
        a = analyses.get(r.id)
        if a is None:
            continue
        buckets[(r.submitted_at or "")[:7] or "Unknown"].append(a.risk_score)
    data = [{"period": k, "risk": round(sum(v) / len(v))} for k, v in sorted(buckets.items())]
    return {"data": data}
