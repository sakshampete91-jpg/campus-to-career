"""Resume parsing, tailoring, and PDF generation tests."""
import os
import io
import pytest
from app.services.resume.tailor import tailor_resume
from app.services.resume.pdf_generator import generate_pdf


def test_tailor_does_not_invent_skills():
    """Verify that tailoring only uses skills provided in student's profile."""
    original_resume_data = {
        "full_name": "Jordan Lee",
        "email": "jordan@example.com",
        "skills": ["Python", "Flask", "SQL"],
        "education": [{"institution": "National University", "degree": "B.Sc", "year": "2025"}],
        "experience": [],
        "projects": [{"title": "Weather App", "description": "Built simple API with Flask"}],
    }

    job_description = "We need an engineer experienced with Rust, Kubernetes, Go, and Python."

    result = tailor_resume(
        parsed_resume=original_resume_data,
        job_description=job_description,
        target_role="Junior Cloud Engineer",
    )

    tailored_skills = result["tailored_content"]["skills"]
    # Python is in original resume -> can be included
    # Rust, Kubernetes, Go are NOT in original resume -> MUST NOT be in tailored skills
    assert "Rust" not in tailored_skills
    assert "Kubernetes" not in tailored_skills
    assert "Go" not in tailored_skills

    # The missing skills should be explicitly flagged in the gaps analysis
    missing = [m.lower() for m in result["comparison"]["missing_skills"]]
    assert any("rust" in m for m in missing) or any("kubernetes" in m for m in missing)


def test_pdf_generation_creates_valid_file(tmp_path):
    """Test PDF generation produces a non-empty ATS-friendly PDF file."""
    resume_content = {
        "full_name": "Taylor Morgan",
        "email": "taylor.morgan@example.com",
        "phone": "+1-555-0199",
        "location": "Anytown",
        "linkedin_url": "https://linkedin.com/in/taylormorgan",
        "github_url": "https://github.com/taylormorgan",
        "summary": "Motivated software engineer with experience in Python and full-stack web applications.",
        "skills": ["Python", "JavaScript", "React", "PostgreSQL", "Git"],
        "education": [
            {
                "institution": "State University",
                "degree": "B.S. in Computer Science",
                "field": "Software Engineering",
                "year": "2026",
            }
        ],
        "experience": [
            {
                "title": "Software Intern",
                "company": "Tech Labs",
                "dates": "Summer 2025",
                "bullets": ["Contributed to REST API development", "Wrote comprehensive unit tests"],
            }
        ],
        "projects": [
            {
                "title": "Open Source Career Portal",
                "tech": "FastAPI, Next.js",
                "description": "Built full stack portal for students.",
            }
        ],
    }

    output_pdf_path = str(tmp_path / "tailored_resume.pdf")
    generated_path = generate_pdf(tailored_content=resume_content, output_path=output_pdf_path)

    assert os.path.exists(generated_path)
    assert os.path.getsize(generated_path) > 500  # valid PDF is at least hundreds of bytes

    # Verify PDF magic header
    with open(generated_path, "rb") as f:
        header = f.read(4)
        assert header == b"%PDF"


def test_resume_upload_endpoint_validation(client, student_token):
    """Test file upload validator rejects forbidden formats (e.g., .exe)."""
    fake_exe = io.BytesIO(b"MZ executable content")
    response = client.post(
        "/api/v1/resume/upload",
        headers={"Authorization": f"Bearer {student_token}"},
        files={"file": ("malicious.exe", fake_exe, "application/x-msdownload")},
    )
    assert response.status_code == 400
    assert "pdf" in response.json()["detail"].lower() or "docx" in response.json()["detail"].lower()
