from fastapi import APIRouter
from app.services import failure_service
from app.analytics import trend_analysis

router = APIRouter(prefix="/api/failures", tags=["failures"])


@router.get("")
def get_failures():
    return failure_service.failures()


@router.get("/trends")
def get_trends():
    return trend_analysis.risk_trend()


@router.get("/control-gaps")
def get_control_gaps():
    return failure_service.control_gaps()
