"""Resume parser: PDF and DOCX extraction."""
from __future__ import annotations

import io
import logging
import re
from typing import Any, Dict

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Regex helpers for structured extraction
# ---------------------------------------------------------------------------

_EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
_PHONE_RE = re.compile(r"(\+?\d[\d\s\-().]{7,}\d)")
_URL_RE = re.compile(r"https?://[^\s]+")

_SECTION_HEADERS = {
    "summary": re.compile(r"^(summary|objective|profile|about me)\s*$", re.IGNORECASE | re.MULTILINE),
    "skills": re.compile(r"^(skills|technical skills|core competencies|technologies)\s*$", re.IGNORECASE | re.MULTILINE),
    "experience": re.compile(r"^(experience|work experience|employment|professional experience)\s*$", re.IGNORECASE | re.MULTILINE),
    "education": re.compile(r"^(education|academic background|qualifications)\s*$", re.IGNORECASE | re.MULTILINE),
    "projects": re.compile(r"^(projects|personal projects|academic projects)\s*$", re.IGNORECASE | re.MULTILINE),
}


def _extract_contact_info(text: str) -> Dict[str, str]:
    """Extract contact details from raw text."""
    emails = _EMAIL_RE.findall(text)
    phones = _PHONE_RE.findall(text)
    urls = _URL_RE.findall(text)
    return {
        "email": emails[0] if emails else "",
        "phone": phones[0] if phones else "",
        "urls": urls[:5],
    }


def _extract_sections(text: str) -> Dict[str, str]:
    """Split text into named sections based on section headers."""
    sections: Dict[str, str] = {}
    lines = text.split("\n")
    current_section = "header"
    section_text: list[str] = []

    for line in lines:
        matched = False
        for section_name, pattern in _SECTION_HEADERS.items():
            if pattern.match(line.strip()):
                sections[current_section] = "\n".join(section_text).strip()
                current_section = section_name
                section_text = []
                matched = True
                break
        if not matched:
            section_text.append(line)

    sections[current_section] = "\n".join(section_text).strip()
    return sections


def _extract_name_from_header(header_text: str) -> str:
    """Heuristic: first non-empty line of the header is usually the name."""
    for line in header_text.split("\n"):
        clean = line.strip()
        if clean and len(clean.split()) >= 2 and not _EMAIL_RE.search(clean):
            return clean
    return ""


def _build_parsed_data(text: str) -> Dict[str, Any]:
    """Build structured parsed_data dict from raw text."""
    contact = _extract_contact_info(text)
    sections = _extract_sections(text)

    header_text = sections.get("header", "")
    name = _extract_name_from_header(header_text)

    # Skills: split by commas, bullets, or newlines
    skills_text = sections.get("skills", "")
    skill_tokens = re.split(r"[,•|\n\t]+", skills_text)
    skills = [s.strip() for s in skill_tokens if 2 < len(s.strip()) < 50]

    return {
        "name": name,
        "email": contact["email"],
        "phone": contact["phone"],
        "urls": contact["urls"],
        "skills": skills,
        "summary": sections.get("summary", ""),
        "experience": sections.get("experience", ""),
        "education": sections.get("education", ""),
        "projects": sections.get("projects", ""),
        "raw_sections": {k: v for k, v in sections.items() if k not in ("skills", "summary", "experience", "education", "projects")},
    }


# ---------------------------------------------------------------------------
# PDF parser (pdfminer.six)
# ---------------------------------------------------------------------------

def parse_pdf(file_path: str) -> Dict[str, Any]:
    """Extract text from a PDF file and return structured parsed data.

    Args:
        file_path: Absolute path to the PDF file.

    Returns:
        dict with keys: raw_text, name, email, phone, skills, summary,
        experience, education, projects, urls.
    """
    try:
        from pdfminer.high_level import extract_text as pdf_extract_text
        raw_text = pdf_extract_text(file_path)
    except Exception as exc:
        logger.warning("pdfminer extraction failed for %s: %s", file_path, exc)
        raw_text = ""

    if not raw_text.strip():
        return {"raw_text": "", "error": "Could not extract text from PDF."}

    parsed = _build_parsed_data(raw_text)
    parsed["raw_text"] = raw_text
    return parsed


# ---------------------------------------------------------------------------
# DOCX parser (python-docx)
# ---------------------------------------------------------------------------

def parse_docx(file_path: str) -> Dict[str, Any]:
    """Extract text from a DOCX file and return structured parsed data.

    Args:
        file_path: Absolute path to the DOCX file.

    Returns:
        dict with keys: raw_text, name, email, phone, skills, summary,
        experience, education, projects, urls.
    """
    try:
        import docx
        doc = docx.Document(file_path)
        paragraphs = [p.text for p in doc.paragraphs]
        # Also extract from tables
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    paragraphs.append(cell.text)
        raw_text = "\n".join(paragraphs)
    except Exception as exc:
        logger.warning("python-docx extraction failed for %s: %s", file_path, exc)
        raw_text = ""

    if not raw_text.strip():
        return {"raw_text": "", "error": "Could not extract text from DOCX."}

    parsed = _build_parsed_data(raw_text)
    parsed["raw_text"] = raw_text
    return parsed
