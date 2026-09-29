"""Live integration status for /api/status: real MongoDB ping + real AI engine probe."""
import os
from pymongo.errors import PyMongoError

from app.database import connection

ENGINE_ENTRY_POINT = "app.ai.engine.predict.analyze_report"


def mongodb_status() -> dict:
    try:
        info = connection.ping()
        from app.services import report_service
        stored = report_service._col("reports").count_documents({})
        return {"connected": True, "database": info["database"], "server_version": info["server_version"], "reports_stored": stored, "error": None}
    except PyMongoError as exc:
        from app.config import settings
        return {"connected": False, "database": settings.mongodb_database, "server_version": None, "reports_stored": None, "error": f"{type(exc).__name__}: {exc}"}


def ai_status() -> dict:
    status = {"integrated": True, "active": False, "entry_point": ENGINE_ENTRY_POINT, "model_file": "sif_model.joblib",
              "model_loaded": False, "inference_ok": False, "error": None}
    try:
        from app.ai.engine import predict
        status["model_loaded"] = predict.model is not None
        status["model_file_present"] = os.path.exists(predict._MODEL_PATH)
        # Inference probe: runs the real engine on a fixed string; result is discarded, never stored.
        predict.analyze_report("status probe", site="status")
        status["inference_ok"] = True
        status["active"] = status["model_loaded"] and status["inference_ok"]
    except Exception as exc:
        status["error"] = f"{type(exc).__name__}: {exc}"
    return status


def full_status() -> dict:
    mongo, ai = mongodb_status(), ai_status()
    return {"status": "ok" if mongo["connected"] and ai["active"] else "degraded", "mongodb": mongo, "ai_engine": ai}
