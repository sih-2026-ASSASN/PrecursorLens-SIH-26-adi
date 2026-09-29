from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services import report_service

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("")
def list_reports(
    report_type: Optional[str] = None,
    department: Optional[str] = None,
    location: Optional[str] = None,
    risk_level: Optional[str] = None,
    search: Optional[str] = None,
):
    filters = {
        "report_type": report_type, "department": department,
        "location": location, "risk_level": risk_level, "search": search,
    }
    items = report_service.list_reports(filters)
    return {"items": items, "total": len(items)}


@router.get("/{report_id}")
def get_report(report_id: int):
    report = report_service.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
