from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.models.project import Project
from app.models.gap import ResearchGapAnalysis
from app.schemas.gap import GapAnalysisRequest, GapAnalysisResponse
from app.services.gap_analysis import gap_engine
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.post("/analyze", response_model=GapAnalysisResponse)
async def start_gap_analysis(
    req: GapAnalysisRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == req.project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    analysis = ResearchGapAnalysis(
        project_id=req.project_id,
        topic=req.topic or project.research_topic,
        status="RUNNING",
        progress=0.05
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    background_tasks.add_task(gap_engine.run_analysis, db=db, analysis_id=analysis.id)
    return analysis

@router.get("/{analysis_id}", response_model=GapAnalysisResponse)
def get_gap_analysis_status(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analysis = db.query(ResearchGapAnalysis).filter(ResearchGapAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis

@router.get("/project/{project_id}", response_model=List[GapAnalysisResponse])
def get_project_gap_analyses(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(ResearchGapAnalysis).filter(ResearchGapAnalysis.project_id == project_id).order_by(ResearchGapAnalysis.created_at.desc()).all()
