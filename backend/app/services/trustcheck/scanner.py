"""TrustCheck orchestration scanner."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from app.schemas.trustcheck import SignalEvidence, TrustCheckReport
from app.services.ai.ollama_client import analyze_listing_for_fraud
from app.services.trustcheck.risk_scorer import calculate_risk_score
from app.services.trustcheck.url_safety import check_url_safety

# In-memory store for hackathon demo (scan_id → TrustCheckReport dict)
_scan_cache: Dict[str, Dict[str, Any]] = {}

_RECOMMENDATIONS = {
    "upfront_fee_mention": "Never pay money to apply for a job. Legitimate employers do not charge application or training fees.",
    "unrealistic_compensation": "Research typical compensation ranges for similar roles. Offers significantly above market rate are a red flag.",
    "guaranteed_placement": "No company can legally guarantee employment. Treat such claims with extreme scepticism.",
    "vague_description": "Request a detailed job description before proceeding. Vague listings often conceal misleading terms.",
    "missing_company_info": "Verify the company exists by searching independently. Look for LinkedIn, official website, and news coverage.",
    "suspicious_contact": "Use the company's official contact channels found on their verified website rather than responding to personal email addresses.",
    "request_for_documents": "Do not share Aadhaar, PAN, passport, or banking details during the application stage.",
    "urgency_pressure": "High-pressure tactics are a manipulation strategy. Take your time to verify any opportunity.",
    "domain_mismatch": "The application URL does not match the company's known website. Verify you are not on a phishing site.",
    "no_https": "Avoid submitting personal information on non-HTTPS websites.",
}

_DISCLAIMER = (
    "Provisional assessment based on automated analysis of publicly available listing text. "
    "This is not legal or financial advice. Always conduct your own due diligence before applying or sharing personal information."
)


async def run_trustcheck_scan(
    url: str,
    listing_text: str = "",
    company_name: str = "",
    known_official_website: str = "",
    application_url: str = "",
) -> TrustCheckReport:
    """Run a full TrustCheck scan and cache the result.

    Steps:
    1. Validate URL safety.
    2. Run deterministic signal checks.
    3. Call Ollama AI (non-blocking fallback).
    4. Combine scores and generate recommendations.
    5. Cache and return the report.
    """
    scan_id = str(uuid.uuid4())
    scanned_at = datetime.now(timezone.utc)

    # 1. URL safety
    url_check = check_url_safety(url)
    url_safe = url_check["safe"]
    url_safety_reason = url_check["reason"]

    # 2. Deterministic scoring
    responsibilities_text = ""  # not separately provided; included in listing_text
    assessment = calculate_risk_score(
        listing_text=listing_text,
        company_name=company_name,
        company_website=known_official_website,
        responsibilities_text=responsibilities_text,
        application_url=application_url or url,
        known_official_website=known_official_website,
    )

    # 3. AI analysis (async, non-blocking fallback)
    ai_result = await analyze_listing_for_fraud(listing_text, company_name)

    # 4. Build signal evidence list
    signal_evidences = [
        SignalEvidence(
            signal_name=sig.name,
            weight=sig.weight,
            detected=sig.detected,
            explanation=sig.explanation,
            evidence=sig.evidence,
        )
        for sig in assessment.signals
    ]

    # 5. Build recommendations for triggered signals
    triggered_recs = [
        _RECOMMENDATIONS[sig.name]
        for sig in assessment.signals
        if sig.detected and sig.name in _RECOMMENDATIONS
    ]

    # Always append general advice
    triggered_recs.append(
        "Cross-verify any opportunity independently before sharing personal information or accepting an offer."
    )

    report = TrustCheckReport(
        scan_id=scan_id,
        scanned_at=scanned_at,
        url=url,
        company_name=company_name,
        risk_score=assessment.total_score,
        risk_category=assessment.risk_category,
        risk_label=assessment.risk_label,
        signals=signal_evidences,
        ai_analysis=ai_result.get("analysis", ""),
        ai_available=ai_result.get("available", False),
        url_safe=url_safe,
        url_safety_reason=url_safety_reason,
        live_scan_succeeded=False,  # live HTTP scan not performed (SSRF protection)
        recommendations=triggered_recs,
        disclaimer=_DISCLAIMER,
    )

    # Cache the report
    _scan_cache[scan_id] = report.model_dump(mode="json")
    return report


def get_cached_scan(scan_id: str) -> Optional[Dict[str, Any]]:
    """Return a previously cached scan result dict, or None."""
    return _scan_cache.get(scan_id)
