from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.models.project import Project
from app.models.chat import Conversation, Message
from app.schemas.chat import ChatRequest, MessageResponse, ConversationResponse
from app.rag.orchestrator import rag_orchestrator
from app.rag.citation_builder import citation_builder
from app.services.llm_service import llm_service
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.post("", response_model=MessageResponse)
async def chat_with_collection(
    chat_in: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == chat_in.project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Get or create conversation
    if chat_in.conversation_id:
        conversation = db.query(Conversation).filter(Conversation.id == chat_in.conversation_id).first()
    else:
        conversation = Conversation(project_id=chat_in.project_id, title=chat_in.message[:40])
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    # 1. Save User Message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=chat_in.message
    )
    db.add(user_msg)
    db.commit()

    # 2. Retrieve Relevant Chunks via RAG Pipeline
    chunks = rag_orchestrator.retrieve_context(
        db=db,
        project_id=chat_in.project_id,
        query=chat_in.message,
        paper_ids=chat_in.paper_ids,
        strategy=chat_in.strategy or "hybrid",
        top_k=5
    )

    # 3. Build Citations Cards
    citations = citation_builder.build_citations(chunks)

    # 4. Generate Grounded Answer via LLM Service
    llm_res = await llm_service.generate_grounded_answer(
        query=chat_in.message,
        retrieved_passages=chunks
    )

    # 5. Save Assistant Message
    assistant_msg = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=llm_res["answer"],
        citations=citations
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return assistant_msg

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation_history(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv
