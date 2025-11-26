# Selenium Integration Tests - Setup & Usage Guide

## Overview

This test suite provides comprehensive end-to-end testing for the full-stack application using Selenium for browser automation. It includes:

- **Backend API Tests**: Direct testing of FastAPI endpoints
- **Frontend UI Tests**: Browser-based testing with Selenium
- **Integration Tests**: Full user journey testing combining frontend and backend

## Prerequisites

### 1. Install Selenium WebDriver

```powershell
# Install selenium package
pip install selenium
```

### 2. Ensure Google Chrome is Installed

The test suite now uses [`webdriver-manager`](https://pypi.org/project/webdriver-manager/) to download and manage the correct ChromeDriver automatically. You no longer need to download the driver manually.

- Verify that Google Chrome is installed and updated on the machine running the tests.
- When tests start, webdriver-manager fetches the matching driver and caches it under your user profile.

> **Offline or Restricted Environments:** If outbound downloads are blocked, you can still download `chromedriver.exe` manually and set the `WEBDRIVER_MANAGER_CACHE` environment variable to the folder containing the binary.

## Test Structure

### TestBackendAPI (7 tests)

Tests the FastAPI backend endpoints:

- `test_01_user_signup`: Test user registration
- `test_02_user_login`: Test user login
- `test_03_get_profile`: Test profile retrieval
- `test_04_create_opportunity`: Test opportunity creation
- `test_05_get_opportunities`: Test listing opportunities
- `test_06_toggle_user_mode`: Test mode switching
- `test_07_root_endpoint`: Test health check

### TestFrontendUI (5 tests)

Tests the React frontend with browser automation:

- `test_01_navigate_to_frontend`: Test page loading
- `test_02_signup_flow`: Test signup form in browser
- `test_03_login_flow`: Test login form in browser
- `test_04_view_opportunities`: Test opportunities page
- Uses Selenium WebDriver with Chrome

### TestIntegration (2 tests)

Integration tests combining frontend and backend:

- `test_full_user_journey`: Complete signup → profile → opportunity flow
- `test_error_handling`: Test error scenarios (invalid signup, wrong password, unauthorized)

## Running the Tests

### Prerequisites: Start Both Servers First

**Terminal 1 - Start Backend:**

```powershell
cd backend
python -m uvicorn app.main:app --reload
# Backend will run on http://localhost:8000
```

**Terminal 2 - Start Frontend:**

```powershell
cd frontend
bun dev
# Frontend will run on http://localhost:5173
```

### Run All Tests

```powershell
# Navigate to project root
cd d:\program_file\project\pp_project

# Run all selenium tests
pytest tests/selenium_tests.py -v

# Run with detailed output
pytest tests/selenium_tests.py -v --tb=short
```

### Run Specific Test Classes

```powershell
# Run only backend API tests
pytest tests/selenium_tests.py::TestBackendAPI -v

# Run only frontend UI tests
pytest tests/selenium_tests.py::TestFrontendUI -v

# Run only integration tests
pytest tests/selenium_tests.py::TestIntegration -v
```

### Run Specific Tests

```powershell
# Run single test
pytest tests/selenium_tests.py::TestBackendAPI::test_01_user_signup -v

# Run multiple specific tests
pytest tests/selenium_tests.py::TestBackendAPI::test_01_user_signup tests/selenium_tests.py::TestBackendAPI::test_02_user_login -v
```

### Run with Coverage

```powershell
# Install coverage tool
pip install pytest-cov

# Run tests with coverage
pytest tests/selenium_tests.py --cov --cov-report=html

# Open coverage report
start htmlcov/index.html
```

## Test Execution Flow

### Backend API Tests Flow

1. Create unique test user (timestamp-based email)
2. Test each endpoint sequentially
3. Use JWT tokens for authenticated requests
4. Verify response status codes and data

### Frontend UI Tests Flow

1. Launch Chrome browser via Selenium
2. Navigate to frontend URL
3. Interact with UI elements (click buttons, fill forms)
4. Verify page state and navigation
5. Close browser after test

### Integration Tests Flow

1. Create user via API
2. Verify profile retrieval
3. Create opportunity via API
4. Verify opportunity appears in list
5. Test error scenarios

## Configuration

All test configuration is at the top of `selenium_tests.py`:

```python
BACKEND_URL = "http://localhost:8000"      # Backend API URL
FRONTEND_URL = "http://localhost:5173"     # Frontend app URL
WAIT_TIMEOUT = 10                          # Selenium wait timeout (seconds)
```

Modify these if your servers run on different ports.

## Test Data

Tests use dynamically generated test data:

- Email addresses include timestamps to ensure uniqueness
- Test passwords: `TestPassword123!`, `SeleniumTest123!`, `IntegrationTest123!`
- Test names: Generic identifiers like "Test User", "Selenium Test User"

Each test run creates new users, so no cleanup is needed.

## Troubleshooting

### Chrome WebDriver Issues

**Error: `chromedriver` not found**

```powershell
# Download and place chromedriver in project root, or
# Add to PATH environment variable
$env:PATH += ";C:\path\to\chromedriver"
```

### **Error: Chrome version mismatch**

- Download ChromeDriver version matching your Chrome browser
- Open Chrome: `chrome://version/` to find your version
- Download matching driver from chromedriver.chromium.org

### Frontend Test Failures

**"Element not found" errors:**

- Ensure frontend is running on <http://localhost:5173>
- Check that DOM element selectors match your UI
- Update selectors in test methods if UI changes

**Timeout errors:**

- Increase `WAIT_TIMEOUT` if frontend is slow
- Check browser console for JavaScript errors
- Verify network requests complete successfully

### Backend Test Failures

**401 Unauthorized errors:**

- Ensure backend is running on <http://localhost:8000>
- Check that JWT secret is consistent
- Verify token is properly extracted and sent

**422 Validation errors:**

- Check opportunity descriptions meet minimum 20 character requirement
- Verify all required fields are provided
- Check server console for detailed validation errors

## Best Practices

1. **Run servers first** - Always start both backend and frontend before tests
2. **Use unique test data** - Tests generate unique emails with timestamps
3. **Check logs** - Review server console output for errors
4. **Run incrementally** - Test individual classes before running full suite
5. **Handle waits** - Selenium waits handle asynchronous operations
6. **Inspect selectors** - Use browser DevTools to verify element selectors

## Advanced Usage

### Run with Headless Chrome (No UI)

```python
# Modify TestFrontendUI.driver fixture to use headless mode
from selenium.webdriver.chrome.options import Options

def driver(self):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()
```

### Run with Screenshots on Failure

```python
# Add to test methods
import os
from datetime import datetime

def take_screenshot(driver):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"screenshot_{timestamp}.png"
    driver.save_screenshot(filename)
    print(f"Screenshot saved: {filename}")

# In exception handlers
except Exception as e:
    take_screenshot(driver)
    raise
```

### Run Tests in Parallel

```powershell
# Install pytest-xdist
pip install pytest-xdist

# Run tests in parallel (4 workers)
pytest tests/selenium_tests.py -n 4
```

## CI/CD Integration

For continuous integration pipelines (GitHub Actions, Jenkins, etc.):

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: |
    pip install selenium pytest pytest-cov requests

- name: Start backend
  run: python -m uvicorn app.main:app &
  working-directory: ./backend

- name: Start frontend
  run: bun dev &
  working-directory: ./frontend

- name: Run selenium tests
  run: pytest tests/selenium_tests.py -v --tb=short
```

## Test Reports

Generate detailed test reports:

```powershell
# HTML report
pytest tests/selenium_tests.py -v --html=report.html --self-contained-html

# JUnit XML (for CI/CD integration)
pytest tests/selenium_tests.py -v --junit-xml=test-results.xml

# JSON report
pytest tests/selenium_tests.py -v --json-report --json-report-file=report.json
```

## Performance Considerations

- Backend API tests run quickly (~1-2 seconds per test)
- Frontend UI tests run slower due to browser automation (5-10 seconds per test)
- Use `TestIntegration` tests for quick validation of full workflows
- Consider running UI tests separately from API tests for faster feedback

## Notes

- All tests are independent and can run in any order
- Selenium tests include wait strategies to handle asynchronous operations
- Tests use realistic user workflows (signup → login → create opportunities)
- Frontend tests are resilient to minor UI selector changes
- Integration tests validate the complete end-to-end flow

## Support

For issues or questions:

1. Check server logs for detailed error messages
2. Review browser console in Selenium window
3. Verify all prerequisites are installed correctly
4. Check BACKEND_URL and FRONTEND_URL configuration
5. Review test output with `-v` flag for verbose details
