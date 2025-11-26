from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.user import User  # type: ignore
from models.opportunity import Opportunity  # type: ignore
from utils.auth import get_password_hash  # type: ignore


def get_creator_headers(client: TestClient) -> dict:
    """Create a 'creator' user and return auth headers."""
    client.post(
        "/auth/signup",
        json={
            "email": "creator@example.com",
            "username": "creator",
            "password": "password123",
            "full_name": "Creator User",
        },
    )
    response = client.post(
        "/auth/login",
        json={"email": "creator@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def get_applicant_headers(client: TestClient) -> dict:
    """Create an 'applicant' user and return auth headers."""
    client.post(
        "/auth/signup",
        json={
            "email": "applicant@example.com",
            "username": "applicant",
            "password": "password123",
            "full_name": "Applicant User",
        },
    )
    response = client.post(
        "/auth/login",
        json={"email": "applicant@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_opportunity(client: TestClient):
    headers = get_creator_headers(client)
    response = client.post(
        "/opportunities",
        headers=headers,
        json={
            "title": "New Test Opportunity",
            "description": "This is a detailed description of the test opportunity.",
            "required_skills": ["python", "sql"],
            "bounty_amount": 500,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "New Test Opportunity"
    assert data["bounty_amount"] == 500
    assert data["creator_id"] > 0


def test_get_opportunities(client: TestClient, db_session: Session):
    headers = get_creator_headers(client)
    # Create an opportunity first
    client.post(
        "/opportunities",
        headers=headers,
        json={"title": "List Test", "description": "A test for listing opportunities."},
    )

    response = client.get("/opportunities", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["title"] == "List Test"


def test_get_opportunity_by_id(client: TestClient):
    headers = get_creator_headers(client)
    create_response = client.post(
        "/opportunities",
        headers=headers,
        json={
            "title": "Get By ID Test",
            "description": "A comprehensive test for getting by id.",
        },
    )
    opportunity_id = create_response.json()["id"]

    response = client.get(f"/opportunities/{opportunity_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == opportunity_id
    assert data["title"] == "Get By ID Test"


def test_update_opportunity(client: TestClient):
    headers = get_creator_headers(client)
    create_response = client.post(
        "/opportunities",
        headers=headers,
        json={
            "title": "Update Test",
            "description": "Before update with more details.",
        },
    )
    opportunity_id = create_response.json()["id"]

    update_response = client.put(
        f"/opportunities/{opportunity_id}",
        headers=headers,
        json={
            "title": "Updated Title",
            "description": "After update with more details.",
        },
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "After update with more details."


def test_update_opportunity_not_creator(client: TestClient):
    creator_headers = get_creator_headers(client)
    applicant_headers = get_applicant_headers(client)
    create_response = client.post(
        "/opportunities",
        headers=creator_headers,
        json={
            "title": "Auth Test",
            "description": "Testing authorization enforcement properly.",
        },
    )
    opportunity_id = create_response.json()["id"]

    update_response = client.put(
        f"/opportunities/{opportunity_id}",
        headers=applicant_headers,  # Use applicant's token
        json={"title": "Should Fail", "description": "This should not work."},
    )
    assert update_response.status_code == 403


def test_delete_opportunity(client: TestClient):
    headers = get_creator_headers(client)
    create_response = client.post(
        "/opportunities",
        headers=headers,
        json={
            "title": "Delete Test",
            "description": "This opportunity will be deleted in test.",
        },
    )
    opportunity_id = create_response.json()["id"]

    delete_response = client.delete(f"/opportunities/{opportunity_id}", headers=headers)
    assert delete_response.status_code == 204

    get_response = client.get(f"/opportunities/{opportunity_id}", headers=headers)
    assert get_response.status_code == 404


def test_apply_to_opportunity(client: TestClient):
    creator_headers = get_creator_headers(client)
    applicant_headers = get_applicant_headers(client)
    create_response = client.post(
        "/opportunities",
        headers=creator_headers,
        json={
            "title": "Apply Test",
            "description": "Testing application process thoroughly.",
        },
    )
    opportunity_id = create_response.json()["id"]

    apply_response = client.post(
        f"/opportunities/{opportunity_id}/apply",
        headers=applicant_headers,
        json={"message": "I am a great fit for this opportunity!"},
    )
    assert apply_response.status_code == 201
    data = apply_response.json()
    assert data["message"] == "I am a great fit for this opportunity!"
    assert data["applicant_id"] > 0


def test_get_opportunity_applications(client: TestClient):
    creator_headers = get_creator_headers(client)
    applicant_headers = get_applicant_headers(client)
    create_response = client.post(
        "/opportunities",
        headers=creator_headers,
        json={
            "title": "Get Apps Test",
            "description": "Testing retrieval of applications properly.",
        },
    )
    opportunity_id = create_response.json()["id"]

    # Apply first
    client.post(
        f"/opportunities/{opportunity_id}/apply",
        headers=applicant_headers,
        json={"message": "Test application."},
    )

    # Creator gets applications
    get_apps_response = client.get(
        f"/opportunities/{opportunity_id}/applications", headers=creator_headers
    )
    assert get_apps_response.status_code == 200
    data = get_apps_response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["message"] == "Test application."
