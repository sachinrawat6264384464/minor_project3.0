from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from app.db.session import get_db
from app.models.user import User
from app.models.project import Project
from app.models.paper import Paper
from app.schemas.paper import PaperSearchQuery, PaperCreate, PaperResponse, BatchIngestRequest
from app.services.paper_discovery import discovery_service
from app.services.pdf_ingestion import pdf_ingestion_service
from app.api.routes.auth import get_current_user
from app.core.config import settings

router = APIRouter()

@router.post("/search")
async def search_academic_papers(query_in: PaperSearchQuery):
    results = await discovery_service.search_all(
        query=query_in.query, 
        limit=query_in.limit or 10,
        source=query_in.source or "all"
    )
    return {"query": query_in.query, "count": len(results), "papers": results}

@router.post("/batch-process")
async def batch_process_papers(
    batch_in: BatchIngestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == batch_in.project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    processed_papers = []
    for item in batch_in.papers:
        # Check if already exists in this project
        existing = db.query(Paper).filter(
            Paper.project_id == batch_in.project_id,
            Paper.title == item.title
        ).first()

        if existing:
            paper = existing
        else:
            paper = Paper(
                project_id=batch_in.project_id,
                doi=item.doi,
                title=item.title,
                abstract=item.abstract,
                authors=item.authors,
                year=item.year,
                venue=item.venue,
                citation_count=item.citation_count or 0,
                source_url=item.source_url,
                pdf_url=item.pdf_url,
                is_open_access=item.is_open_access,
                ingestion_status="PROCESSING"
            )
            db.add(paper)
            db.commit()
            db.refresh(paper)

        # Ingestion into vector DB
        if item.pdf_url:
            await pdf_ingestion_service.download_and_index_pdf(db, paper, item.pdf_url)
        else:
            await pdf_ingestion_service.index_paper_abstract_and_metadata(db, paper)

        db.refresh(paper)
        processed_papers.append({
            "id": paper.id,
            "title": paper.title,
            "ingestion_status": paper.ingestion_status,
            "year": paper.year,
            "citation_count": paper.citation_count,
            "has_full_pdf": bool(paper.local_file_path)
        })

    return {
        "status": "success",
        "count": len(processed_papers),
        "papers": processed_papers
    }

@router.post("", response_model=PaperResponse)
async def add_paper_to_project(
    paper_in: PaperCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == paper_in.project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    paper = Paper(
        project_id=paper_in.project_id,
        doi=paper_in.doi,
        title=paper_in.title,
        abstract=paper_in.abstract,
        authors=paper_in.authors,
        year=paper_in.year,
        venue=paper_in.venue,
        citation_count=paper_in.citation_count or 0,
        source_url=paper_in.source_url,
        pdf_url=paper_in.pdf_url,
        is_open_access=paper_in.is_open_access,
        ingestion_status="INDEXED" if not paper_in.pdf_url else "PENDING"
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)

    return paper

@router.post("/upload", response_model=PaperResponse)
async def upload_pdf_paper(
    project_id: str = Form(...),
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    content = await file.read()
    file_hash = pdf_ingestion_service.compute_file_hash(content)

    # Save to Neon Object Storage bucket or local directory
    file_id = str(uuid.uuid4())
    saved_filename = f"{file_id}_{file.filename}"
    from app.services.storage_service import storage_service
    file_path = storage_service.upload_file(content, saved_filename)

    clean_title = file.filename.replace(".pdf", "").replace("_", " ").title()

    paper = Paper(
        project_id=project_id,
        title=clean_title,
        local_file_path=file_path,
        file_hash=file_hash,
        ingestion_status="PROCESSING"
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)

    # Run background ingestion
    if background_tasks:
        background_tasks.add_task(
            pdf_ingestion_service.process_and_index_paper,
            db=db,
            paper=paper,
            pdf_bytes=content
        )
    else:
        await pdf_ingestion_service.process_and_index_paper(db, paper, content)

    return paper

@router.get("/project/{project_id}", response_model=List[PaperResponse])
def get_project_papers(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db.query(Paper).filter(Paper.project_id == project_id).all()

@router.get("/{paper_id}/bibtex")
def get_paper_bibtex(
    paper_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.utils.bibtex import generate_bibtex
    from fastapi import Response
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    bib_str = generate_bibtex({
        "title": paper.title,
        "authors": paper.authors,
        "year": paper.year,
        "venue": paper.venue,
        "doi": paper.doi
    })

    return Response(
        content=bib_str,
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename={paper_id}.bib"}
    )

