"""User profile endpoints."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import (
    EmployerProfileResponse,
    EmployerProfileUpdate,
    StudentProfileResponse,
    StudentProfileUpdate,
    UserPublicResponse,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/profile", response_model=UserPublicResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Return full profile for the current user.

    Returns StudentProfileResponse or EmployerProfileResponse based on role.
    """
    return current_user


@router.put("/profile", response_model=UserPublicResponse)
def update_profile(
    payload: StudentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update student or employer profile fields."""
    update_data = payload.model_dump(exclude_none=True)

    # Convert nested Pydantic models to dicts for JSON storage
    for key in ("skills", "education", "projects"):
        if key in update_data and isinstance(update_data[key], list):
            update_data[key] = [
                item.model_dump() if hasattr(item, "model_dump") else item
                for item in update_data[key]
            ]

    for field, value in update_data.items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Soft-delete the current user's account by setting is_active=False."""
    current_user.is_active = False
    db.add(current_user)
    db.commit()
    return None
