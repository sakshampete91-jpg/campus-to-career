"""Applications endpoints."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_student
from app.models.application import Application
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate,
)

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("/", response_model=List[ApplicationResponse])
def list_applications(
    current_user: User = Depends(get_current_active_student),
    db: Session = Depends(get_db),
):
    """List all applications / saved opportunities for the current student."""
    apps = (
        db.query(Application)
        .filter(Application.student_id == current_user.id)
        .order_by(Application.created_at.desc())
        .all()
    )
    return apps


@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def save_opportunity(
    payload: ApplicationCreate,
    current_user: User = Depends(get_current_active_student),
    db: Session = Depends(get_db),
):
    """Save an opportunity (creates a record with status='saved')."""
    # Prevent duplicate saves
    existing = db.query(Application).filter(
        Application.student_id == current_user.id,
        Application.opportunity_id == payload.opportunity_id,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already saved or applied to this opportunity.",
        )

    app = Application(
        student_id=current_user.id,
        opportunity_id=payload.opportunity_id,
        status="saved",
        notes=payload.notes,
        resume_id=payload.resume_id,
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: str,
    payload: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_active_student),
    db: Session = Depends(get_db),
):
    """Update the status of an application."""
    app = db.query(Application).filter(
        Application.id == application_id,
        Application.student_id == current_user.id,
    ).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    app.status = payload.status
    # Record applied_at timestamp when transitioning to 'applied'
    if payload.status == "applied" and app.applied_at is None:
        app.applied_at = datetime.now(timezone.utc)

    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    application_id: str,
    current_user: User = Depends(get_current_active_student),
    db: Session = Depends(get_db),
):
    """Remove a saved/applied record."""
    app = db.query(Application).filter(
        Application.id == application_id,
        Application.student_id == current_user.id,
    ).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )
    db.delete(app)
    db.commit()
    return None
