"""SQLAlchemy ORM model for the Resume entity."""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


def _uuid():
    return str(uuid.uuid4())


def _now():
    return datetime.now(timezone.utc)


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=_uuid)
    student_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    original_filename = Column(String(500), nullable=False)
    # Server-side storage path — never exposed in API responses
    storage_path = Column(String(1000), nullable=False)
    extracted_text = Column(Text, nullable=True)
    parsed_data = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    student = relationship("User", back_populates="resumes", foreign_keys=[student_id])
