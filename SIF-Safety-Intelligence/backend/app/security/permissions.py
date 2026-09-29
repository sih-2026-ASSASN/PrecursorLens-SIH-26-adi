"""Placeholder permission checks for future role-based access control."""

def can_review(user: dict) -> bool:
    return user.get("role") in ("safety_officer", "admin")
