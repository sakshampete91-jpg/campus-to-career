"""Import all models so that SQLAlchemy declarative registry resolves all relationships."""
from app.models.user import User
from app.models.opportunity import Opportunity
from app.models.application import Application
from app.models.resume import Resume

__all__ = ["User", "Opportunity", "Application", "Resume"]
