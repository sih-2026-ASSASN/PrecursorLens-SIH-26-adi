from fastapi import APIRouter, HTTPException
from app.services import report_service

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("")
def list_alerts():
    items = report_service.list_alerts()
    return {"items": items, "total": len(items)}


@router.get("/{alert_id}")
def get_alert(alert_id: int):
    alert = report_service.get_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
