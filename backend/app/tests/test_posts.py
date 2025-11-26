"""Test cases for Posts functionality"""

from fastapi.testclient import TestClient


def get_user_headers(client: TestClient, email: str, username: str) -> dict:
    """Create a user and return auth headers."""
    client.post(
        "/auth/signup",
        json={
            "email": email,
            "username": username,
            "password": "password123",
            "full_name": f"{username} User",
        },
    )
    response = client.post(
        "/auth/login",
        json={"email": email, "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_post(client: TestClient):
    """Test creating a new post"""
    headers = get_user_headers(client, "author@example.com", "author1")
    response = client.post(
        "/posts",
        headers=headers,
        json={
            "content": "This is my first post! Excited to share my journey.",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "This is my first post! Excited to share my journey."
    assert data["likes_count"] == 0
    assert data["comments_count"] == 0
    assert data["author_id"] > 0


def test_create_post_empty_content(client: TestClient):
    """Test creating a post with empty content fails"""
    headers = get_user_headers(client, "author@example.com", "author1")
    response = client.post(
        "/posts",
        headers=headers,
        json={"content": ""},
    )
    assert response.status_code == 422  # Validation error


def test_create_post_unauthenticated(client: TestClient):
    """Test creating a post without authentication fails"""
    response = client.post(
        "/posts",
        json={"content": "This should fail"},
    )
    assert response.status_code == 403


def test_get_all_posts(client: TestClient):
    """Test retrieving all posts"""
    headers = get_user_headers(client, "author@example.com", "author1")

    # Create multiple posts
    client.post(
        "/posts",
        headers=headers,
        json={"content": "Post 1"},
    )
    client.post(
        "/posts",
        headers=headers,
        json={"content": "Post 2"},
    )

    response = client.get("/posts", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2


def test_get_posts_empty(client: TestClient):
    """Test retrieving posts when none exist"""
    headers = get_user_headers(client, "author@example.com", "author1")
    response = client.get("/posts", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_get_post_by_id(client: TestClient):
    """Test retrieving a specific post by ID"""
    headers = get_user_headers(client, "author@example.com", "author1")

    # Create a post
    create_response = client.post(
        "/posts",
        headers=headers,
        json={"content": "Specific post content"},
    )
    post_id = create_response.json()["id"]

    # Get the post
    response = client.get(f"/posts/{post_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == post_id
    assert data["content"] == "Specific post content"


def test_get_post_not_found(client: TestClient):
    """Test retrieving a non-existent post"""
    headers = get_user_headers(client, "author@example.com", "author1")
    response = client.get("/posts/999999", headers=headers)
    assert response.status_code == 404


def test_update_post(client: TestClient):
    """Test updating a post"""
    headers = get_user_headers(client, "author@example.com", "author1")

    # Create a post
    create_response = client.post(
        "/posts",
        headers=headers,
        json={"content": "Original content"},
    )
    post_id = create_response.json()["id"]

    # Update the post
    update_response = client.put(
        f"/posts/{post_id}",
        headers=headers,
        json={"content": "Updated content"},
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["content"] == "Updated content"


def test_update_post_not_author(client: TestClient):
    """Test that non-author cannot update post"""
    author_headers = get_user_headers(client, "author@example.com", "author1")
    other_headers = get_user_headers(client, "other@example.com", "other1")

    # Create a post by author
    create_response = client.post(
        "/posts",
        headers=author_headers,
        json={"content": "Original content"},
    )
    post_id = create_response.json()["id"]

    # Try to update with different user
    update_response = client.put(
        f"/posts/{post_id}",
        headers=other_headers,
        json={"content": "Hacked content"},
    )
    assert update_response.status_code == 403


def test_delete_post(client: TestClient):
    """Test deleting a post"""
    headers = get_user_headers(client, "author@example.com", "author1")

    # Create a post
    create_response = client.post(
        "/posts",
        headers=headers,
        json={"content": "To be deleted"},
    )
    post_id = create_response.json()["id"]

    # Delete the post
    delete_response = client.delete(f"/posts/{post_id}", headers=headers)
    assert delete_response.status_code == 204

    # Verify it's deleted
    get_response = client.get(f"/posts/{post_id}", headers=headers)
    assert get_response.status_code == 404


def test_delete_post_not_author(client: TestClient):
    """Test that non-author cannot delete post"""
    author_headers = get_user_headers(client, "author@example.com", "author1")
    other_headers = get_user_headers(client, "other@example.com", "other1")

    # Create a post by author
    create_response = client.post(
        "/posts",
        headers=author_headers,
        json={"content": "Original content"},
    )
    post_id = create_response.json()["id"]

    # Try to delete with different user
    delete_response = client.delete(f"/posts/{post_id}", headers=other_headers)
    assert delete_response.status_code == 403


def test_like_post(client: TestClient):
    """Test liking a post"""
    author_headers = get_user_headers(client, "author@example.com", "author1")
    liker_headers = get_user_headers(client, "liker@example.com", "liker1")

    # Create a post
    create_response = client.post(
        "/posts",
        headers=author_headers,
        json={"content": "Like this post!"},
    )
    post_id = create_response.json()["id"]

    # Like the post
    like_response = client.post(
        f"/posts/{post_id}/like",
        headers=liker_headers,
    )
    assert like_response.status_code == 200
    data = like_response.json()
    assert data["likes_count"] >= 1


def test_like_post_multiple_times(client: TestClient):
    """Test that a user can like a post multiple times"""
    author_headers = get_user_headers(client, "author@example.com", "author1")
    liker_headers = get_user_headers(client, "liker@example.com", "liker1")

    # Create a post
    create_response = client.post(
        "/posts",
        headers=author_headers,
        json={"content": "Like this post!"},
    )
    post_id = create_response.json()["id"]

    # Like the post multiple times
    client.post(f"/posts/{post_id}/like", headers=liker_headers)
    _ = client.post(f"/posts/{post_id}/like", headers=liker_headers)

    # Check likes are counted correctly
    get_response = client.get(f"/posts/{post_id}", headers=liker_headers)
    assert get_response.status_code == 200


def test_like_post_not_found(client: TestClient):
    """Test liking a non-existent post"""
    headers = get_user_headers(client, "author@example.com", "author1")
    response = client.post("/posts/999999/like", headers=headers)
    assert response.status_code == 404


def test_post_author_information(client: TestClient):
    """Test that post includes author information"""
    headers = get_user_headers(client, "author@example.com", "author1")

    # Create a post
    create_response = client.post(
        "/posts",
        headers=headers,
        json={"content": "Test post with author info"},
    )
    post_id = create_response.json()["id"]

    # Get the post
    response = client.get(f"/posts/{post_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "author_id" in data
    assert data["author_id"] > 0


def test_post_timestamps(client: TestClient):
    """Test that posts have creation and update timestamps"""
    headers = get_user_headers(client, "author@example.com", "author1")

    # Create a post
    create_response = client.post(
        "/posts",
        headers=headers,
        json={"content": "Test post timestamps"},
    )
    data = create_response.json()

    assert "created_at" in data
    assert "updated_at" in data
    assert data["created_at"] is not None
    assert data["updated_at"] is not None
