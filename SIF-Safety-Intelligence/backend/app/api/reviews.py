from typing import Optional
from fastapi import APIRouter, HTTPException
from app.database.schemas import ReviewUpdateIn
from app.services import review_service

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.get("")
def list_reviews(risk_level: Optional[str] = None):
    items = review_service.list_all_reviews(risk_level or None)
    return {"items": items, "total": len(items)}


@router.get("/{review_id}")
def get_review(review_id: int):
    review = review_service.get_review(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.put("/{review_id}")
def update_review(review_id: int, payload: ReviewUpdateIn):
    review = review_service.submit_review(review_id, payload.status, payload.comment)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review
