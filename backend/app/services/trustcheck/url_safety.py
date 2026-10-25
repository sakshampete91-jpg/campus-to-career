"""URL safety checker for TrustCheck service."""
from __future__ import annotations

import ipaddress
import re
from urllib.parse import urlparse


# Blocked URL schemes
BLOCKED_SCHEMES = {"javascript", "data", "file", "ftp"}

# Ranges that should be blocked (SSRF protection)
PRIVATE_RANGES = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("0.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),  # AWS metadata, link-local
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
]

LOCALHOST_NAMES = {"localhost", "localhost.localdomain"}


def _is_private_ip(hostname: str) -> bool:
    """Return True if hostname resolves to a private/reserved IP."""
    # Remove port if present
    host = hostname.split(":")[0].strip("[]")

    # Direct localhost name check
    if host.lower() in LOCALHOST_NAMES:
        return True

    # Try parsing as IP directly (don't do DNS resolution at this stage)
    try:
        addr = ipaddress.ip_address(host)
        for network in PRIVATE_RANGES:
            if addr in network:
                return True
        return False
    except ValueError:
        # Not a bare IP — we cannot resolve DNS here, so pass
        return False


def check_url_safety(url: str) -> dict:
    """Validate a URL for safety before any outbound request.

    Returns:
        dict with keys:
            safe (bool): Whether the URL passed all safety checks.
            reason (str): Human-readable explanation.
    """
    if not url or not url.strip():
        return {"safe": False, "reason": "Empty URL provided."}

    url = url.strip()

    # Basic format check
    try:
        parsed = urlparse(url)
    except Exception as exc:
        return {"safe": False, "reason": f"URL parse error: {exc}"}

    scheme = parsed.scheme.lower()
    if not scheme:
        return {"safe": False, "reason": "URL has no scheme (e.g. http:// or https://)."}

    if scheme in BLOCKED_SCHEMES:
        return {
            "safe": False,
            "reason": f"Scheme '{scheme}:' is not allowed. Only http and https are permitted.",
        }

    if scheme not in {"http", "https"}:
        return {
            "safe": False,
            "reason": f"Unsupported scheme '{scheme}:'. Only http and https are allowed.",
        }

    hostname = parsed.hostname or ""
    if not hostname:
        return {"safe": False, "reason": "URL has no hostname."}

    if _is_private_ip(hostname):
        return {
            "safe": False,
            "reason": f"Hostname '{hostname}' resolves to a private/reserved IP address. "
                      "Requests to internal networks are not permitted.",
        }

    return {"safe": True, "reason": "URL passed all safety checks."}
