"""Opportunity API & Skill Matching tests."""
import pytest
from app.models.opportunity import Opportunity


@pytest.fixture
def sample_opportunity(db_session, employer_user):
    opp = Opportunity(
        title="Junior Python Engineer",
        company_name="Apex Technologies",
        company_website="https://apextech.example",
        description="Looking for an energetic junior developer to build backend services.",
        responsibilities=["Build REST APIs", "Write unit tests", "Collaborate with team"],
        required_skills=["Python", "SQL"],
        preferred_skills=["Docker", "Git"],
        compensation="₹25,000/month",
        is_paid=True,
        work_arrangement="remote",
        location="Remote",
        experience_level="entry",
        opportunity_type="internship",
        application_url="https://apextech.example/careers/py101",
        trust_status="verified",
        trust_score=15,
        posted_by_id=employer_user.id,
    )
    db_session.add(opp)
    db_session.commit()
    db_session.refresh(opp)
    return opp


def test_list_opportunities(client, sample_opportunity):
    response = client.get("/api/v1/opportunities/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(item["title"] == "Junior Python Engineer" for item in data)


def test_filter_by_skills(client, sample_opportunity):
    response = client.get("/api/v1/opportunities/?skills=Python")
    assert response.status_code == 200
    data = response.json()
    assert any("Python" in item["required_skills"] for item in data)


def test_match_score_calculation(client, sample_opportunity, student_token):
    response = client.get(
        f"/api/v1/opportunities/{sample_opportunity.id}/match-score",
        headers={"Authorization": f"Bearer {student_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "match_score" in data
    assert 0 <= data["match_score"] <= 100
    assert "matched_skills" in data
    assert any("python" in s.lower() for s in data["matched_skills"])


def test_employer_can_create_opportunity(client, employer_token):
    response = client.post(
        "/api/v1/opportunities/",
        headers={"Authorization": f"Bearer {employer_token}"},
        json={
            "title": "React Frontend Intern",
            "company_name": "Apex Technologies",
            "company_website": "https://apextech.example",
            "description": "Help design responsive web applications using Next.js and Tailwind CSS.",
            "responsibilities": ["Develop UI components", "Integrate APIs"],
            "required_skills": ["React", "TypeScript", "Tailwind CSS"],
            "preferred_skills": ["Next.js"],
            "is_paid": True,
            "compensation": "₹20,000/month",
            "work_arrangement": "remote",
            "location": "Remote",
            "experience_level": "entry",
            "opportunity_type": "internship",
            "application_url": "https://apextech.example/apply/react",
        },
    )
    assert response.status_code == 201
    assert response.json()["title"] == "React Frontend Intern"


def test_student_cannot_create_opportunity(client, student_token):
    response = client.post(
        "/api/v1/opportunities/",
        headers={"Authorization": f"Bearer {student_token}"},
        json={
            "title": "Unauthorized Listing",
            "company_name": "Fictional Corp",
            "description": "Should fail",
            "responsibilities": ["None"],
            "required_skills": ["None"],
            "is_paid": False,
            "work_arrangement": "remote",
            "location": "Remote",
            "experience_level": "entry",
            "opportunity_type": "internship",
            "application_url": "https://example.com",
        },
    )
    assert response.status_code == 403
