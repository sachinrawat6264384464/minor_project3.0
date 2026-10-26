from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import re
from pydantic import BaseModel

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

class AssistantQueryRequest(BaseModel):
    message: str
    project_id: Optional[str] = None

@router.post("/assistant")
async def assistant_public_chat(
    data: AssistantQueryRequest,
    db: Session = Depends(get_db)
):
    """
    Floating AI RAG Bot endpoint with strict security guardrails against credential extraction.
    """
    msg_clean = data.message.strip().lower()

    # Security Guardrail: Intercept any attempt to ask for passwords or hashes
    password_patterns = [
        r"\bpassword\b",
        r"\bpasswords\b",
        r"\bpassw\b",
        r"\bkisi ka password\b",
        r"\badmin pass\b",
        r"\bsecret key\b",
        r"\bhashed_password\b",
        r"\bcredentials\b",
        r"\bshow password\b",
        r"\btell me password\b"
    ]
    for pattern in password_patterns:
        if re.search(pattern, msg_clean):
            return {
                "id": "sec-guardrail",
                "role": "assistant",
                "content": "🔒 Security Protocol Enforced: User passwords and authentication hashes are encrypted (bcrypt) and protected under zero-knowledge system isolation. System policy strictly prohibits disclosing credentials or private account data.",
                "citations": []
            }

    # If asking for account creation / login guidance
    if any(k in msg_clean for k in ["create account", "register", "sign up", "login", "signin", "kese banaye", "account banana"]):
        return {
            "id": "auth-guide",
            "role": "assistant",
            "content": "Welcome! You can log in or create your candidate research account directly inside this chat window using the tabs above (🔑 Log In / ✨ Create Account), or simply enter your username and password below.",
            "citations": []
        }

    # Retrieval from existing project or literature demo
    project = None
    if data.project_id:
        project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        project = db.query(Project).first()

    if project:
        chunks = rag_orchestrator.retrieve_context(
            db=db,
            project_id=project.id,
            query=data.message,
            strategy="hybrid",
            top_k=4
        )
        if chunks and len(chunks) > 0:
            citations = citation_builder.build_citations(chunks)
            llm_res = await llm_service.generate_grounded_answer(
                query=data.message,
                retrieved_passages=chunks
            )
            return {
                "id": f"asst-{project.id}",
                "role": "assistant",
                "content": llm_res.get("answer", ""),
                "citations": citations
            }

    # Fallback when query is not in database
    return {
        "id": "not-in-db",
        "role": "assistant",
        "content": "ℹ️ Target concept not found in the indexed literature database.\n\nPlease upload or ingest relevant papers in your workspace, or try asking about 'Vision Transformers', 'Hybrid RAG RRF', or '9-Stage Gap Discovery Engine'.",
        "citations": []
    }

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

@router.get("/providers")
def get_llm_providers():
    """Return available LLM providers and their configuration status."""
    return {
        "active_provider": llm_service.provider,
        "providers": llm_service.get_available_providers()
    }

@router.post("/provider/switch")
def switch_llm_provider(data: dict):
    """Switch active LLM provider (openai, gemini, groq, ollama)."""
    new_provider = data.get("provider", "openai")
    valid_providers = ["openai", "gemini", "groq", "ollama"]
    if new_provider not in valid_providers:
        raise HTTPException(status_code=400, detail=f"Invalid provider. Choose from {valid_providers}")
    llm_service.provider = new_provider
    return {
        "status": "success",
        "active_provider": llm_service.provider,
        "message": f"Active AI provider switched to {new_provider.upper()}"
    }

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
