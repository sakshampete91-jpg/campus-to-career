"""Pydantic schemas for Opportunity."""
from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, field_validator


class OpportunityCreate(BaseModel):
    title: str
    company_name: str
    company_website: Optional[str] = None
    description: str
    responsibilities: Optional[List[str]] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    compensation: Optional[str] = None
    is_paid: bool = False
    work_arrangement: str = "remote"
    location: Optional[str] = None
    experience_level: str = "entry"
    opportunity_type: str = "internship"
    deadline: Optional[date] = None
    application_url: Optional[str] = None
    listing_source: Optional[str] = None

    @field_validator("work_arrangement")
    @classmethod
    def validate_arrangement(cls, v: str) -> str:
        if v not in {"remote", "hybrid", "onsite"}:
            raise ValueError("work_arrangement must be remote, hybrid, or onsite")
        return v

    @field_validator("experience_level")
    @classmethod
    def validate_exp_level(cls, v: str) -> str:
        if v not in {"entry", "junior", "mid", "senior"}:
            raise ValueError("experience_level must be entry, junior, mid, or senior")
        return v

    @field_validator("opportunity_type")
    @classmethod
    def validate_opp_type(cls, v: str) -> str:
        if v not in {"internship", "freelance", "part-time", "full-time"}:
            raise ValueError("opportunity_type must be internship, freelance, part-time, or full-time")
        return v


class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    compensation: Optional[str] = None
    is_paid: Optional[bool] = None
    work_arrangement: Optional[str] = None
    location: Optional[str] = None
    experience_level: Optional[str] = None
    opportunity_type: Optional[str] = None
    deadline: Optional[date] = None
    application_url: Optional[str] = None


class OpportunityResponse(BaseModel):
    id: str
    title: str
    company_name: str
    company_website: Optional[str] = None
    description: str
    responsibilities: Optional[List[str]] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    compensation: Optional[str] = None
    is_paid: bool
    work_arrangement: str
    location: Optional[str] = None
    experience_level: str
    opportunity_type: str
    deadline: Optional[date] = None
    application_url: Optional[str] = None
    listing_source: Optional[str] = None
    trust_status: str
    trust_score: Optional[int] = None
    is_demo: bool
    posted_by_id: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class MatchScoreResponse(BaseModel):
    opportunity_id: str
    match_score: int  # 0-100
    matched_skills: List[str]
    missing_skills: List[str]
    explanation: str
