from app.services import report_service


def list_all_reviews(risk_level: str | None = None):
    return report_service.list_reviews(risk_level)


def get_review(review_id: int):
    return report_service.get_review(review_id)


def submit_review(review_id: int, status: str, comment: str):
    return report_service.update_review(review_id, status, comment)
