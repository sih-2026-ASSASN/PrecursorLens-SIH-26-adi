from typing import Optional, List
from pydantic import BaseModel, Field


class TextReportIn(BaseModel):
    report_type: str
    location: str
    department: str
    description: str = Field(min_length=1)


class ReportOut(BaseModel):
    id: int
    report_type: str
    location: str
    department: str
    description: str
    source_format: str
    submitted_at: str
    risk_level: str
    sif_detected: bool
    review_status: str


class AnalysisOut(BaseModel):
    report_id: int
    sif_detected: bool
    risk_level: str
    risk_score: int
    confidence: float
    precursors: List[str]
    hazards: List[str]
    control_gaps: List[str]
    evidence: List[str]
    recommendations: List[str]


class ReviewUpdateIn(BaseModel):
    status: str
    comment: Optional[str] = ""
