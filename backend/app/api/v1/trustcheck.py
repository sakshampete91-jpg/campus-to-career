"""TrustCheck endpoints."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request, status

from app.schemas.trustcheck import TrustCheckReport, TrustCheckRequest
from app.services.trustcheck.scanner import get_cached_scan, run_trustcheck_scan

router = APIRouter(prefix="/trustcheck", tags=["trustcheck"])

# Simple in-memory rate limiter: {ip: [timestamp, ...]}
import time
from collections import defaultdict

_rate_limit_store: dict = defaultdict(list)
_RATE_LIMIT_WINDOW = 3600  # 1 hour in seconds
_RATE_LIMIT_MAX = 10


def _check_rate_limit(ip: str) -> None:
    """Raise 429 if the IP has exceeded the scan rate limit."""
    now = time.time()
    # Evict old entries
    _rate_limit_store[ip] = [t for t in _rate_limit_store[ip] if now - t < _RATE_LIMIT_WINDOW]
    if len(_rate_limit_store[ip]) >= _RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded: max {_RATE_LIMIT_MAX} scans per hour.",
        )
    _rate_limit_store[ip].append(now)


@router.post("/scan", response_model=TrustCheckReport, status_code=status.HTTP_200_OK)
async def scan_listing(
    payload: TrustCheckRequest,
    request: Request,
):
    """Run a full TrustCheck scan on a job listing.

    Performs:
    - URL safety validation
    - Deterministic signal detection
    - AI contextual analysis (if Ollama is available)
    - Risk scoring and recommendations
    """
    client_ip = request.client.host if request.client else "unknown"
    _check_rate_limit(client_ip)

    report = await run_trustcheck_scan(
        url=payload.url,
        listing_text=payload.listing_text,
        company_name=payload.company_name,
        known_official_website=payload.known_official_website,
        application_url=payload.url,
    )
    return report


@router.get("/scan/{scan_id}", response_model=TrustCheckReport)
def get_scan_result(scan_id: str):
    """Retrieve a previously cached scan result by scan_id."""
    result = get_cached_scan(scan_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan '{scan_id}' not found. Scans are cached in memory and lost on server restart.",
        )
    return result
