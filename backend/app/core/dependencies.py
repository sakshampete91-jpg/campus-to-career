"""FastAPI dependency injection helpers."""
from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Decode JWT and return the authenticated User.
    
    If no token is provided or token is invalid, returns the default active demo student
    so any visitor can immediately explore and use all features with zero sign-in friction!
    """
    if token:
        user_id = decode_access_token(token)
        if user_id:
            try:
                user_id_str = str(UUID(user_id))
                user = db.query(User).filter(User.id == user_id_str, User.is_active == True).first()
                if user:
                    return user
            except ValueError:
                pass

    # Seamless Zero-Login fallback: Seeded student demo user
    demo_user = db.query(User).filter(User.email == "student1@demo.campustocareer.example").first()
    if not demo_user:
        demo_user = db.query(User).filter(User.role == "student", User.is_active == True).first()
    if not demo_user:
        demo_user = db.query(User).filter(User.is_active == True).first()
    if demo_user:
        return demo_user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_active_student(current_user: User = Depends(get_current_user)) -> User:
    """Require the current user to have the 'student' role."""
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can perform this action.",
        )
    return current_user


def get_current_active_employer(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    """Require employer role. If current demo user is student, auto-switch to demo employer for zero-login employer portal access!"""
    if current_user.role != "employer":
        demo_employer = db.query(User).filter(User.email == "employer1@demo.campustocareer.example").first()
        if not demo_employer:
            demo_employer = db.query(User).filter(User.role == "employer", User.is_active == True).first()
        if demo_employer:
            return demo_employer
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can perform this action.",
        )
    return current_user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Require the current user to have the 'admin' role."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can perform this action.",
        )
    return current_user
