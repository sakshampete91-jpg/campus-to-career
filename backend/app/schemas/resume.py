"""Pydantic schemas for Resume."""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ResumeMetaResponse(BaseModel):
    id: str
    student_id: str
    original_filename: str
    # storage_path intentionally omitted — never expose server paths
    parsed_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    is_active: bool

    model_config = {"from_attributes": True}


class TailorRequest(BaseModel):
    resume_id: Optional[str] = None
    resume_data: Optional[Dict[str, Any]] = None
    job_description: str
    target_role: str


class TailorResponse(BaseModel):
    tailored_content: Dict[str, Any]
    changes_explanation: List[str]
    comparison: Dict[str, Any]


class GeneratePDFRequest(BaseModel):
    tailored_content: Dict[str, Any]
