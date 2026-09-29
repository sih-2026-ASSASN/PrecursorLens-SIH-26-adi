"""Maps a raw AI client response into the app's Analysis shape."""
from app.database.models import Analysis


def map_to_analysis(report_id: int, ai_response: dict) -> Analysis:
    return Analysis(
        report_id=report_id,
        sif_detected=ai_response["sif_detected"],
        risk_level=ai_response["risk_level"],
        risk_score=ai_response["risk_score"],
        confidence=ai_response["confidence"],
        precursors=ai_response.get("precursors", []),
        hazards=ai_response.get("hazards", []),
        control_gaps=ai_response.get("control_gaps", []),
        evidence=ai_response.get("evidence", []),
        recommendations=ai_response.get("recommendations", []),
    )
