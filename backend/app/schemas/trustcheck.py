"""Pydantic schemas for TrustCheck."""
from __future__ import annotations

from datetime import datetime
from typing import List

from pydantic import BaseModel


class TrustCheckRequest(BaseModel):
    url: str
    listing_text: str = ""
    company_name: str = ""
    known_official_website: str = ""


class SignalEvidence(BaseModel):
    signal_name: str
    weight: int
    detected: bool
    explanation: str
    evidence: str  # actual text that triggered this signal


class TrustCheckReport(BaseModel):
    scan_id: str
    scanned_at: datetime
    url: str
    company_name: str
    risk_score: int  # 0–100
    risk_category: str  # lower_risk | some_warning_signs | high_risk_indicators | very_high_risk_indicators
    risk_label: str  # human-readable label
    signals: List[SignalEvidence]
    ai_analysis: str
    ai_available: bool
    url_safe: bool
    url_safety_reason: str
    live_scan_succeeded: bool
    recommendations: List[str]
    disclaimer: str
