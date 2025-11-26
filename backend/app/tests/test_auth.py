from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.user import User
from utils.auth import get_password_hash


def test_signup_success(client: TestClient):
    response = client.post(
        "/auth/signup",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123",
            "full_name": "Test User",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_signup_existing_email(client: TestClient, db_session: Session):
    # Create a user first
    existing_user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("password123"),
        full_name="Test User",
    )
    db_session.add(existing_user)
    db_session.commit()

    response = client.post(
        "/auth/signup",
        json={
            "email": "test@example.com",
            "username": "newuser",
            "password": "password123",
            "full_name": "New User",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_signup_existing_username(client: TestClient, db_session: Session):
    # Create a user first
    existing_user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("password123"),
        full_name="Test User",
    )
    db_session.add(existing_user)
    db_session.commit()

    response = client.post(
        "/auth/signup",
        json={
            "email": "new@example.com",
            "username": "testuser",
            "password": "password123",
            "full_name": "New User",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already taken"


def test_login_success(client: TestClient, db_session: Session):
    # Create a user to login
    hashed_password = get_password_hash("password123")
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=hashed_password,
        full_name="Test User",
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_email(client: TestClient):
    response = client.post(
        "/auth/login",
        json={"email": "wrong@example.com", "password": "password123"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_login_invalid_password(client: TestClient, db_session: Session):
    # Create a user to login
    hashed_password = get_password_hash("password123")
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=hashed_password,
        full_name="Test User",
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"
