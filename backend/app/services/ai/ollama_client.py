"""Ollama AI client for Campus to Career."""
from __future__ import annotations

import json
import logging
from typing import Any, Dict

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_FRAUD_PROMPT_TEMPLATE = """You are a job listing fraud detection assistant.
Analyse the following job listing and identify suspicious signals.

Company: {company_name}
Listing Text:
{listing_text}

Respond ONLY with a valid JSON object in this exact format:
{{
  "suspicious_signals": [
    {{"signal": "signal name", "confidence": "high|medium|low", "excerpt": "relevant text"}}
  ],
  "overall_assessment": "brief 1-2 sentence assessment",
  "red_flags_found": true or false
}}
Do not include any text outside the JSON object."""

_TAILOR_PROMPT_TEMPLATE = """You are an expert resume writer.
Given the following resume data and job description, tailor the resume content.

Target Role: {target_role}

Job Description:
{job_description}

Current Resume Data (JSON):
{resume_json}

Rules:
- DO NOT invent skills, qualifications, or experience that are not in the resume data.
- Highlight existing skills that match the job description.
- Reorder sections to prioritise relevance.
- Rewrite the summary/objective for this specific role.
- List what changes you made and why.

Respond ONLY with a valid JSON object:
{{
  "tailored_sections": {{
    "summary": "...",
    "skills": ["skill1", "skill2"],
    "experience": [...],
    "education": [...],
    "projects": [...]
  }},
  "changes_made": ["change description 1", "change description 2"]
}}"""


async def _resolve_model(client: httpx.AsyncClient) -> str:
    """Resolve the active model. Prefers Google Gemma 2 (gemma2:2b), with smart local model fallback."""
    preferred = settings.OLLAMA_MODEL
    try:
        res = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
        if res.status_code == 200:
            models = [m.get("name", "") for m in res.json().get("models", [])]
            # 1. Prioritize any installed Google Gemma model
            for m in models:
                if "gemma" in m.lower():
                    return m
            # 2. Check if preferred model is directly available
            for m in models:
                if preferred.lower() in m.lower():
                    return m
            # 3. Fallback to any local LLM generation model (skip embedders)
            for m in models:
                if "embed" not in m.lower():
                    return m
    except Exception:
        pass
    return preferred


async def analyze_listing_for_fraud(listing_text: str, company_name: str) -> Dict[str, Any]:
    """Call Ollama (Google Gemma 2) to contextually analyse a listing for fraud signals.

    Returns a dict with keys: available, signals, analysis.
    Falls back gracefully if Ollama is not running.
    """
    prompt = _FRAUD_PROMPT_TEMPLATE.format(
        company_name=company_name or "Unknown",
        listing_text=listing_text or "(no listing text provided)",
    )

    try:
        timeout = httpx.Timeout(25.0, connect=1.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            model_to_use = await _resolve_model(client)
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": model_to_use,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json",
                },
            )
            response.raise_for_status()
            data = response.json()
            raw_text = data.get("response", "{}")
            parsed = json.loads(raw_text)
            return {
                "available": True,
                "model": model_to_use,
                "signals": parsed.get("suspicious_signals", []),
                "analysis": parsed.get("overall_assessment", "No assessment provided."),
                "red_flags_found": parsed.get("red_flags_found", False),
            }
    except (httpx.ConnectError, httpx.TimeoutException):
        logger.info("Ollama not reachable — skipping AI analysis.")
        return {
            "available": False,
            "signals": [],
            "analysis": "AI inference unavailable — deterministic analysis only.",
            "red_flags_found": False,
        }
    except Exception as exc:
        logger.warning("Ollama call failed: %s", exc)
        return {
            "available": False,
            "signals": [],
            "analysis": "AI inference unavailable — deterministic analysis only.",
            "red_flags_found": False,
        }


async def tailor_resume_content(
    resume_data: dict,
    job_description: str,
    target_role: str,
) -> Dict[str, Any]:
    """Use Ollama (Google Gemma 2) to tailor resume sections for a specific job description.

    Returns a dict with tailored_sections and changes_made.
    Falls back to a basic restructure if Ollama is unavailable.
    """
    prompt = _TAILOR_PROMPT_TEMPLATE.format(
        target_role=target_role,
        job_description=job_description,
        resume_json=json.dumps(resume_data, indent=2),
    )

    try:
        timeout = httpx.Timeout(25.0, connect=1.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            model_to_use = await _resolve_model(client)
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": model_to_use,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json",
                },
            )
            response.raise_for_status()
            data = response.json()
            raw_text = data.get("response", "{}")
            parsed = json.loads(raw_text)
            return {
                "available": True,
                "model": model_to_use,
                "tailored_sections": parsed.get("tailored_sections", {}),
                "changes_made": parsed.get("changes_made", []),
            }
    except (httpx.ConnectError, httpx.TimeoutException):
        logger.info("Ollama not reachable — using basic resume restructure.")
        return {"available": False, "tailored_sections": {}, "changes_made": []}
    except Exception as exc:
        logger.warning("Ollama tailor call failed: %s", exc)
        return {"available": False, "tailored_sections": {}, "changes_made": []}
