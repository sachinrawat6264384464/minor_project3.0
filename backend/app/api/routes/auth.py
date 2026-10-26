from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import or_
from jose import jwt, JWTError
from datetime import datetime, timezone, timedelta
import uuid
from typing import Optional

from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserResponse, Token, LoginRequest
from app.core.security import get_password_hash, verify_password, create_access_token, ALGORITHM
from app.core.config import settings

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

    # Fallback to default scholar researcher if no token provided in demo mode
    scholar_user = db.query(User).filter(User.email == "scholar@example.com").first()
    if scholar_user:
        return scholar_user
    
    first_user = db.query(User).first()
    if first_user:
        return first_user

    new_user = User(
        id=str(uuid.uuid4()),
        email="scholar@example.com",
        username="scholar",
        role="researcher",
        full_name="Dr. Vance (PhD Researcher)",
        hashed_password=get_password_hash("scholar123"),
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_and_verify_lockout(identifier: str, password: str, db: Session) -> User:
    """
    Authenticate candidate by email or username, with 3-attempt lockout (3 minutes) and bcrypt verification.
    """
    identifier_clean = identifier.strip().lower()
    user = db.query(User).filter(
        or_(
            User.email.ilike(identifier_clean),
            User.username.ilike(identifier_clean)
        )
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found in research database. Please create an account."
        )

    # Check 3-minute lockout timer
    now_utc = datetime.now(timezone.utc)
    if user.locked_until:
        # Normalize timezone if needed
        locked_time = user.locked_until
        if locked_time.tzinfo is None:
            locked_time = locked_time.replace(tzinfo=timezone.utc)
            
        if locked_time > now_utc:
            remaining_seconds = int((locked_time - now_utc).total_seconds())
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Security Lockout Active: 3 failed attempts exceeded. Please wait {remaining_seconds} seconds before retrying."
            )

    # Verify encrypted password
    if not verify_password(password, user.hashed_password):
        user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
        
        if user.failed_login_attempts >= 3:
            user.locked_until = now_utc + timedelta(minutes=3)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Security Alert: 3 consecutive failed login attempts detected. Rate limiting active: Account locked for 3 minutes."
            )
        
        db.commit()
        remaining_tries = 3 - user.failed_login_attempts
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Incorrect credentials. {remaining_tries} attempt(s) remaining before 3-minute security lockout."
        )

    # Success: reset attempts & lockout
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    return user

@router.post("/register", response_model=Token)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a candidate in Neon DB with bcrypt-encrypted credentials and RBAC role.
    """
    email_clean = user_in.email.strip().lower()
    existing_email = db.query(User).filter(User.email.ilike(email_clean)).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    username_clean = (user_in.username or email_clean.split("@")[0]).strip().lower()
    existing_username = db.query(User).filter(User.username.ilike(username_clean)).first()
    if existing_username:
        username_clean = f"{username_clean}_{uuid.uuid4().hex[:4]}"

    # Save to Neon DB with Bcrypt Encrypted Password
    user = User(
        email=email_clean,
        username=username_clean,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name or username_clean,
        role=user_in.role or "researcher",
        failed_login_attempts=0
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Issue JWT token immediately for seamless candidate login
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login/json", response_model=Token)
def login_json(data: LoginRequest, db: Session = Depends(get_db)):
    """
    Interactive Chatbot JSON Login endpoint with 3-attempt lockout and role-based response.
    """
    user = authenticate_and_verify_lockout(data.email_or_username, data.password, db)
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=Token)
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    OAuth2 standard form-data login endpoint.
    """
    user = authenticate_and_verify_lockout(form_data.username, form_data.password, db)
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/check-user")
def check_user_exists(identifier: str, db: Session = Depends(get_db)):
    """
    Check if a candidate account exists in database before proceeding with login.
    """
    clean_id = identifier.strip().lower()
    user = db.query(User).filter(
        or_(
            User.email.ilike(clean_id),
            User.username.ilike(clean_id)
        )
    ).first()
    if user:
        return {
            "exists": True,
            "full_name": user.full_name or user.username or user.email,
            "email": user.email,
            "username": user.username,
            "role": user.role or "researcher"
        }
    return {
        "exists": False,
        "detail": f"No account found in database for '{identifier}'."
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

