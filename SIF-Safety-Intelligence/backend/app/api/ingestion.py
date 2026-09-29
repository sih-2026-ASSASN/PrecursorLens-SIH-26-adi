from fastapi import APIRouter, UploadFile, File
from app.database.schemas import TextReportIn
from app.services import ingestion_service
from app.ingestion.validator import validate_file_type, validate_file_size

router = APIRouter(prefix="/api/ingestion", tags=["ingestion"])


@router.post("/text")
def ingest_text(payload: TextReportIn):
    return ingestion_service.ingest_text(payload.model_dump())


@router.post("/csv")
async def ingest_csv(file: UploadFile = File(...)):
    validate_file_type(file.filename, ".csv")
    content = await file.read()
    validate_file_size(len(content))
    return ingestion_service.ingest_csv(content)


@router.post("/json")
async def ingest_json(file: UploadFile = File(...)):
    validate_file_type(file.filename, ".json")
    content = await file.read()
    validate_file_size(len(content))
    return ingestion_service.ingest_json(content)
