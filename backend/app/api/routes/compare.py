from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.models.project import Project
from app.models.paper import Paper
from app.schemas.paper import PaperCompareRequest, PaperComparisonResult
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.post("", response_model=List[PaperComparisonResult])
def compare_papers(
    req: PaperCompareRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == req.project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    papers = db.query(Paper).filter(Paper.id.in_(req.paper_ids)).all()
    results = []
    
    for p in papers:
        findings = p.extracted_findings or {}
        results.append(PaperComparisonResult(
            paper_id=p.id,
            title=p.title,
            authors=p.authors or [],
            year=p.year,
            objective=findings.get("objective") or p.abstract or "Not reported",
            methodology=findings.get("methodology", "Not reported"),
            dataset=findings.get("dataset", "Not reported"),
            evaluation_metrics=findings.get("evaluation_metrics", "Not reported"),
            results=findings.get("results", "Not reported"),
            limitations=findings.get("limitations", "Not reported"),
            future_work=findings.get("future_work", "Not reported")
        ))
    return results
