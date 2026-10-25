"""PDF generator using ReportLab — ATS-friendly formatting."""
from __future__ import annotations

import logging
import os
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

# ReportLab imports
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib import colors


def _make_styles():
    """Build a set of ATS-friendly paragraph styles."""
    styles = getSampleStyleSheet()

    name_style = ParagraphStyle(
        "Name",
        parent=styles["Normal"],
        fontSize=18,
        fontName="Helvetica-Bold",
        alignment=TA_CENTER,
        spaceAfter=4,
    )
    contact_style = ParagraphStyle(
        "Contact",
        parent=styles["Normal"],
        fontSize=10,
        fontName="Helvetica",
        alignment=TA_CENTER,
        spaceAfter=10,
    )
    section_header_style = ParagraphStyle(
        "SectionHeader",
        parent=styles["Normal"],
        fontSize=12,
        fontName="Helvetica-Bold",
        spaceBefore=12,
        spaceAfter=4,
        textColor=colors.HexColor("#1a1a1a"),
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=10,
        fontName="Helvetica",
        spaceAfter=4,
        leading=14,
    )
    bullet_style = ParagraphStyle(
        "Bullet",
        parent=styles["Normal"],
        fontSize=10,
        fontName="Helvetica",
        leftIndent=12,
        spaceAfter=2,
        leading=14,
    )
    return {
        "name": name_style,
        "contact": contact_style,
        "section_header": section_header_style,
        "body": body_style,
        "bullet": bullet_style,
    }


def _section_divider():
    return HRFlowable(width="100%", thickness=0.5, color=colors.grey, spaceAfter=4, spaceBefore=0)


def _add_section(story: list, title: str, content: Any, styles: dict):
    """Append a named section to the story."""
    if not content:
        return
    story.append(Paragraph(title.upper(), styles["section_header"]))
    story.append(_section_divider())

    if isinstance(content, list):
        for item in content:
            if isinstance(item, str) and item.strip():
                story.append(Paragraph(f"• {item.strip()}", styles["bullet"]))
            elif isinstance(item, dict):
                for k, v in item.items():
                    if v:
                        story.append(Paragraph(f"<b>{k}:</b> {v}", styles["body"]))
    elif isinstance(content, str) and content.strip():
        # Split by lines for better readability
        for line in content.split("\n"):
            if line.strip():
                story.append(Paragraph(line.strip(), styles["body"]))
    story.append(Spacer(1, 6))


def generate_pdf(tailored_content: Dict[str, Any], output_path: str) -> str:
    """Generate an ATS-friendly PDF resume from tailored content.

    Args:
        tailored_content: Dict with keys: name, email, phone, urls, target_role,
                          summary, skills, experience, education, projects.
        output_path: Absolute path where the PDF should be written.

    Returns:
        The output_path on success.

    Raises:
        RuntimeError: If PDF generation fails.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=LETTER,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )

    styles = _make_styles()
    story = []

    # -----------------------------------------------------------------------
    # Header: Name & Contact
    # -----------------------------------------------------------------------
    name = tailored_content.get("name") or "Candidate Name"
    story.append(Paragraph(name, styles["name"]))

    contact_parts: List[str] = []
    if tailored_content.get("email"):
        contact_parts.append(tailored_content["email"])
    if tailored_content.get("phone"):
        contact_parts.append(tailored_content["phone"])
    urls = tailored_content.get("urls", [])
    if urls:
        contact_parts.extend(urls[:2])

    if contact_parts:
        story.append(Paragraph(" | ".join(contact_parts), styles["contact"]))

    target_role = tailored_content.get("target_role", "")
    if target_role:
        story.append(Paragraph(f"<i>Applying for: {target_role}</i>", styles["contact"]))

    story.append(Spacer(1, 8))

    # -----------------------------------------------------------------------
    # Summary
    # -----------------------------------------------------------------------
    summary = tailored_content.get("summary", "")
    if summary:
        _add_section(story, "Summary", summary, styles)

    # -----------------------------------------------------------------------
    # Skills (listed as bullets — ATS-friendly, no columns/tables)
    # -----------------------------------------------------------------------
    skills = tailored_content.get("skills", [])
    if skills:
        _add_section(story, "Skills", skills, styles)

    # -----------------------------------------------------------------------
    # Experience
    # -----------------------------------------------------------------------
    experience = tailored_content.get("experience", "")
    if experience:
        _add_section(story, "Experience", experience, styles)

    # -----------------------------------------------------------------------
    # Education
    # -----------------------------------------------------------------------
    education = tailored_content.get("education", "")
    if education:
        _add_section(story, "Education", education, styles)

    # -----------------------------------------------------------------------
    # Projects
    # -----------------------------------------------------------------------
    projects = tailored_content.get("projects", "")
    if projects:
        _add_section(story, "Projects", projects, styles)

    try:
        doc.build(story)
        logger.info("PDF generated at %s", output_path)
        return output_path
    except Exception as exc:
        logger.error("PDF generation failed: %s", exc)
        raise RuntimeError(f"PDF generation failed: {exc}") from exc
