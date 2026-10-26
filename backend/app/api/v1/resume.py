"""Resume upload, parse, tailor, and PDF generation endpoints."""
from __future__ import annotations

import os
import tempfile
import uuid
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_active_student
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import (
    GeneratePDFRequest,
    ResumeMetaResponse,
    TailorRequest,
    TailorResponse,
)
from app.services.ai.ollama_client import tailor_resume_content
from app.services.resume.parser import parse_docx, parse_pdf
from app.services.resume.pdf_generator import generate_pdf
from app.services.resume.tailor import tailor_resume

router = APIRouter(prefix="/resume", tags=["resume"])
settings = get_settings()

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
ALLOWED_EXTENSIONS = {".pdf", ".docx"}


def _validate_upload(file: UploadFile) -> None:
    """Validate file type and reject disallowed formats."""
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{ext}' is not allowed. Only PDF and DOCX files are accepted.",
        )
    if file.content_type and file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Content type '{file.content_type}' is not allowed.",
        )


@router.post("/upload", response_model=ResumeMetaResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_student),
    db: Session = Depends(get_db),
):
    """Upload a PDF or DOCX master resume. Parses and stores metadata."""
    _validate_upload(file)

    # Read and check size
    content = await file.read()
    if len(content) > settings.max_upload_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB.",
        )

    # Ensure upload directory exists
    upload_dir = os.path.abspath(settings.UPLOAD_DIR)
    os.makedirs(upload_dir, exist_ok=True)

    # Save to disk with a UUID-based filename (prevents path traversal)
    ext = os.path.splitext(file.filename or "resume")[1].lower()
    safe_filename = f"{uuid.uuid4()}{ext}"
    storage_path = os.path.join(upload_dir, safe_filename)

    with open(storage_path, "wb") as f:
        f.write(content)

    # Parse the resume
    if ext == ".pdf":
        parsed_data = parse_pdf(storage_path)
    else:
        parsed_data = parse_docx(storage_path)

    extracted_text = parsed_data.pop("raw_text", "")

    # Deactivate previous resumes for this student
    db.query(Resume).filter(
        Resume.student_id == current_user.id,
        Resume.is_active == True,
    ).update({"is_active": False})

    resume = Resume(
        student_id=current_user.id,
        original_filename=file.filename or safe_filename,
        storage_path=storage_path,  # stored server-side, never returned in API
        extracted_text=extracted_text,
        parsed_data=parsed_data,
        is_active=True,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("/", response_model=List[ResumeMetaResponse])
def list_resumes(
    current_user: User = Depends(get_current_active_student),
    db: Session = Depends(get_db),
):
    """List all resumes uploaded by the current student."""
    resumes = (
        db.query(Resume)
        .filter(Resume.student_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .all()
    )
    return resumes


@router.get("/{resume_id}", response_model=ResumeMetaResponse)
def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_active_student),
    db: Session = Depends(get_db),
):
    """Get resume metadata and parsed data for a specific resume."""
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.student_id == current_user.id,
    ).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")
    return resume


@router.post("/tailor", response_model=TailorResponse)
async def tailor_resume_endpoint(
    payload: TailorRequest,
    current_user: User = Depends(get_current_active_student),
    db: Session = Depends(get_db),
):
    """Tailor a resume for a specific job description.

    Supports tailoring from:
    1. An uploaded resume via payload.resume_id
    2. Directly supplied resume data via payload.resume_data
    3. The student's most recently uploaded active resume
    4. Default profile data fallback
    """
    parsed_data = None

    if payload.resume_id:
        resume = db.query(Resume).filter(
            Resume.id == payload.resume_id,
            Resume.student_id == current_user.id,
        ).first()
        if resume:
            parsed_data = resume.parsed_data or {}

    if not parsed_data and payload.resume_data:
        parsed_data = payload.resume_data

    if not parsed_data:
        latest_resume = (
            db.query(Resume)
            .filter(Resume.student_id == current_user.id, Resume.is_active == True)
            .order_by(Resume.created_at.desc())
            .first()
        )
        if latest_resume:
            parsed_data = latest_resume.parsed_data or {}

    if not parsed_data:
        skills_list = [s.get("name") if isinstance(s, dict) else s for s in (current_user.skills or [])]
        parsed_data = {
            "name": current_user.full_name or "Alex Morgan",
            "email": current_user.email,
            "skills": skills_list or ["Python", "React", "SQL", "Git", "Figma", "TypeScript", "FastAPI"],
            "summary": "Third-year student passionate about software engineering and user interfaces.",
        }

    # Try AI tailoring
    ai_result = await tailor_resume_content(
        resume_data=parsed_data,
        job_description=payload.job_description,
        target_role=payload.target_role,
    )

    result = tailor_resume(
        parsed_resume=parsed_data,
        job_description=payload.job_description,
        target_role=payload.target_role,
        ai_result=ai_result,
    )

    return TailorResponse(**result)


@router.post("/generate-pdf")
async def generate_pdf_endpoint(
    request: Request,
    current_user: User = Depends(get_current_active_student),
):
    """Generate an ATS-friendly PDF from tailored resume content.

    Accepts both wrapped format ({"tailored_content": {...}})
    and direct dictionary format. Returns the PDF as a downloadable stream.
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload.",
        )

    if isinstance(body, dict) and "tailored_content" in body and isinstance(body["tailored_content"], dict):
        tailored_content = body["tailored_content"]
    elif isinstance(body, dict):
        tailored_content = body
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expected JSON object with resume content.",
        )

    # Write to a temp file
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        output_path = generate_pdf(tailored_content, tmp_path)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )

    candidate_name = tailored_content.get("name", "resume").replace(" ", "_")
    filename = f"{candidate_name}_tailored_resume.pdf"

    return FileResponse(
        path=output_path,
        media_type="application/pdf",
        filename=filename,
        background=None,
    )
