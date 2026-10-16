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

@router.get("/project/{project_id}/latex")
def get_project_latex_package(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate complete IEEE LaTeX .tex manuscript and .bib bibliography."""
    from app.models.project import Project
    from app.models.paper import Paper
    from app.models.gap import ResearchGapAnalysis, CandidateGap
    from app.services.latex_exporter import latex_exporter

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    papers = db.query(Paper).filter(Paper.project_id == project_id).all()
    papers_data = [
        {
            "id": p.id,
            "title": p.title,
            "authors": p.authors or ["Academic Author"],
            "year": p.year or 2024,
            "venue": p.venue or "Journal of Artificial Intelligence",
            "doi": p.doi,
            "citation_count": p.citation_count or 0,
            "is_open_access": p.is_open_access
        }
        for p in papers
    ]

    analysis = db.query(ResearchGapAnalysis).filter(ResearchGapAnalysis.project_id == project_id).order_by(ResearchGapAnalysis.created_at.desc()).first()
    gaps_data = []
    if analysis:
        c_gaps = db.query(CandidateGap).filter(CandidateGap.analysis_id == analysis.id).all()
        gaps_data = [
            {
                "title": g.title,
                "category": g.category,
                "description": g.description,
                "confidence_score": g.confidence_score,
                "potential_question": g.potential_question,
                "suggested_experiment": g.suggested_experiment
            }
            for g in c_gaps
        ]

    # Generate manuscript and bibliography
    tex_content = latex_exporter.generate_latex_manuscript(
        project_title=project.title,
        topic=project.description or project.title,
        papers=papers_data,
        gaps=gaps_data
    )
    bib_content = latex_exporter.generate_bibtex_corpus(papers_data)

    return {
        "project_id": project_id,
        "title": project.title,
        "paper_count": len(papers_data),
        "gap_count": len(gaps_data),
        "tex_content": tex_content,
        "bib_content": bib_content,
        "filename": f"{project.title.lower().replace(' ', '_')}_manuscript.tex"
    }

@router.get("/project/{project_id}/download-latex")
def download_latex_file(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.project import Project
    from app.models.paper import Paper
    from app.models.gap import ResearchGapAnalysis, CandidateGap
    from app.services.latex_exporter import latex_exporter

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    papers = db.query(Paper).filter(Paper.project_id == project_id).all()
    papers_data = [{"id": p.id, "title": p.title, "authors": p.authors, "year": p.year, "citation_count": p.citation_count} for p in papers]
    analysis = db.query(ResearchGapAnalysis).filter(ResearchGapAnalysis.project_id == project_id).order_by(ResearchGapAnalysis.created_at.desc()).first()
    gaps_data = []
    if analysis:
        c_gaps = db.query(CandidateGap).filter(CandidateGap.analysis_id == analysis.id).all()
        gaps_data = [{"title": g.title, "category": g.category, "description": g.description, "confidence_score": g.confidence_score, "potential_question": g.potential_question, "suggested_experiment": g.suggested_experiment} for g in c_gaps]

    tex_content = latex_exporter.generate_latex_manuscript(project.title, project.description or project.title, papers_data, gaps_data)
    filename = f"{project.title.lower().replace(' ', '_')}_manuscript.tex"

    return Response(
        content=tex_content,
        media_type="application/x-tex",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/project/{project_id}/podcast-script")
async def generate_podcast_overview(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate NotebookLM-style 2-person academic dialogue (Dr. Alex & Dr. Taylor)."""
    from app.models.project import Project
    from app.models.paper import Paper
    from app.models.gap import ResearchGapAnalysis, CandidateGap

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    papers = db.query(Paper).filter(Paper.project_id == project_id).all()
    analysis = db.query(ResearchGapAnalysis).filter(ResearchGapAnalysis.project_id == project_id).order_by(ResearchGapAnalysis.created_at.desc()).first()
    top_gap = "Cross-domain evaluation robustness"
    if analysis:
        c_gap = db.query(CandidateGap).filter(CandidateGap.analysis_id == analysis.id).first()
        if c_gap:
            top_gap = c_gap.title

    p_names = [p.title[:35] for p in papers[:3]] or ["state-of-the-art transformer baselines"]

    dialogue = [
        {
            "speaker": "Dr. Alex",
            "role": "Host / Methodologist",
            "gender": "male",
            "text": f"Welcome back to the Academic Synthesis podcast. Today we are doing a deep dive into {project.title}. Alex, what stood out to you right away across these {len(papers)} papers?"
        },
        {
            "speaker": "Dr. Taylor",
            "role": "Critic / Gap Analyst",
            "gender": "female",
            "text": f"Thanks, Alex! What immediately caught my attention was the methodology in papers like {', '.join(p_names)}. While the performance benchmarks look impressive on paper, our limitation extraction revealed a major vulnerability."
        },
        {
            "speaker": "Dr. Alex",
            "role": "Host / Methodologist",
            "gender": "male",
            "text": f"You mean the research gap around '{top_gap}'?"
        },
        {
            "speaker": "Dr. Taylor",
            "role": "Critic / Gap Analyst",
            "gender": "female",
            "text": f"Exactly! Several authors noted that testing was restricted to homogeneous benchmark splits. When you introduce real-world distribution shift, accuracy degrades significantly."
        },
        {
            "speaker": "Dr. Alex",
            "role": "Host / Methodologist",
            "gender": "male",
            "text": f"That represents an extraordinary opportunity for any researcher writing a thesis or paper right now. Solving this specific bottleneck with counter-evidence validation is where the next breakthrough lies."
        },
        {
            "speaker": "Dr. Taylor",
            "role": "Critic / Gap Analyst",
            "gender": "female",
            "text": "Couldn't agree more. Make sure to check the structured hypothesis and ablation experiment suggestions generated in your report dashboard!"
        }
    ]

    return {
        "project_id": project_id,
        "title": f"Audio Deep Dive: {project.title}",
        "speakers": ["Dr. Alex", "Dr. Taylor"],
        "dialogue": dialogue
    }

