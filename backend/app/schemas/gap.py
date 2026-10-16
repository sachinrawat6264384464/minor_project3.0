from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class GapAnalysisRequest(BaseModel):
    project_id: str
    topic: str
    paper_ids: Optional[List[str]] = None
    search_depth: Optional[str] = "standard"  # quick, standard, deep

class EvidenceItem(BaseModel):
    id: str
    paper_title: str
    page_number: Optional[str] = None
    excerpt: str
    evidence_type: str  # SUPPORTING, CONTRADICTING
    is_explicit: str  # EXPLICIT, INFERRED

class CandidateGapResponse(BaseModel):
    id: str
    title: str
    category: str
    description: str
    confidence_score: float
    evidence_strength: str
    potential_question: Optional[str] = None
    suggested_experiment: Optional[str] = None
    evidence_items: List[EvidenceItem] = []

class GapAnalysisResponse(BaseModel):
    id: str
    project_id: str
    topic: str
    status: str
    progress: float
    summary: Optional[str] = None
    candidate_gaps: List[CandidateGapResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True
