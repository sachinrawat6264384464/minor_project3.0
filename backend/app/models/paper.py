from sqlalchemy import Column, String, Text, Integer, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

class Paper(Base):
    __tablename__ = "papers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    doi = Column(String, index=True, nullable=True)
    title = Column(String, nullable=False, index=True)
    abstract = Column(Text, nullable=True)
    authors = Column(JSON, default=list)  # List of author names
    year = Column(Integer, nullable=True, index=True)
    venue = Column(String, nullable=True)
    citation_count = Column(Integer, default=0)
    source_url = Column(String, nullable=True)
    pdf_url = Column(String, nullable=True)
    local_file_path = Column(String, nullable=True)
    is_open_access = Column(Boolean, default=False)
    ingestion_status = Column(String, default="PENDING")  # PENDING, PROCESSING, INDEXED, FAILED
    error_message = Column(Text, nullable=True)
    file_hash = Column(String, index=True, nullable=True)
    
    # Extracted metadata fields (Methodology, Dataset, Results, Limitations, Future Work)
    extracted_findings = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="papers")
    sections = relationship("PaperSection", back_populates="paper", cascade="all, delete-orphan")
    chunks = relationship("DocumentChunk", back_populates="paper", cascade="all, delete-orphan")

class PaperSection(Base):
    __tablename__ = "paper_sections"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    paper_id = Column(String, ForeignKey("papers.id"), nullable=False)
    section_name = Column(String, nullable=False)  # Abstract, Intro, Methodology, Results, Discussion, Limitations, Future Work
    start_page = Column(Integer, default=1)
    end_page = Column(Integer, default=1)
    content = Column(Text, nullable=False)

    paper = relationship("Paper", back_populates="sections")
