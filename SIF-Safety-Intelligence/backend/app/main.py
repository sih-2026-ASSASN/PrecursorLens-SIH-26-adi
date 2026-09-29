import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError

from app.config import settings
from app.api import ingestion, reports, analysis, analytics, reviews, alerts, risk, failures
from app.database import connection
from app.services import status_service

log = logging.getLogger("precursorlens")

app = FastAPI(title="PrecursorLens API", description="SIF Safety Intelligence Platform — Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingestion.router)
app.include_router(reports.router)
app.include_router(analysis.router)
app.include_router(analytics.router)
app.include_router(reviews.router)
app.include_router(alerts.router)
app.include_router(risk.router)
app.include_router(failures.router)


@app.exception_handler(PyMongoError)
async def mongo_unavailable(request: Request, exc: PyMongoError):
    # No in-memory fallback: report the database problem instead of returning fake data.
    return JSONResponse(status_code=503, content={"detail": f"MongoDB is unavailable or failed: {type(exc).__name__}. Check MONGODB_URL and that MongoDB is running."})


@app.on_event("startup")
def on_startup():
    # Creates indexes only. NO demo/sample data is ever inserted.
    try:
        connection.ensure_indexes()
    except PyMongoError as exc:
        log.error("MongoDB not reachable at startup (%s). API will return 503 until it is available.", type(exc).__name__)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "PrecursorLens API"}


@app.get("/api/status")
def status():
    return status_service.full_status()


@app.get("/")
def root():
    return {"message": "PrecursorLens API — see /docs for API documentation"}
