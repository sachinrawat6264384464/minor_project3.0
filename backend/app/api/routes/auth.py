from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token, ALGORITHM
from app.core.config import settings

import uuid
from typing import Optional

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_current_user(db: Session = Depends(get_db), token: Optional[str] = Depends(oauth2_scheme)) -> User:
    if token:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id:
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    return user
        except JWTError:
            pass

    # Seamless scholar researcher fallback (for local demo & direct navigation)
    scholar_user = db.query(User).filter(User.email == "scholar@example.com").first()
    if scholar_user:
        return scholar_user
    
    first_user = db.query(User).first()
    if first_user:
        return first_user

    # Auto-provision if database has no users yet
    new_user = User(
        id=str(uuid.uuid4()),
        email="scholar@example.com",
        full_name="Dr. Vance (PhD Researcher)",
        hashed_password=get_password_hash("scholar123"),
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
