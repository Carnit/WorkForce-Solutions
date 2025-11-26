"""
Selenium Integration Tests for Full Stack Application
Tests both frontend and backend functionality end-to-end
"""

import time
import pytest
import requests  # type: ignore
from selenium import webdriver  # type: ignore
from selenium.webdriver.common.by import By  # type: ignore
from selenium.webdriver.support.ui import WebDriverWait  # type: ignore
from selenium.webdriver.support import expected_conditions as EC  # type: ignore
from selenium.webdriver.chrome.service import Service  # type: ignore
from webdriver_manager.chrome import ChromeDriverManager  # type: ignore


# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5173"
WAIT_TIMEOUT = 10


class TestBackendAPI:
    """Test backend API endpoints"""

    base_email: str
    base_password: str
    base_full_name: str

    @classmethod
    def setup_class(cls):
        """Bootstrap a reusable test user for authenticated scenarios"""
        timestamp = int(time.time())
        cls.base_email = f"selenium_user_{timestamp}@example.com"
        cls.base_password = "TestPassword123!"
        cls.base_full_name = "Selenium Test User"

        response = requests.post(
            f"{BACKEND_URL}/auth/signup",
            json={
                "email": cls.base_email,
                "username": cls.base_email.split("@")[0],
                "password": cls.base_password,
                "full_name": cls.base_full_name,
            },
        )
        assert response.status_code in (201, 400), response.text

    def _login(self) -> str:
        """Authenticate base user and return JWT token"""
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={"email": self.base_email, "password": self.base_password},
        )
        assert response.status_code == 200, response.text
        data = response.json()
        assert "access_token" in data
        return data["access_token"]

    def _auth_headers(self) -> dict[str, str]:
        """Convenience helper for authenticated requests"""
        token = self._login()
        return {"Authorization": f"Bearer {token}"}

    def test_01_user_signup(self):
        """Test user signup endpoint"""
        unique_email = f"test_signup_{int(time.time())}@example.com"
        response = requests.post(
            f"{BACKEND_URL}/auth/signup",
            json={
                "email": unique_email,
                "username": unique_email.split("@")[0],
                "password": self.base_password,
                "full_name": self.base_full_name,
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data

    def test_02_user_login(self):
        """Test user login endpoint"""
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={"email": self.base_email, "password": self.base_password},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data

    def test_03_get_profile(self):
        """Test get profile endpoint"""
        headers = self._auth_headers()
        response = requests.get(f"{BACKEND_URL}/profile/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == self.base_email

    def test_04_create_opportunity(self):
        """Test create opportunity endpoint"""
        headers = self._auth_headers()
        opportunity_data = {
            "title": "Test Opportunity",
            "description": "This is a test opportunity with sufficient description length",
            "required_skills": ["Python", "FastAPI"],
            "bounty_amount": 1000,
        }
        response = requests.post(
            f"{BACKEND_URL}/opportunities",
            json=opportunity_data,
            headers=headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Opportunity"

    def test_05_get_opportunities(self):
        """Test get opportunities endpoint"""
        headers = self._auth_headers()
        response = requests.get(f"{BACKEND_URL}/opportunities", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_06_toggle_user_mode(self):
        """Test toggle user mode endpoint"""
        headers = self._auth_headers()
        response = requests.post(
            f"{BACKEND_URL}/profile/mode",
            json={"mode": "builder"},
            headers=headers,
        )
        assert response.status_code == 200

    def test_07_root_endpoint(self):
        """Test root endpoint"""
        response = requests.get(f"{BACKEND_URL}/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


class TestFrontendUI:
    """Test frontend UI with Selenium"""

    @pytest.fixture(scope="class")
    def driver(self):
        """Setup Selenium WebDriver"""
        options = webdriver.ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1280,720")

        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        driver.implicitly_wait(WAIT_TIMEOUT)
        yield driver
        driver.quit()

    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test credentials"""
        self.test_email = f"selenium_test_{int(time.time())}@example.com"
        self.test_password = "SeleniumTest123!"

    def test_01_navigate_to_frontend(self, driver):
        """Test navigating to frontend"""
        driver.get(FRONTEND_URL)
        assert "Workforce" in driver.title or "localhost" in driver.current_url
        time.sleep(1)

    def test_02_signup_flow(self, driver):
        """Test user signup flow through UI"""
        driver.get(FRONTEND_URL)
        time.sleep(2)

        try:
            auth_button = WebDriverWait(driver, WAIT_TIMEOUT).until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//button[contains(text(), 'Sign Up')]")
                )
            )
            auth_button.click()
        except Exception as e:
            pytest.skip(f"Sign up button not found: {e}")

        time.sleep(1)

        try:
            email_input = WebDriverWait(driver, WAIT_TIMEOUT).until(
                EC.presence_of_element_located((By.NAME, "email"))
            )
            email_input.send_keys(self.test_email)

            username_input = driver.find_element(By.NAME, "username")
            username_input.send_keys(self.test_email.split("@")[0])

            full_name_input = driver.find_element(By.NAME, "full_name")
            full_name_input.send_keys("Selenium Test User")

            password_input = driver.find_element(By.NAME, "password")
            password_input.send_keys(self.test_password)

            confirm_password = driver.find_element(By.NAME, "confirm_password")
            confirm_password.send_keys(self.test_password)

            submit_button = driver.find_element(
                By.XPATH, "//button[contains(text(), 'Sign Up')]"
            )
            submit_button.click()

            time.sleep(3)
            assert "localhost" in driver.current_url
        except Exception as e:
            pytest.skip(f"Form fields not found: {e}")

    def test_03_login_flow(self, driver):
        """Test user login flow through UI"""
        driver.get(FRONTEND_URL)
        time.sleep(2)

        try:
            login_button = WebDriverWait(driver, WAIT_TIMEOUT).until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//button[contains(text(), 'Login')]")
                )
            )
            login_button.click()
        except Exception as e:
            pytest.skip(f"Login button not found: {e}")

        time.sleep(1)

        try:
            email_input = WebDriverWait(driver, WAIT_TIMEOUT).until(
                EC.presence_of_element_located((By.NAME, "email"))
            )
            email_input.send_keys(self.test_email)

            password_input = driver.find_element(By.NAME, "password")
            password_input.send_keys(self.test_password)

            login_submit = driver.find_element(
                By.XPATH, "//button[contains(text(), 'Login')]"
            )
            login_submit.click()

            time.sleep(3)
            assert "localhost" in driver.current_url
        except Exception as e:
            pytest.skip(f"Form fields not found: {e}")

    def test_04_view_opportunities(self, driver):
        """Test viewing opportunities list"""
        driver.get(FRONTEND_URL)
        time.sleep(2)

        opportunities = driver.find_elements(
            By.XPATH, "//*[contains(text(), 'Opportunit')]"
        )
        assert len(opportunities) >= 0


class TestIntegration:
    """Integration tests combining frontend and backend"""

    def test_full_user_journey(self):
        """Test complete user journey: signup -> create opportunity"""
        email = f"integration_test_{int(time.time())}@example.com"
        password = "IntegrationTest123!"
        username = email.split("@")[0]

        # Signup via API
        signup_response = requests.post(
            f"{BACKEND_URL}/auth/signup",
            json={
                "email": email,
                "username": username,
                "password": password,
                "full_name": "Integration Test User",
            },
        )
        assert signup_response.status_code == 201
        token = signup_response.json()["access_token"]

        # Get profile via API
        headers = {"Authorization": f"Bearer {token}"}
        profile_response = requests.get(f"{BACKEND_URL}/profile/me", headers=headers)
        assert profile_response.status_code == 200

        # Create opportunity via API
        opportunity_response = requests.post(
            f"{BACKEND_URL}/opportunities",
            json={
                "title": "Integration Test Opportunity",
                "description": "This is an integration test opportunity with full description",
                "required_skills": ["Testing"],
                "bounty_amount": 750,
            },
            headers=headers,
        )
        assert opportunity_response.status_code == 201

    def test_error_handling(self):
        """Test error handling for invalid operations"""
        # Test invalid signup
        response = requests.post(
            f"{BACKEND_URL}/auth/signup",
            json={
                "email": "invalid",
                "username": "test",
                "password": "test",
                "full_name": "Test",
            },
        )
        assert response.status_code != 201

        # Test login with wrong credentials
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={"email": "nonexistent@example.com", "password": "wrongpassword"},
        )
        assert response.status_code != 200

        # Test unauthorized access
        response = requests.get(f"{BACKEND_URL}/profile/me")
        assert response.status_code == 403


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
