from datetime import datetime, timezone
from app.services.report_service import all_reports, all_analyses, list_alerts
from app.analytics import risk_metrics, sif_metrics, failure_metrics, trend_analysis


def overview() -> dict:
    reports = all_reports()
    high_critical = [r for r in reports if r.risk_level in ("HIGH", "CRITICAL")]
    sif_count = sum(1 for r in reports if r.sif_detected)
    site_risk = risk_metrics.overall_site_risk_index()
    alerts = list_alerts()
    confidences = [a.confidence for a in all_analyses().values()]

    recent_high_risk = sorted(high_critical, key=lambda r: r.id, reverse=True)[:5]
    recent_alerts = [
        {"id": a.id, "severity": a.severity, "message": a.message, "time": a.time}
        for a in alerts[:5]
    ]

    return {
        "total_reports": len(reports),
        "sif_precursors": sif_count,
        "reviewed_reports": sum(1 for r in reports if r.review_status == "Reviewed"),
        "high_critical_reports": len(high_critical),
        "active_alerts": len([a for a in alerts if a.status == "Open"]),
        "site_risk_index": site_risk["index"],
        "site_risk_level": site_risk["level"],
        "avg_ai_confidence": round(sum(confidences) / len(confidences), 4) if confidences else None,
        "recent_high_risk_reports": [
            {"id": r.id, "description": r.description, "location": r.location, "submitted_at": r.submitted_at, "risk_level": r.risk_level}
            for r in recent_high_risk
        ],
        "recent_alerts": recent_alerts,
        "report_type_distribution": sif_metrics.report_type_distribution(),
        "risk_distribution": sif_metrics.risk_distribution(),
    }


def hazards() -> dict:
    return {"data": risk_metrics.overall_site_risk_index()["hazard_distribution"]}


def departments() -> dict:
    from app.analytics.risk_metrics import risk_by_department
    return risk_by_department()


def locations() -> dict:
    from app.analytics.risk_metrics import risk_by_location
    return risk_by_location()
