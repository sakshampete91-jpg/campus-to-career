"""SQLAlchemy ORM model for the Opportunity entity."""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


def _uuid():
    return str(uuid.uuid4())


def _now():
    return datetime.now(timezone.utc)


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(String(36), primary_key=True, default=_uuid)
    title = Column(String(500), nullable=False)
    company_name = Column(String(255), nullable=False)
    company_website = Column(String(500), nullable=True)
    description = Column(Text, nullable=False)
    responsibilities = Column(JSON, default=list)   # list of strings
    required_skills = Column(JSON, default=list)    # list of strings
    preferred_skills = Column(JSON, default=list)   # list of strings
    compensation = Column(String(255), nullable=True)
    is_paid = Column(Boolean, default=False, nullable=False)
    work_arrangement = Column(
        Enum("remote", "hybrid", "onsite", name="work_arrangement"),
        nullable=False,
        default="remote",
    )
    location = Column(String(255), nullable=True)
    experience_level = Column(
        Enum("entry", "junior", "mid", "senior", name="experience_level"),
        nullable=False,
        default="entry",
    )
    opportunity_type = Column(
        Enum("internship", "freelance", "part-time", "full-time", name="opportunity_type"),
        nullable=False,
        default="internship",
    )
    deadline = Column(Date, nullable=True)
    application_url = Column(String(1000), nullable=True)
    listing_source = Column(String(255), nullable=True)
    last_checked_at = Column(DateTime(timezone=True), nullable=True)
    trust_status = Column(
        Enum("verified", "partially_verified", "unverified", "elevated_risk", name="trust_status"),
        nullable=False,
        default="unverified",
    )
    trust_score = Column(Integer, nullable=True)
    is_demo = Column(Boolean, default=False, nullable=False)
    posted_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)

    # Relationships
    posted_by = relationship("User", back_populates="posted_opportunities", foreign_keys=[posted_by_id])
    applications = relationship("Application", back_populates="opportunity")
