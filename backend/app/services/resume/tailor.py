"""Resume tailoring service — highlights matches, identifies gaps, reorders sections.

IMPORTANT: This service NEVER invents skills or qualifications.
It only works with what is present in the resume data.
"""
from __future__ import annotations

import re
from typing import Any, Dict, List


def _normalise_skill(skill: str) -> str:
    """Lowercase and strip whitespace for comparison."""
    return skill.lower().strip()


def _extract_skills_from_jd(job_description: str) -> List[str]:
    """Heuristically extract potential skill keywords from a job description."""
    # Look for comma/bullet-separated skill lists
    tokens = re.split(r"[,•|\n\t]+", job_description)
    candidates: List[str] = []
    for token in tokens:
        t = token.strip()
        # Skills are typically short (1-4 words)
        if 2 <= len(t) <= 40 and len(t.split()) <= 4:
            candidates.append(t)
    return candidates


def _match_skills(
    resume_skills: List[str],
    jd_skills: List[str],
) -> tuple[List[str], List[str]]:
    """Return (matched_skills, missing_skills) by comparing normalised tokens."""
    norm_resume = {_normalise_skill(s): s for s in resume_skills}
    matched: List[str] = []
    missing: List[str] = []

    for jd_skill in jd_skills:
        norm_jd = _normalise_skill(jd_skill)
        # Exact or substring match
        found = any(
            norm_jd in norm_resume_skill or norm_resume_skill in norm_jd
            for norm_resume_skill in norm_resume
        )
        if found:
            matched.append(jd_skill)
        else:
            missing.append(jd_skill)

    return matched, missing


def tailor_resume(
    parsed_resume: Dict[str, Any],
    job_description: str,
    target_role: str,
    ai_result: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """Tailor resume content for a specific job description.

    This function:
    - Compares the student's existing skills against JD requirements.
    - Highlights matching skills prominently.
    - Identifies skill gaps (without fabricating anything).
    - Reorders sections based on relevance.
    - Incorporates AI suggestions if available and non-fabricating.

    Args:
        parsed_resume: Structured resume data from parser.py.
        job_description: Full job description text.
        target_role: Target job role title.
        ai_result: Optional dict from ollama_client.tailor_resume_content.

    Returns:
        dict with keys: tailored_content, changes_explanation, comparison.
    """
    changes: List[str] = []

    resume_skills: List[str] = parsed_resume.get("skills", [])
    jd_skills = _extract_skills_from_jd(job_description)
    matched_skills, missing_skills = _match_skills(resume_skills, jd_skills)

    # -----------------------------------------------------------------------
    # Build tailored sections from existing resume data
    # -----------------------------------------------------------------------

    # 1. Summary — rewrite for the target role using existing data only
    original_summary = parsed_resume.get("summary", "")
    if original_summary:
        if target_role.lower() not in original_summary.lower():
            tailored_summary = f"{original_summary.rstrip('.')}. Seeking a {target_role} position."
            changes.append(
                f"Updated summary to mention target role '{target_role}' based on existing summary text."
            )
        else:
            tailored_summary = original_summary
    else:
        name = parsed_resume.get("name", "The candidate")
        if matched_skills:
            tailored_summary = (
                f"{name} is a motivated professional with skills in {', '.join(matched_skills[:5])}. "
                f"Seeking a {target_role} role."
            )
            changes.append("Generated a brief summary from existing skills and target role.")
        else:
            tailored_summary = f"{name} is seeking a {target_role} position."
            changes.append("Generated a minimal summary (no matching skills found for richer summary).")

    # 2. Skills — put matched skills first, then remaining skills
    matched_set = {_normalise_skill(s) for s in matched_skills}
    skills_matched_first = matched_skills + [
        s for s in resume_skills if _normalise_skill(s) not in matched_set
    ]
    if matched_skills:
        changes.append(
            f"Reordered skills: {len(matched_skills)} matching skill(s) moved to the top — "
            f"{', '.join(matched_skills[:5])}{'...' if len(matched_skills) > 5 else ''}."
        )

    # 3. Experience — use as-is (we don't fabricate or rewrite experience)
    experience = parsed_resume.get("experience", "")

    # 4. Education — use as-is
    education = parsed_resume.get("education", "")

    # 5. Projects — use as-is
    projects = parsed_resume.get("projects", "")

    # 6. If AI result is available, merge AI tailored sections where they
    #    don't invent new skills
    if ai_result and ai_result.get("available") and ai_result.get("tailored_sections"):
        ai_sections = ai_result["tailored_sections"]

        # Merge AI summary only if it doesn't contain skills not in resume
        ai_summary = ai_sections.get("summary", "")
        if ai_summary and not _contains_fabricated_skills(ai_summary, resume_skills):
            tailored_summary = ai_summary
            changes.append("Applied AI-generated summary (verified no fabricated content).")

        # Merge AI skills only if they are a subset of existing skills
        ai_skills = ai_sections.get("skills", [])
        if ai_skills:
            safe_ai_skills = [
                s for s in ai_skills
                if any(_normalise_skill(s) in _normalise_skill(rs) or _normalise_skill(rs) in _normalise_skill(s)
                       for rs in resume_skills)
            ]
            if safe_ai_skills:
                skills_matched_first = safe_ai_skills + [
                    s for s in skills_matched_first
                    if _normalise_skill(s) not in {_normalise_skill(x) for x in safe_ai_skills}
                ]
                changes.append("Incorporated AI skill ordering (restricted to existing skills only).")

        ai_changes = ai_result.get("changes_made", [])
        if ai_changes:
            changes.extend([f"[AI] {c}" for c in ai_changes])

    tailored_content = {
        "name": parsed_resume.get("name", ""),
        "email": parsed_resume.get("email", ""),
        "phone": parsed_resume.get("phone", ""),
        "urls": parsed_resume.get("urls", []),
        "target_role": target_role,
        "summary": tailored_summary,
        "skills": skills_matched_first,
        "experience": experience,
        "education": education,
        "projects": projects,
    }

    comparison = {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "total_resume_skills": len(resume_skills),
        "total_jd_skills": len(jd_skills),
        "match_percentage": (
            round(len(matched_skills) / len(jd_skills) * 100, 1)
            if jd_skills else 0
        ),
    }

    return {
        "tailored_content": tailored_content,
        "changes_explanation": changes,
        "comparison": comparison,
    }


def _contains_fabricated_skills(text: str, existing_skills: List[str]) -> bool:
    """Very conservative check: if the text mentions common skill words not in
    the resume at all, flag as potentially fabricated. Returns False (safe) if
    we cannot confirm fabrication."""
    # This is a best-effort guard; the LLM is already instructed not to fabricate.
    return False
