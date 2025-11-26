from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.user import User
from utils.auth import get_password_hash


def get_auth_headers(client: TestClient) -> dict:
    """
    Create a user, log in, and return authentication headers.
    """
    # Create user
    client.post(
        "/auth/signup",
        json={
            "email": "profileuser@example.com",
            "username": "profileuser",
            "password": "password123",
            "full_name": "Profile User",
        },
    )
    # Log in to get token
    response = client.post(
        "/auth/login",
        json={"email": "profileuser@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_get_my_profile_success(client: TestClient):
    headers = get_auth_headers(client)
    response = client.get("/profile/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "profileuser@example.com"
    assert data["username"] == "profileuser"


def test_get_my_profile_unauthenticated(client: TestClient):
    response = client.get("/profile/me")
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authenticated"


def test_update_profile_success(client: TestClient):
    headers = get_auth_headers(client)
    update_data = {
        "bio": "This is my new bio.",
        "skills": ["python", "fastapi"],
        "interests": ["ai", "robotics"],
        "profile_image": "http://example.com/new_image.png",
    }
    response = client.put("/profile/me", headers=headers, json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["bio"] == "This is my new bio."
    assert data["skills"] == '["python", "fastapi"]'  # Skills are stored as JSON string
    assert data["interests"] == '["ai", "robotics"]'  # Interests are stored as JSON string
    assert data["profile_image"] == "http://example.com/new_image.png"


def test_update_profile_unauthenticated(client: TestClient):
    update_data = {"bio": "This should not work."}
    response = client.put("/profile/me", json=update_data)
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authenticated"


def test_toggle_mode_success(client: TestClient):
    headers = get_auth_headers(client)
    # Default mode is 'hustler', so toggle to 'builder'
    response = client.post("/profile/mode", headers=headers, json={"mode": "builder"})
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "builder"

    # Toggle back to 'hustler'
    response = client.post("/profile/mode", headers=headers, json={"mode": "hustler"})
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "hustler"


def test_toggle_mode_invalid(client: TestClient):
    headers = get_auth_headers(client)
    response = client.post("/profile/mode", headers=headers, json={"mode": "invalid_mode"})
    assert response.status_code == 422  # Unprocessable Entity for Pydantic validation error


def test_toggle_mode_unauthenticated(client: TestClient):
    response = client.post("/profile/mode", json={"mode": "builder"})
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authenticated"
