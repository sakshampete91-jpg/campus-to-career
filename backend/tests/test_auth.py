"""Authentication & User API tests."""
import pytest


def test_register_student_success(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newstudent@example.com",
            "password": "SecurePassword123!",
            "full_name": "Jordan Doe",
            "role": "student",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newstudent@example.com"
    assert data["role"] == "student"
    assert "id" in data


def test_register_duplicate_email_fails(client, student_user):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": student_user.email,
            "password": "AnotherPassword123!",
            "full_name": "Duplicate User",
            "role": "student",
        },
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_login_success(client, student_user):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": student_user.email,
            "password": "StudentPass123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_success_with_json(client, student_user):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": student_user.email,
            "password": "StudentPass123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == student_user.email


def test_login_wrong_password(client, student_user):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": student_user.email,
            "password": "WrongPassword999!",
        },
    )
    assert response.status_code == 401


def test_protected_route_without_token(client):
    response = client.get("/api/v1/users/profile")
    assert response.status_code == 401


def test_protected_route_with_valid_token(client, student_token):
    response = client.get(
        "/api/v1/users/profile",
        headers={"Authorization": f"Bearer {student_token}"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test_student@example.com"
