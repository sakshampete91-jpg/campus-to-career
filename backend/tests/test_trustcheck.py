"""Internship TrustCheck: URL safety and deterministic risk scoring tests."""
import pytest
from app.services.trustcheck.risk_scorer import calculate_risk_score
from app.services.trustcheck.url_safety import check_url_safety


# --- URL Safety Tests (SSRF & Scheme Defense) ---

def test_safe_url_passes():
    res = check_url_safety("https://legitcompany.example/careers/job1")
    assert res["safe"] is True
    assert "passed" in res["reason"].lower()


def test_javascript_scheme_blocked():
    res = check_url_safety("javascript:alert(1)")
    assert res["safe"] is False
    assert "not allowed" in res["reason"].lower() or "unsupported" in res["reason"].lower()


def test_file_and_data_schemes_blocked():
    assert check_url_safety("file:///etc/passwd")["safe"] is False
    assert check_url_safety("data:text/html,<script>alert(1)</script>")["safe"] is False


def test_localhost_blocked():
    assert check_url_safety("http://localhost:8000/apply")["safe"] is False
    assert check_url_safety("http://127.0.0.1:8000/apply")["safe"] is False


def test_private_ip_blocked():
    assert check_url_safety("http://10.0.0.1/apply")["safe"] is False
    assert check_url_safety("http://192.168.1.50/jobs")["safe"] is False
    assert check_url_safety("http://169.254.169.254/latest/meta-data")["safe"] is False


# --- Deterministic Risk Scoring Tests ---

def test_fee_request_detected():
    text = "To confirm your internship seat, a non-refundable registration fee of ₹2,500 is required upon selection."
    assessment = calculate_risk_score(listing_text=text, company_name="QuickHire Ltd")
    detected_names = [s.name for s in assessment.signals if s.detected]
    assert "upfront_fee_mention" in detected_names
    assert assessment.total_score >= 30


def test_document_request_detected():
    text = "Send your original Aadhaar and PAN card details along with your bank account number for onboarding."
    assessment = calculate_risk_score(listing_text=text, company_name="VagueCorp")
    detected_names = [s.name for s in assessment.signals if s.detected]
    assert "request_for_documents" in detected_names
    assert assessment.total_score >= 25


def test_guaranteed_placement_detected():
    text = "Enroll in our internship program with 100% placement and guaranteed job at top MNCs."
    assessment = calculate_risk_score(listing_text=text, company_name="TrainingInstitute")
    detected_names = [s.name for s in assessment.signals if s.detected]
    assert "guaranteed_placement" in detected_names


def test_domain_mismatch_detected():
    assessment = calculate_risk_score(
        listing_text="Apply for junior software role.",
        company_name="MegaTech Corp",
        application_url="https://megatech-careers-portal.fakejobs.com/apply",
        known_official_website="https://megatech.com",
    )
    detected_names = [s.name for s in assessment.signals if s.detected]
    assert "domain_mismatch" in detected_names


def test_low_risk_clean_listing():
    clean_text = (
        "We are looking for a Junior Backend Developer to assist in building API microservices. "
        "Candidates should have strong foundation in Python and SQL. This is a paid 3-month internship "
        "with stipend of ₹20,000 per month. Selected candidates will participate in daily standups and code reviews."
    )
    assessment = calculate_risk_score(
        listing_text=clean_text,
        company_name="Reputable Software Labs",
        company_website="https://reputablesoftware.example",
        responsibilities_text="Build APIs, write tests, participate in sprint reviews",
        application_url="https://reputablesoftware.example/careers/apply",
        known_official_website="https://reputablesoftware.example",
    )
    assert assessment.total_score < 25
    assert assessment.risk_category == "lower_risk"


def test_api_trustcheck_scan_endpoint(client):
    response = client.post(
        "/api/v1/trustcheck/scan",
        json={
            "url": "https://careers.safeexample.org/internships/se-2026",
            "listing_text": "Software Engineering Internship. Work on cloud applications. No fees. Paid stipend ₹18,000/month.",
            "company_name": "CloudWorks Technologies",
            "known_official_website": "https://careers.safeexample.org",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "signals" in data
    assert "disclaimer" in data
    assert data["url_safe"] is True
