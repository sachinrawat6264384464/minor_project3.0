from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class CitationItem(BaseModel):
    paper_id: str
    title: str
    year: Optional[int] = None
    doi: Optional[str] = None
    page_number: Optional[int] = None
    section_name: Optional[str] = None
    excerpt: str

class ChatRequest(BaseModel):
    project_id: str
    message: str
    conversation_id: Optional[str] = None
    paper_ids: Optional[List[str]] = None  # Specific paper filter
    strategy: Optional[str] = "hybrid"  # dense, bm25, hybrid, graph, iterative

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    citations: List[CitationItem] = []
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: str
    project_id: str
    title: str
    created_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True
