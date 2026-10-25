"""Seed script: creates demo users and opportunities for Campus to Career."""
from __future__ import annotations

import sys
import os

# Ensure the backend directory is in sys.path
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal, create_tables
from app.core.security import hash_password
from app.models.opportunity import Opportunity
from app.models.user import User


DEMO_EMPLOYERS = [
    {
        "email": "employer1@demo.campustocareer.example",
        "password": "Demo@1234",
        "full_name": "Alex Rivera",
        "role": "employer",
        "company_name": "TechVentures Inc",
        "company_website": "https://techventures.example.com",
        "company_description": "A fast-growing technology company building next-generation AI products.",
    },
    {
        "email": "employer2@demo.campustocareer.example",
        "password": "Demo@1234",
        "full_name": "Morgan Lee",
        "role": "employer",
        "company_name": "CreativeStudio",
        "company_website": "https://creativestudio.example.com",
        "company_description": "A boutique design and media studio specialising in brand identity.",
    },
]

DEMO_STUDENTS = [
    {
        "email": "student1@demo.campustocareer.example",
        "password": "Demo@1234",
        "full_name": "Jamie Chen",
        "role": "student",
        "skills": [
            {"name": "Python", "level": "intermediate"},
            {"name": "Machine Learning", "level": "beginner"},
            {"name": "SQL", "level": "intermediate"},
            {"name": "React", "level": "beginner"},
        ],
        "academic_year": "3rd Year",
        "education": [
            {
                "institution": "State University of Technology",
                "degree": "B.Tech",
                "field_of_study": "Computer Science",
                "start_year": 2022,
                "end_year": 2026,
            }
        ],
        "projects": [
            {
                "name": "Sentiment Analyser",
                "description": "NLP tool that classifies product reviews.",
                "tech_stack": ["Python", "NLTK", "Flask"],
            }
        ],
        "github_url": "https://github.com/demo-student1",
        "work_type_preference": ["remote", "hybrid"],
        "opportunity_type_preference": ["internship"],
    },
    {
        "email": "student2@demo.campustocareer.example",
        "password": "Demo@1234",
        "full_name": "Priya Sharma",
        "role": "student",
        "skills": [
            {"name": "Photoshop", "level": "advanced"},
            {"name": "Illustrator", "level": "advanced"},
            {"name": "Premiere Pro", "level": "intermediate"},
            {"name": "Figma", "level": "intermediate"},
        ],
        "academic_year": "2nd Year",
        "education": [
            {
                "institution": "Design College of the Arts",
                "degree": "B.Des",
                "field_of_study": "Communication Design",
                "start_year": 2023,
                "end_year": 2027,
            }
        ],
        "projects": [
            {
                "name": "Brand Identity Redesign",
                "description": "Redesigned branding for a student-run cafe.",
                "tech_stack": ["Illustrator", "Photoshop"],
            }
        ],
        "work_type_preference": ["hybrid", "onsite"],
        "opportunity_type_preference": ["internship", "part-time"],
    },
]

DEMO_OPPORTUNITIES = [
    {
        "title": "Junior AI Developer",
        "company_name": "TechVentures Inc",
        "company_website": "https://techventures.example.com",
        "description": (
            "We are looking for a motivated Junior AI Developer to join our ML team. "
            "You will work on building and improving machine learning models for our core product. "
            "This is a great opportunity to gain hands-on experience with real-world AI systems."
        ),
        "responsibilities": [
            "Assist in developing and training ML models",
            "Write clean, maintainable Python code",
            "Participate in code reviews and team meetings",
            "Document experiments and results",
        ],
        "required_skills": ["Python", "ML basics", "NumPy"],
        "preferred_skills": ["TensorFlow", "PyTorch", "scikit-learn"],
        "compensation": "₹15,000/month",
        "is_paid": True,
        "work_arrangement": "remote",
        "location": "Remote",
        "experience_level": "entry",
        "opportunity_type": "internship",
        "application_url": "https://techventures.example.com/careers/junior-ai-dev",
        "listing_source": "company_website",
        "trust_status": "verified",
        "trust_score": 90,
        "is_demo": True,
    },
    {
        "title": "Graphic Designer Intern",
        "company_name": "CreativeStudio",
        "company_website": "https://creativestudio.example.com",
        "description": (
            "CreativeStudio is seeking a Graphic Designer Intern to support our design team. "
            "You will work on branding, marketing collateral, and social media assets for our clients."
        ),
        "responsibilities": [
            "Create visual assets for digital and print media",
            "Collaborate with the design team on client projects",
            "Prepare files for production",
            "Attend client briefings",
        ],
        "required_skills": ["Photoshop", "Illustrator"],
        "preferred_skills": ["Figma", "InDesign", "After Effects"],
        "compensation": "₹8,000/month",
        "is_paid": True,
        "work_arrangement": "hybrid",
        "location": "Flexible",
        "experience_level": "entry",
        "opportunity_type": "internship",
        "application_url": "https://creativestudio.example.com/internships",
        "listing_source": "company_website",
        "trust_status": "verified",
        "trust_score": 85,
        "is_demo": True,
    },
    {
        "title": "Video Editor Intern",
        "company_name": "MediaWorks",
        "company_website": "https://mediaworks.example.com",
        "description": (
            "MediaWorks is a video production company looking for a Video Editor Intern. "
            "This is an unpaid internship that offers valuable exposure to professional video production workflows."
        ),
        "responsibilities": [
            "Edit raw video footage for YouTube and social channels",
            "Apply colour grading and audio adjustments",
            "Manage project files and exports",
            "Work with senior editors for feedback",
        ],
        "required_skills": ["Premiere Pro", "After Effects"],
        "preferred_skills": ["DaVinci Resolve", "Motion Graphics"],
        "compensation": None,
        "is_paid": False,
        "work_arrangement": "remote",
        "location": "Remote",
        "experience_level": "entry",
        "opportunity_type": "internship",
        "application_url": "https://mediaworks.example.com/apply",
        "listing_source": "company_website",
        "trust_status": "partially_verified",
        "trust_score": 65,
        "is_demo": True,
    },
    {
        "title": "Full Stack Developer Intern",
        "company_name": "CodeCraft Solutions",
        "company_website": "https://codecraft.example.com",
        "description": (
            "CodeCraft Solutions is looking for a Full Stack Developer Intern to join our product team. "
            "You will work on our web application, helping build new features and improve existing ones."
        ),
        "responsibilities": [
            "Develop frontend components using React",
            "Build and maintain Node.js REST APIs",
            "Write unit and integration tests",
            "Participate in daily stand-ups",
        ],
        "required_skills": ["React", "Node.js"],
        "preferred_skills": ["TypeScript", "PostgreSQL", "Docker"],
        "compensation": "₹20,000/month",
        "is_paid": True,
        "work_arrangement": "onsite",
        "location": "On-site",
        "experience_level": "entry",
        "opportunity_type": "internship",
        "application_url": "https://codecraft.example.com/careers",
        "listing_source": "company_website",
        "trust_status": "verified",
        "trust_score": 88,
        "is_demo": True,
    },
    {
        "title": "Data Analyst Intern",
        "company_name": "DataInsights Corp",
        "company_website": "https://datainsights.example.com",
        "description": (
            "DataInsights Corp is seeking a Data Analyst Intern to help analyse business data "
            "and produce meaningful reports. You will use Python, SQL, and Excel to derive insights."
        ),
        "responsibilities": [
            "Collect and clean data from various sources",
            "Perform exploratory data analysis",
            "Build dashboards and reports",
            "Present findings to the team",
        ],
        "required_skills": ["Python", "SQL", "Excel"],
        "preferred_skills": ["Tableau", "Power BI", "pandas"],
        "compensation": "₹12,000/month",
        "is_paid": True,
        "work_arrangement": "remote",
        "location": "Remote",
        "experience_level": "entry",
        "opportunity_type": "internship",
        "application_url": "https://datainsights.example.com/jobs",
        "listing_source": "company_website",
        "trust_status": "verified",
        "trust_score": 82,
        "is_demo": True,
    },
]


def seed():
    """Run the seed script."""
    print("Creating database tables...")
    create_tables()

    db = SessionLocal()
    try:
        # Seed employers
        for emp_data in DEMO_EMPLOYERS:
            existing = db.query(User).filter(User.email == emp_data["email"]).first()
            if existing:
                print(f"  [SKIP] Employer already exists: {emp_data['email']}")
                continue
            password = emp_data.pop("password")
            user = User(
                **{k: v for k, v in emp_data.items()},
                hashed_password=hash_password(password),
                skills=[],
                education=[],
                projects=[],
                work_type_preference=[],
                opportunity_type_preference=[],
            )
            db.add(user)
            print(f"  [CREATE] Employer: {emp_data['email']}")

        db.commit()

        # Seed students
        for stu_data in DEMO_STUDENTS:
            existing = db.query(User).filter(User.email == stu_data["email"]).first()
            if existing:
                print(f"  [SKIP] Student already exists: {stu_data['email']}")
                continue
            password = stu_data.pop("password")
            user = User(
                **{k: v for k, v in stu_data.items()},
                hashed_password=hash_password(password),
            )
            db.add(user)
            print(f"  [CREATE] Student: {stu_data['email']}")

        db.commit()

        # Seed opportunities
        for opp_data in DEMO_OPPORTUNITIES:
            existing = db.query(Opportunity).filter(
                Opportunity.title == opp_data["title"],
                Opportunity.company_name == opp_data["company_name"],
                Opportunity.is_demo == True,
            ).first()
            if existing:
                print(f"  [SKIP] Opportunity already exists: {opp_data['title']}")
                continue
            opp = Opportunity(**opp_data)
            db.add(opp)
            print(f"  [CREATE] Opportunity: {opp_data['title']} @ {opp_data['company_name']}")

        db.commit()
        print("\nSeed complete.")
    except Exception as exc:
        db.rollback()
        print(f"Seed failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
