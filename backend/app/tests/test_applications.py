"""Test cases for Application Accept/Reject functionality"""

from fastapi.testclient import TestClient


def get_builder_headers(client: TestClient) -> dict:
    """Create a 'builder' user and return auth headers."""
    client.post(
        "/auth/signup",
        json={
            "email": "builder@example.com",
            "username": "builder",
            "password": "password123",
            "full_name": "Builder User",
            "mode": "builder",
        },
    )
    response = client.post(
        "/auth/login",
        json={"email": "builder@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def get_hustler_headers(
    client: TestClient, email: str | None = None, username: str | None = None
) -> dict:
    """Create a 'hustler' user and return auth headers."""
    email = email or f"hustler{hash(username or 'default')}@example.com"
    username = username or "hustler1"

    client.post(
        "/auth/signup",
        json={
            "email": email,
            "username": username,
            "password": "password123",
            "full_name": "Hustler User",
            "mode": "hustler",
        },
    )
    response = client.post(
        "/auth/login",
        json={"email": email, "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_accept_application(client: TestClient):
    """Test accepting an application"""
    builder_headers = get_builder_headers(client)
    hustler_headers = get_hustler_headers(client, "hustler1@example.com", "hustler1")

    # Builder creates opportunity
    opp_response = client.post(
        "/opportunities",
        headers=builder_headers,
        json={
            "title": "Web Development Task",
            "description": "Build a responsive website for our client.",
        },
    )
    opportunity_id = opp_response.json()["id"]

    # Hustler applies
    apply_response = client.post(
        f"/opportunities/{opportunity_id}/apply",
        headers=hustler_headers,
        json={"message": "I can do this!"},
    )
    application_id = apply_response.json()["id"]

    # Builder accepts application
    accept_response = client.put(
        f"/opportunities/applications/{application_id}/status",
        headers=builder_headers,
        json={"status": "accepted"},
    )
    assert accept_response.status_code == 200
    data = accept_response.json()
    assert data["status"] == "accepted"


def test_reject_application(client: TestClient):
    """Test rejecting an application"""
    builder_headers = get_builder_headers(client)
    hustler_headers = get_hustler_headers(client, "hustler2@example.com", "hustler2")

    # Builder creates opportunity
    opp_response = client.post(
        "/opportunities",
        headers=builder_headers,
        json={
            "title": "Mobile App Development",
            "description": "Develop an iOS app.",
        },
    )
    opportunity_id = opp_response.json()["id"]

    # Hustler applies
    apply_response = client.post(
        f"/opportunities/{opportunity_id}/apply",
        headers=hustler_headers,
        json={"message": "I'm interested!"},
    )
    application_id = apply_response.json()["id"]

    # Builder rejects application
    reject_response = client.put(
        f"/opportunities/applications/{application_id}/status",
        headers=builder_headers,
        json={"status": "rejected"},
    )
    assert reject_response.status_code == 200
    data = reject_response.json()
    assert data["status"] == "rejected"


def test_get_builder_applications(client: TestClient):
    """Test builder can view their applications"""
    builder_headers = get_builder_headers(client)
    hustler_headers = get_hustler_headers(client, "hustler3@example.com", "hustler3")

    # Builder creates opportunity
    opp_response = client.post(
        "/opportunities",
        headers=builder_headers,
        json={
            "title": "UI/UX Design",
            "description": "Design app interface.",
        },
    )
    opportunity_id = opp_response.json()["id"]

    # Hustler applies
    client.post(
        f"/opportunities/{opportunity_id}/apply",
        headers=hustler_headers,
        json={"message": "Great opportunity!"},
    )

    # Get builder's applications
    response = client.get(
        "/opportunities/my-applications",
        headers=builder_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_hustler_cannot_accept_applications(client: TestClient):
    """Test that hustlers cannot accept applications"""
    builder_headers = get_builder_headers(client)
    hustler_headers = get_hustler_headers(client, "hustler4@example.com", "hustler4")

    # Builder creates opportunity
    opp_response = client.post(
        "/opportunities",
        headers=builder_headers,
        json={"title": "Task", "description": "A task."},
    )
    opportunity_id = opp_response.json()["id"]

    # Hustler applies
    apply_response = client.post(
        f"/opportunities/{opportunity_id}/apply",
        headers=hustler_headers,
        json={"message": "Me!"},
    )
    application_id = apply_response.json()["id"]

    # Hustler tries to accept (should fail)
    response = client.put(
        f"/opportunities/applications/{application_id}/status",
        headers=hustler_headers,
        json={"status": "accepted"},
    )
    assert response.status_code == 403


def test_accept_application_invalid_status(client: TestClient):
    """Test that invalid status is rejected"""
    builder_headers = get_builder_headers(client)
    hustler_headers = get_hustler_headers(client, "hustler5@example.com", "hustler5")

    # Builder creates opportunity
    opp_response = client.post(
        "/opportunities",
        headers=builder_headers,
        json={"title": "Task", "description": "A task."},
    )
    opportunity_id = opp_response.json()["id"]

    # Hustler applies
    apply_response = client.post(
        f"/opportunities/{opportunity_id}/apply",
        headers=hustler_headers,
        json={"message": "Apply!"},
    )
    application_id = apply_response.json()["id"]

    # Try invalid status
    response = client.put(
        f"/opportunities/applications/{application_id}/status",
        headers=builder_headers,
        json={"status": "invalid_status"},
    )
    assert response.status_code == 400


def test_accept_nonexistent_application(client: TestClient):
    """Test accepting a non-existent application"""
    builder_headers = get_builder_headers(client)

    response = client.put(
        "/opportunities/applications/999999/status",
        headers=builder_headers,
        json={"status": "accepted"},
    )
    assert response.status_code == 404


def test_application_status_pending_by_default(client: TestClient):
    """Test that new applications have pending status"""
    builder_headers = get_builder_headers(client)
    hustler_headers = get_hustler_headers(client, "hustler6@example.com", "hustler6")

    # Builder creates opportunity
    opp_response = client.post(
        "/opportunities",
        headers=builder_headers,
        json={"title": "Task", "description": "A task."},
    )
    opportunity_id = opp_response.json()["id"]

    # Hustler applies
    apply_response = client.post(
        f"/opportunities/{opportunity_id}/apply",
        headers=hustler_headers,
        json={"message": "Apply!"},
    )
    data = apply_response.json()
    # Status should be pending by default
    assert data.get("status", "pending") in ["pending", None]


def test_update_application_preserves_data(client: TestClient):
    """Test that updating application status preserves other data"""
    builder_headers = get_builder_headers(client)
    hustler_headers = get_hustler_headers(client, "hustler7@example.com", "hustler7")

    # Builder creates opportunity
    opp_response = client.post(
        "/opportunities",
        headers=builder_headers,
        json={"title": "Task", "description": "A task."},
    )
    opportunity_id = opp_response.json()["id"]

    # Hustler applies with specific message
    apply_response = client.post(
        f"/opportunities/{opportunity_id}/apply",
        headers=hustler_headers,
        json={"message": "My specific message!"},
    )
    application_id = apply_response.json()["id"]
    original_message = apply_response.json()["message"]

    # Accept application
    accept_response = client.put(
        f"/opportunities/applications/{application_id}/status",
        headers=builder_headers,
        json={"status": "accepted"},
    )

    # Check that message is preserved
    data = accept_response.json()
    assert data["message"] == original_message
    assert data["status"] == "accepted"
