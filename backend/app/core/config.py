from typing import List, Optional
from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import field_validator
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_file_path = BASE_DIR / ".env"
if env_file_path.exists():
    load_dotenv(dotenv_path=env_file_path, override=True)

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Research Paper & Research Gap Finder"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "default_secret_key_change_in_production_12345"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    # Database
    DATABASE_URL: str = "sqlite:///./research_platform.db"

    # External APIs
    SERPAPI_API_KEY: Optional[str] = None
    SEMANTIC_SCHOLAR_API_KEY: Optional[str] = None
    SCOPUS_API_KEY: Optional[str] = None
    PAPERSWITHCODE_API_KEY: Optional[str] = None
    # Models & AI Providers
    AI_PROVIDER: str = "openai"  # "openai" | "gemini" | "groq" | "ollama"
    OPENAI_API_KEY: Optional[str] = None
    LLM_MODEL: str = "gpt-4o-mini"
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # Google Gemini
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # Groq (Ultra-fast free LLaMA 3.3)
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Ollama
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3:latest"
    EXTRACTION_LLM_MODEL: str = "gpt-4o-mini"
    EMBEDDING_MODEL_NAME: str = "BAAI/bge-small-en-v1.5"
    USE_LOCAL_EMBEDDINGS: bool = True

    # Upload & Storage
    UPLOAD_DIR: str = "./storage/uploads"
    MAX_UPLOAD_SIZE_MB: int = 50

    # Neon Object Storage / S3 Bucket Settings (Optional)
    NEON_OBJECT_STORAGE_ENDPOINT: Optional[str] = None
    NEON_OBJECT_STORAGE_BUCKET: Optional[str] = None
    NEON_OBJECT_STORAGE_ACCESS_KEY: Optional[str] = None
    NEON_OBJECT_STORAGE_SECRET_KEY: Optional[str] = None
    NEON_OBJECT_STORAGE_REGION: str = "auto"

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
