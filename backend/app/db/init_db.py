from sqlalchemy.orm import Session
from app.db.session import engine
from app.models import Base, User
from app.core.security import get_password_hash

from sqlalchemy import text
from app.core.config import settings

def init_db(db: Session) -> None:
    # If using PostgreSQL / Neon, ensure pgvector extension is enabled
    if not settings.DATABASE_URL.startswith("sqlite"):
        try:
            with engine.connect() as conn:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
                conn.commit()
                print("pgvector extension initialized on PostgreSQL / Neon.")
        except Exception as e:
            print(f"pgvector extension check note: {e}")

    # Create tables if not present
    Base.metadata.create_all(bind=engine)

    # Create default demo/test user if not exists
    user = db.query(User).filter(User.email == "scholar@example.com").first()
    if not user:
        demo_user = User(
            email="scholar@example.com",
            hashed_password=get_password_hash("ResearchPass2026!"),
            full_name="Dr. Alex Vance",
            is_active=True,
            is_superuser=True
        )
        db.add(demo_user)
        db.commit()
