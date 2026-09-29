"""
PostgreSQL-ready ORM-style dataclasses describing the core entities.
No live DB connection is wired yet (see connection.py) — the app currently
runs on an in-memory store (services/*.py) built to the same shape, so
swapping in real SQLAlchemy models later requires no API changes.
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Report:
    id: int
    report_type: str
    location: str
    department: str
    description: str
    source_format: str  # text | csv | json
    submitted_at: str
    risk_level: str = "MEDIUM"
    sif_detected: bool = False
    review_status: str = "Pending"  # Pending | Under Review | Reviewed


@dataclass
class Analysis:
    report_id: int
    sif_detected: bool
    risk_level: str
    risk_score: int
    confidence: float
    precursors: list = field(default_factory=list)
    hazards: list = field(default_factory=list)
    control_gaps: list = field(default_factory=list)
    evidence: list = field(default_factory=list)
    recommendations: list = field(default_factory=list)


@dataclass
class Review:
    id: int
    report_id: int
    description: str
    risk_level: str
    evidence: list
    status: str = "Pending"  # Pending | Confirmed | Modified
    comment: str = ""


@dataclass
class Alert:
    id: int
    severity: str  # CRITICAL | HIGH | MEDIUM | LOW
    message: str
    time: str
    related_report_id: Optional[int] = None
    status: str = "Open"


@dataclass
class LifeSavingRule:
    id: int
    title: str
    description: str
    controls: list
    related_precursor: str
