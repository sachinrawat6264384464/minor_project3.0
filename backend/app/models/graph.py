from sqlalchemy import Column, String, ForeignKey, DateTime, JSON
from datetime import datetime, timezone
import uuid
from app.db.session import Base

class GraphEntity(Base):
    __tablename__ = "graph_entities"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False, index=True)
    entity_type = Column(String, nullable=False)  # Paper, Author, Method, Dataset, Metric, Limitation
    attributes = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class GraphRelationship(Base):
    __tablename__ = "graph_relationships"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    source_id = Column(String, ForeignKey("graph_entities.id"), nullable=False)
    target_id = Column(String, ForeignKey("graph_entities.id"), nullable=False)
    relation_type = Column(String, nullable=False)  # USES_DATASET, PROPOSES_METHOD, CITES, HAS_LIMITATION
    confidence = Column(String, default="HIGH")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
