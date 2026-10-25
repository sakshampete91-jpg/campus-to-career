"""Pydantic schemas for Application."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator

from app.schemas.opportunity import OpportunityResponse


class ApplicationCreate(BaseModel):
    opportunity_id: str
    notes: Optional[str] = None
    resume_id: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed = {"saved", "applied", "under_review", "interview", "rejected", "selected"}
        if v not in allowed:
            raise ValueError(f"status must be one of {allowed}")
        return v


class ApplicationResponse(BaseModel):
    id: str
    student_id: str
    opportunity_id: str
    status: str
    resume_id: Optional[str] = None
    notes: Optional[str] = None
    applied_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    opportunity: Optional[OpportunityResponse] = None

    model_config = {"from_attributes": True}
