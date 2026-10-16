from sqlalchemy import Column, String, Text, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

class ResearchGapAnalysis(Base):
    __tablename__ = "research_gap_analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    topic = Column(String, nullable=False)
    status = Column(String, default="RUNNING")  # RUNNING, COMPLETED, FAILED
    progress = Column(Float, default=0.0)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="gap_analyses")
    candidate_gaps = relationship("CandidateGap", back_populates="analysis", cascade="all, delete-orphan")

class CandidateGap(Base):
    __tablename__ = "candidate_gaps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String, ForeignKey("research_gap_analyses.id"), nullable=False)
    
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Underexplored Question, Dataset Limitation, Baseline Gap, Inconsistent Findings, etc.
    description = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.8)  # 0.0 to 1.0
    evidence_strength = Column(String, default="HIGH")  # HIGH, MEDIUM, LOW
    
    potential_question = Column(Text, nullable=True)
    suggested_experiment = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    analysis = relationship("ResearchGapAnalysis", back_populates="candidate_gaps")
    evidence_items = relationship("GapEvidence", back_populates="candidate_gap", cascade="all, delete-orphan")

class GapEvidence(Base):
    __tablename__ = "gap_evidence"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_gap_id = Column(String, ForeignKey("candidate_gaps.id"), nullable=False)
    paper_id = Column(String, ForeignKey("papers.id"), nullable=True)
    
    paper_title = Column(String, nullable=False)
    page_number = Column(String, nullable=True)
    excerpt = Column(Text, nullable=False)
    evidence_type = Column(String, nullable=False)  # SUPPORTING, CONTRADICTING
    is_explicit = Column(String, default="INFERRED")  # EXPLICIT, INFERRED

    candidate_gap = relationship("CandidateGap", back_populates="evidence_items")
