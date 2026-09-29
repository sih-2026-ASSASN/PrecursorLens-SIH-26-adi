"""
AI/NLP Integration Layer
=========================
This is the ONLY module that should change when the real AI/NLP team's
model/API is connected. The frontend and backend routes never call the AI
model directly — they always go through `analyze_report()` below.

Now wired to the real PrecursorLens AI/NLP engine (app/ai/engine/predict.py,
a TF-IDF + Logistic Regression classifier trained on SIF report text). The
engine's own analyze_report(text, site) output is mapped here into the
existing Analysis contract so response_mapper.py and every downstream
route/page keep working unmodified.
"""
from app.ai.engine.predict import analyze_report as run_sif_engine


def _risk_level_from_score(score: int) -> str:
    if score >= 85:
        return "CRITICAL"
    if score >= 65:
        return "HIGH"
    if score >= 35:
        return "MEDIUM"
    return "LOW"


def analyze_report(report: dict) -> dict:
    """
    Contract: given a normalized report dict, return a structured SIF
    analysis dict. Internals now call the real AI/NLP engine — the return
    shape is unchanged so response_mapper.py and the API routes keep
    working unmodified.
    """
    text = report.get("description") or ""
    site = report.get("location") or "Unknown Site"

    result = run_sif_engine(text, site=site)

    hazard = result.get("hazard")
    barrier = result.get("barrier_failed")
    risk_score = int(round(result.get("sif_risk_score", 0)))
    risk_level = _risk_level_from_score(risk_score)

    recommendations = []
    if barrier:
        recommendations.append(
            f"Restore {barrier.title()} control and verify before work resumes — requires safety review."
        )
    if hazard and not barrier:
        recommendations.append(
            f"Confirm applicable controls are in place for {hazard.title()} exposure — requires safety review."
        )
    if not recommendations:
        recommendations.append("No critical control gaps detected by the model — log for routine safety review.")

    return {
        "sif_detected": bool(result.get("is_sif_potential")),
        "risk_level": risk_level,
        "risk_score": risk_score,
        "confidence": float(result.get("ai_confidence", 0.0)),
        "precursors": result.get("life_saving_rules", []),
        "hazards": [hazard.title()] if hazard else [],
        "control_gaps": [barrier.title()] if barrier else [],
        "evidence": result.get("evidence_reasons", []),
        "recommendations": recommendations,
    }
