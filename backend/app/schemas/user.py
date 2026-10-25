"""Pydantic schemas for User."""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

import email_validator
email_validator.TEST_ENVIRONMENT = True

from pydantic import BaseModel, EmailStr, field_validator


# ---------------------------------------------------------------------------
# Nested helpers
# ---------------------------------------------------------------------------

class SkillEntry(BaseModel):
    name: str
    level: str = "beginner"  # beginner | intermediate | advanced

    @field_validator("level")
    @classmethod
    def validate_level(cls, v: str) -> str:
        allowed = {"beginner", "intermediate", "advanced"}
        if v not in allowed:
            raise ValueError(f"level must be one of {allowed}")
        return v


class EducationEntry(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    cgpa: Optional[str] = None


class ProjectEntry(BaseModel):
    name: str
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    url: Optional[str] = None


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "student"  # student | employer

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in {"student", "employer"}:
            raise ValueError("role must be 'student' or 'employer'")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("password must be at least 8 characters")
        return v


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    skills: Optional[List[SkillEntry]] = None
    education: Optional[List[EducationEntry]] = None
    academic_year: Optional[str] = None
    projects: Optional[List[ProjectEntry]] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    location_preference: Optional[str] = None
    work_type_preference: Optional[List[str]] = None
    opportunity_type_preference: Optional[List[str]] = None


class EmployerProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    company_description: Optional[str] = None


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class UserPublicResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class StudentProfileResponse(UserPublicResponse):
    skills: Optional[List[SkillEntry]] = None
    education: Optional[List[EducationEntry]] = None
    academic_year: Optional[str] = None
    projects: Optional[List[ProjectEntry]] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    location_preference: Optional[str] = None
    work_type_preference: Optional[List[str]] = None
    opportunity_type_preference: Optional[List[str]] = None


class EmployerProfileResponse(UserPublicResponse):
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    company_description: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublicResponse
