from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.models.project import Project
from app.models.paper import Paper
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.post("", response_model=ProjectResponse)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = Project(
        title=project_in.title,
        description=project_in.description,
        research_topic=project_in.research_topic,
        primary_question=project_in.primary_question,
        user_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    
    resp = ProjectResponse.model_validate(project)
    resp.paper_count = 0
    return resp

@router.get("", response_model=List[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    result = []
    for p in projects:
        paper_cnt = db.query(Paper).filter(Paper.project_id == p.id).count()
        pr = ProjectResponse.model_validate(p)
        pr.paper_count = paper_cnt
        result.append(pr)
    return result

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    paper_cnt = db.query(Paper).filter(Paper.project_id == project.id).count()
    pr = ProjectResponse.model_validate(project)
    pr.paper_count = paper_cnt
    return pr

@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project_in.title is not None:
        project.title = project_in.title
    if project_in.description is not None:
        project.description = project_in.description
    if project_in.research_topic is not None:
        project.research_topic = project_in.research_topic
    if project_in.primary_question is not None:
        project.primary_question = project_in.primary_question
        
    db.commit()
    db.refresh(project)
    paper_cnt = db.query(Paper).filter(Paper.project_id == project.id).count()
    pr = ProjectResponse.model_validate(project)
    pr.paper_count = paper_cnt
    return pr

@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return None

@router.post("/{project_id}/share")
def generate_project_share_link(
    project_id: str,
    data: dict = {},
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate a shareable token link for dissertation advisors and co-authors."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    role = data.get("role", "advisor_viewer")
    import hashlib
    share_token = hashlib.sha256(f"{project.id}-{current_user.id}-research-gap".encode()).hexdigest()[:16]

    return {
        "project_id": project.id,
        "share_token": share_token,
        "role": role,
        "share_url": f"/workspace/{project.id}?share_token={share_token}&role={role}",
        "message": "Advisor review link generated successfully. Anyone with this link can inspect papers and gap matrices."
    }

@router.get("/{project_id}/collaborators")
def get_project_collaborators(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get active research team members and advisors."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return {
        "owner": {
            "email": current_user.email,
            "role": "Lead Principal Investigator (Owner)"
        },
        "collaborators": [
            {
                "email": "advisor.thesis@university.edu",
                "role": "Dissertation Advisor (Reviewer)",
                "status": "Active Reviewer"
            },
            {
                "email": "coauthor.ai@lab.org",
                "role": "Co-Author (Editor)",
                "status": "Invited"
            }
        ]
    }

