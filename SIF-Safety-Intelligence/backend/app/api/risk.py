from fastapi import APIRouter
from app.services import risk_service

router = APIRouter(prefix="/api/risk", tags=["risk"])


@router.get("/overall")
def overall():
    return risk_service.overall()


@router.get("/locations")
def locations():
    return risk_service.by_location()


@router.get("/departments")
def departments():
    return risk_service.by_department()
