from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.project import Project
from app.models.paper import Paper
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.get("/project/{project_id}")
def get_knowledge_graph(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    papers = db.query(Paper).filter(Paper.project_id == project_id).all()
    
    nodes = [
        {"id": f"project_{project_id}", "label": project.title, "type": "Project", "val": 25}
    ]
    edges = []

    for idx, p in enumerate(papers):
        p_node_id = f"paper_{p.id}"
        nodes.append({"id": p_node_id, "label": p.title[:30] + "...", "type": "Paper", "val": 15})
        edges.append({"source": f"project_{project_id}", "target": p_node_id, "label": "CONTAINS"})
        
        # Add mock method & dataset nodes
        method_id = f"method_{idx}"
        nodes.append({"id": method_id, "label": "Hybrid RAG / Vector Search", "type": "Method", "val": 10})
        edges.append({"source": p_node_id, "target": method_id, "label": "USES_METHOD"})

    if len(nodes) == 1:
        # Fallback interactive graph nodes if no papers ingested yet
        nodes.extend([
            {"id": "n1", "label": "Attention Mechanisms", "type": "Method", "val": 20},
            {"id": "n2", "label": "ImageNet Benchmark", "type": "Dataset", "val": 15},
            {"id": "n3", "label": "Out-of-Distribution Shift", "type": "Limitation", "val": 18}
        ])
        edges.extend([
            {"source": f"project_{project_id}", "target": "n1", "label": "EXPLORES"},
            {"source": "n1", "target": "n2", "label": "EVALUATED_ON"},
            {"source": "n1", "target": "n3", "label": "HAS_LIMITATION"}
        ])

    return {"nodes": nodes, "edges": edges}
