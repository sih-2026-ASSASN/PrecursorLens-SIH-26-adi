from fastapi import APIRouter, HTTPException
from app.services import analysis_service

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.get("")
def list_analyses():
    return analysis_service.list_all_analyses()


@router.get("/{report_id}")
def get_analysis(report_id: int):
    analysis = analysis_service.get_analysis_for_report(report_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this report")
    return analysis
