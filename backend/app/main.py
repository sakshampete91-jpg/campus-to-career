"""FastAPI application entry point for Campus to Career."""
from __future__ import annotations

import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.core.database import create_tables

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Backend API for Campus to Career — a platform helping students discover "
        "internships, freelance, and entry-level opportunities with built-in trust verification."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------

@app.on_event("startup")
def on_startup():
    """Create database tables, upload directory, and auto-seed if empty."""
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    create_tables()
    upload_dir = os.path.abspath(settings.UPLOAD_DIR)
    os.makedirs(upload_dir, exist_ok=True)
    logger.info("Upload directory: %s", upload_dir)

    # Auto-seed database for first-time cloud container deployment
    try:
        from app.core.database import SessionLocal
        from app.models.user import User
        from seed_data import seed
        db = SessionLocal()
        if db.query(User).count() == 0:
            logger.info("Empty database detected in cloud container. Auto-seeding demo data...")
            seed()
        db.close()
    except Exception as exc:
        logger.warning("Auto-seed on startup: %s", exc)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["health"])
def health_check():
    """Root health check endpoint."""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/health", tags=["health"])
def health():
    """Detailed health check."""
    return {
        "status": "ok",
        "database": "sqlite",
        "app_name": settings.APP_NAME,
    }
