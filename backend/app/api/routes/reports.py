from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.db.session import get_db
from app.models.user import User
from app.models.report import Report
from app.services.report_service import report_service
from app.api.routes.auth import get_current_user

router = APIRouter()

class ReportCreateRequest(BaseModel):
    project_id: str
    title: str
    report_type: Optional[str] = "LITERATURE_REVIEW"

@router.post("")
def generate_report(
    req: ReportCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = report_service.generate_report(
        db=db,
        project_id=req.project_id,
        title=req.title,
        report_type=req.report_type or "LITERATURE_REVIEW"
    )
    return report

@router.get("/project/{project_id}")
def get_project_reports(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Report).filter(Report.project_id == project_id).all()

@router.get("/{report_id}")
def get_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.get("/{report_id}/download")
def download_report(
    report_id: str,
    format: str = "markdown",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    filename = f"{report.title.replace(' ', '_')}.md"
    return Response(
        content=report.content_markdown,
        media_type="text/markdown",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
