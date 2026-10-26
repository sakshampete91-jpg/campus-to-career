"""SQLAlchemy ORM model for the Application entity."""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


def _uuid():
    return str(uuid.uuid4())


def _now():
    return datetime.now(timezone.utc)


class Application(Base):
    __tablename__ = "applications"

    id = Column(String(36), primary_key=True, default=_uuid)
    student_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    opportunity_id = Column(String(36), ForeignKey("opportunities.id"), nullable=False)
    status = Column(
        Enum(
            "saved",
            "applied",
            "under_review",
            "interview",
            "rejected",
            "selected",
            name="application_status",
        ),
        nullable=False,
        default="saved",
    )
    resume_id = Column(String(36), ForeignKey("resumes.id"), nullable=True)
    notes = Column(Text, nullable=True)
    applied_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=_now, onupdate=_now, nullable=False)

    # Relationships
    student = relationship("User", back_populates="applications", foreign_keys=[student_id])
    opportunity = relationship("Opportunity", back_populates="applications")
    resume = relationship("Resume", foreign_keys=[resume_id])
