"""Auth endpoints: register, login, /me."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import (
    StudentProfileResponse,
    EmployerProfileResponse,
    TokenResponse,
    UserPublicResponse,
    UserRegisterRequest,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserPublicResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new student or employer account."""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    new_user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role=payload.role,
        skills=[],
        education=[],
        projects=[],
        work_type_preference=[],
        opportunity_type_preference=[],
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=TokenResponse)
async def login(
    request: Request,
    db: Session = Depends(get_db),
):
    """Authenticate with email+password and return a JWT access token.

    Accepts both JSON body ({"email": "...", "password": "..."})
    and OAuth2 form-data (username=...&password=...).
    """
    content_type = request.headers.get("content-type", "")
    username = ""
    password = ""

    if "application/json" in content_type:
        try:
            body = await request.json()
            username = body.get("email") or body.get("username", "")
            password = body.get("password", "")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid JSON payload.",
            )
    else:
        try:
            form = await request.form()
            username = form.get("username") or form.get("email", "")
            password = form.get("password", "")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid form data.",
            )

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required.",
        )

    user = db.query(User).filter(User.email == str(username).strip()).first()
    if not user or not verify_password(str(password), user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserPublicResponse.model_validate(user),
    )


@router.get("/me", response_model=UserPublicResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's public profile."""
    return current_user


@router.get("/demo-session", response_model=TokenResponse)
def get_demo_session(role: str = "student", db: Session = Depends(get_db)):
    """Generate and return an instant active demo session token with zero login friction."""
    target_email = "employer1@demo.campustocareer.example" if role == "employer" else "student1@demo.campustocareer.example"
    user = db.query(User).filter(User.email == target_email).first()
    if not user:
        user = db.query(User).filter(User.role == role, User.is_active == True).first()
    if not user:
        user = db.query(User).filter(User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="No demo accounts available.")
    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserPublicResponse.model_validate(user),
    )
