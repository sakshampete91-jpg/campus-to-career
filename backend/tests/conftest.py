"""Test configuration and shared fixtures for Campus to Career backend."""
import os

os.environ["TESTING"] = "true"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.security import hash_password, create_access_token
import app.models  # load all models into registry
from app.main import app
from app.models.user import User

# In-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    """Provide a clean DB session per test."""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    """Provide a TestClient with overridden get_db dependency."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def student_user(db_session):
    """Seed a student user."""
    user = User(
        email="test_student@example.com",
        hashed_password=hash_password("StudentPass123!"),
        full_name="Alex Student",
        role="student",
        is_active=True,
        skills=[{"name": "Python", "level": "intermediate"}, {"name": "React", "level": "beginner"}],
        education={"degree": "B.Tech", "institution": "Tech University", "field": "Computer Science"},
        academic_year="3rd Year",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def employer_user(db_session):
    """Seed an employer user."""
    user = User(
        email="test_employer@example.com",
        hashed_password=hash_password("EmployerPass123!"),
        full_name="Sam Recruiter",
        role="employer",
        company_name="Apex Technologies",
        company_website="https://apextech.example",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def student_token(student_user):
    return create_access_token(subject=str(student_user.id))


@pytest.fixture
def employer_token(employer_user):
    return create_access_token(subject=str(employer_user.id))
