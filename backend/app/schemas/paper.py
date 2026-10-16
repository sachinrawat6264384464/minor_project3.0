from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class PaperSearchQuery(BaseModel):
    query: str
    year_start: Optional[int] = None
    year_end: Optional[int] = None
    venue: Optional[str] = None
    source: Optional[str] = "all"  # openalex, semanticscholar, serpapi, all
    limit: Optional[int] = 10

class PaperBase(BaseModel):
    doi: Optional[str] = None
    title: str
    abstract: Optional[str] = None
    authors: List[str] = []
    year: Optional[int] = None
    venue: Optional[str] = None
    citation_count: Optional[int] = 0
    source_url: Optional[str] = None
    pdf_url: Optional[str] = None
    is_open_access: bool = False

class PaperCreate(PaperBase):
    project_id: str

class BatchIngestItem(BaseModel):
    doi: Optional[str] = None
    title: str
    abstract: Optional[str] = None
    authors: List[str] = []
    year: Optional[int] = None
    venue: Optional[str] = None
    citation_count: Optional[int] = 0
    source_url: Optional[str] = None
    pdf_url: Optional[str] = None
    is_open_access: bool = False

class BatchIngestRequest(BaseModel):
    project_id: str
    papers: List[BatchIngestItem]

class PaperResponse(PaperBase):
    id: str
    project_id: str
    ingestion_status: str
    error_message: Optional[str] = None
    extracted_findings: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PaperCompareRequest(BaseModel):
    paper_ids: List[str]
    project_id: str

class PaperComparisonResult(BaseModel):
    paper_id: str
    title: str
    authors: List[str]
    year: Optional[int]
    objective: str
    methodology: str
    dataset: str
    evaluation_metrics: str
    results: str
    limitations: str
    future_work: str
