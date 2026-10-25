"""Deterministic risk scoring engine for TrustCheck."""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List
from urllib.parse import urlparse


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class Signal:
    name: str
    weight: int
    detected: bool = False
    explanation: str = ""
    evidence: str = ""


@dataclass
class RiskAssessment:
    total_score: int
    risk_category: str
    risk_label: str
    signals: List[Signal]


# ---------------------------------------------------------------------------
# Category thresholds
# ---------------------------------------------------------------------------

def _categorise(score: int) -> tuple[str, str]:
    """Map a numeric score to (category_key, human_label)."""
    if score < 25:
        return "lower_risk", "Lower Risk"
    if score < 50:
        return "some_warning_signs", "Some Warning Signs"
    if score < 75:
        return "high_risk_indicators", "High Risk Indicators"
    return "very_high_risk_indicators", "Very High Risk Indicators"


# ---------------------------------------------------------------------------
# Individual signal detectors
# ---------------------------------------------------------------------------

_FEE_KEYWORDS = re.compile(
    r"registration\s+fee|deposit|pay\s+to\s+apply|fee\s+required|training\s+fee",
    re.IGNORECASE,
)

_UNREALISTIC_COMP = re.compile(
    r"₹\s*[1-9]\d{5,}|earn\s+1\s+lakh|earn\s+lakhs|\$\s*[1-9]\d{5,}",
    re.IGNORECASE,
)

_GUARANTEED = re.compile(
    r"guaranteed\s+job|100%\s+placement|assured\s+job",
    re.IGNORECASE,
)

_URGENCY = re.compile(
    r"apply\s+now|limited\s+seats|last\s+chance|urgent",
    re.IGNORECASE,
)

_DOCUMENT_REQUEST = re.compile(
    r"aadhaar|pan\s+card|passport\s+copy|bank\s+details|account\s+number",
    re.IGNORECASE,
)

_FREE_EMAIL = re.compile(
    r"@gmail\.com|@yahoo\.com|@hotmail\.com",
    re.IGNORECASE,
)


def _check_upfront_fee(text: str) -> Signal:
    sig = Signal(name="upfront_fee_mention", weight=30)
    matches = _FEE_KEYWORDS.findall(text)
    if matches:
        sig.detected = True
        sig.explanation = "Listing mentions payment or fees required from the applicant."
        sig.evidence = "; ".join(set(m.strip() for m in matches))
    else:
        sig.explanation = "No upfront fee language detected."
    return sig


def _check_unrealistic_compensation(text: str) -> Signal:
    sig = Signal(name="unrealistic_compensation", weight=20)
    matches = _UNREALISTIC_COMP.findall(text)
    if matches:
        sig.detected = True
        sig.explanation = "Listing mentions compensation figures that appear unrealistically high for an entry-level role."
        sig.evidence = "; ".join(set(m.strip() for m in matches))
    else:
        sig.explanation = "Compensation figures appear within plausible range."
    return sig


def _check_guaranteed_placement(text: str) -> Signal:
    sig = Signal(name="guaranteed_placement", weight=15)
    matches = _GUARANTEED.findall(text)
    if matches:
        sig.detected = True
        sig.explanation = "Listing makes guaranteed placement or job assurance claims, which is a red flag."
        sig.evidence = "; ".join(set(m.strip() for m in matches))
    else:
        sig.explanation = "No guaranteed placement language detected."
    return sig


def _check_vague_description(text: str, responsibilities: str) -> Signal:
    sig = Signal(name="vague_description", weight=10)
    reasons = []
    if len(text.strip()) < 100:
        reasons.append("description is very short (< 100 characters)")
    if not responsibilities or len(responsibilities.strip()) < 20:
        reasons.append("responsibilities section is missing or very brief")
    if reasons:
        sig.detected = True
        sig.explanation = "Listing appears vague: " + "; ".join(reasons) + "."
        sig.evidence = f"Description length: {len(text.strip())} characters."
    else:
        sig.explanation = "Description appears adequately detailed."
    return sig


def _check_missing_company_info(company_name: str, company_website: str) -> Signal:
    sig = Signal(name="missing_company_info", weight=10)
    issues = []
    if not company_website or not company_website.strip():
        issues.append("no company website provided")
    if len(company_name.strip()) < 3:
        issues.append("company name is too short")
    if issues:
        sig.detected = True
        sig.explanation = "Missing company information: " + "; ".join(issues) + "."
        sig.evidence = f"company_name='{company_name}', company_website='{company_website}'"
    else:
        sig.explanation = "Company information appears complete."
    return sig


def _check_suspicious_contact(text: str, company_name: str) -> Signal:
    sig = Signal(name="suspicious_contact", weight=15)
    matches = _FREE_EMAIL.findall(text)
    if matches and len(company_name.strip()) > 5:
        sig.detected = True
        sig.explanation = (
            "Listing uses a free personal email domain (Gmail/Yahoo/Hotmail) as an official contact "
            "for what appears to be a company. Legitimate companies typically use domain email."
        )
        sig.evidence = "; ".join(set(m.strip() for m in matches))
    else:
        sig.explanation = "No suspicious contact email detected."
    return sig


def _check_document_request(text: str) -> Signal:
    sig = Signal(name="request_for_documents", weight=25)
    matches = _DOCUMENT_REQUEST.findall(text)
    if matches:
        sig.detected = True
        sig.explanation = (
            "Listing requests sensitive personal documents (Aadhaar, PAN, passport, bank details). "
            "Legitimate job listings do not request these during application."
        )
        sig.evidence = "; ".join(set(m.strip() for m in matches))
    else:
        sig.explanation = "No requests for sensitive documents detected."
    return sig


def _check_urgency_pressure(text: str) -> Signal:
    sig = Signal(name="urgency_pressure", weight=10)
    matches = _URGENCY.findall(text)
    if len(matches) >= 2:
        sig.detected = True
        sig.explanation = "Listing uses multiple urgency phrases to pressure applicants."
        sig.evidence = "; ".join(set(m.strip() for m in matches))
    else:
        sig.explanation = "No excessive urgency pressure detected."
    return sig


def _check_domain_mismatch(application_url: str, known_official_website: str) -> Signal:
    sig = Signal(name="domain_mismatch", weight=20)
    if not application_url or not known_official_website:
        sig.explanation = "Domain mismatch check skipped — one or both URLs not provided."
        return sig
    try:
        app_domain = urlparse(application_url).netloc.lower().lstrip("www.")
        official_domain = urlparse(known_official_website).netloc.lower().lstrip("www.")
        if not official_domain:
            official_domain = known_official_website.lower().strip().lstrip("www.")
        if app_domain and official_domain and app_domain != official_domain:
            sig.detected = True
            sig.explanation = (
                f"Application URL domain '{app_domain}' does not match the known official website "
                f"domain '{official_domain}'. This could indicate a phishing site."
            )
            sig.evidence = f"application_url domain: {app_domain}, official: {official_domain}"
        else:
            sig.explanation = "Application URL domain matches the known official website."
    except Exception:
        sig.explanation = "Could not compare domains — malformed URL."
    return sig


def _check_no_https(application_url: str) -> Signal:
    sig = Signal(name="no_https", weight=5)
    if application_url and application_url.startswith("http://"):
        sig.detected = True
        sig.explanation = "Application URL uses plain HTTP instead of HTTPS, which is insecure."
        sig.evidence = application_url
    else:
        sig.explanation = "Application URL uses HTTPS or no URL was provided."
    return sig


# ---------------------------------------------------------------------------
# Main scorer
# ---------------------------------------------------------------------------

def calculate_risk_score(
    listing_text: str,
    company_name: str = "",
    company_website: str = "",
    responsibilities_text: str = "",
    application_url: str = "",
    known_official_website: str = "",
) -> RiskAssessment:
    """Run all deterministic signal checks and return a RiskAssessment.

    Args:
        listing_text: Full listing text (description + extra content).
        company_name: Name of the hiring company.
        company_website: Company's website URL if provided.
        responsibilities_text: Extracted responsibilities section.
        application_url: URL where candidates should apply.
        known_official_website: Verified official website to compare against.
    """
    signals: List[Signal] = [
        _check_upfront_fee(listing_text),
        _check_unrealistic_compensation(listing_text),
        _check_guaranteed_placement(listing_text),
        _check_vague_description(listing_text, responsibilities_text),
        _check_missing_company_info(company_name, company_website),
        _check_suspicious_contact(listing_text, company_name),
        _check_document_request(listing_text),
        _check_urgency_pressure(listing_text),
        _check_domain_mismatch(application_url, known_official_website),
        _check_no_https(application_url),
    ]

    raw_score = sum(s.weight for s in signals if s.detected)
    total_score = min(100, raw_score)  # cap at 100
    category, label = _categorise(total_score)

    return RiskAssessment(
        total_score=total_score,
        risk_category=category,
        risk_label=label,
        signals=signals,
    )
