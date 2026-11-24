from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

try:
    from pgvector.sqlalchemy import Vector
    HAS_PGVECTOR = True
except ImportError:
    HAS_PGVECTOR = False

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    paper_id = Column(String, ForeignKey("papers.id"), nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    section_name = Column(String, nullable=True)
    page_number = Column(Integer, nullable=True)
    
    # Store JSON list of floats for embedding vector compatibility across SQLite/pgvector
    embedding = Column(JSON, nullable=True)
    
    # Native pgvector column for HNSW indexing in PostgreSQL (384-dim for bge-small-en-v1.5)
    if HAS_PGVECTOR:
        embedding_vec = Column(Vector(384), nullable=True)
    
    # Metadata for parent-child context
    parent_id = Column(String, nullable=True)
    chunk_metadata = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    paper = relationship("Paper", back_populates="chunks")
