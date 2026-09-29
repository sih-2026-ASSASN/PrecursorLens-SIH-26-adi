from fastapi import APIRouter
from app.services import analytics_service
from app.analytics import sif_metrics, trend_analysis, failure_metrics

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/overview")
def get_overview():
    return analytics_service.overview()


@router.get("/risk-trends")
def get_risk_trends():
    return trend_analysis.risk_trend()


@router.get("/sif-trends")
def get_sif_trends():
    return sif_metrics.sif_trend()


@router.get("/hazards")
def get_hazards():
    return analytics_service.hazards()


@router.get("/departments")
def get_departments():
    return analytics_service.departments()


@router.get("/locations")
def get_locations():
    return analytics_service.locations()


@router.get("/control-gaps")
def get_control_gaps():
    return failure_metrics.control_gap_frequency()
