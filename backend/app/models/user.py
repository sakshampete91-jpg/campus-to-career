"""SQLAlchemy ORM model for the User entity."""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Enum, String, Text
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


def _uuid():
    return str(uuid.uuid4())


def _now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum("student", "employer", "admin", name="user_role"), nullable=False, default="student")
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=_now, onupdate=_now, nullable=False)

    # --- Student profile fields ---
    # skills: list of {"name": str, "level": "beginner"|"intermediate"|"advanced"}
    skills = Column(JSON, default=list)
    education = Column(JSON, default=list)  # list of education entries
    academic_year = Column(String(50), nullable=True)
    projects = Column(JSON, default=list)  # list of project entries
    github_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    location_preference = Column(String(255), nullable=True)
    # e.g. ["remote", "hybrid", "onsite"]
    work_type_preference = Column(JSON, default=list)
    # e.g. ["internship", "freelance", "part-time", "entry-level"]
    opportunity_type_preference = Column(JSON, default=list)

    # --- Employer fields ---
    company_name = Column(String(255), nullable=True)
    company_website = Column(String(500), nullable=True)
    company_description = Column(Text, nullable=True)

    # Relationships
    posted_opportunities = relationship("Opportunity", back_populates="posted_by", foreign_keys="Opportunity.posted_by_id")
    applications = relationship("Application", back_populates="student", foreign_keys="Application.student_id")
    resumes = relationship("Resume", back_populates="student", foreign_keys="Resume.student_id")
