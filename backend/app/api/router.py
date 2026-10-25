"""Main API router — includes all v1 sub-routers."""
from fastapi import APIRouter

from app.api.v1 import auth, users, opportunities, applications, trustcheck, resume

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(opportunities.router)
api_router.include_router(applications.router)
api_router.include_router(trustcheck.router)
api_router.include_router(resume.router)
