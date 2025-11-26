@echo off
REM Selenium Test Setup and Run Script
REM This script installs dependencies and runs Selenium tests

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║          SELENIUM TEST SUITE - SETUP AND EXECUTION               ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

REM Check if running from correct directory
if not exist "tests\selenium_tests.py" (
    echo Error: selenium_tests.py not found. Please run from project root.
    echo Expected: d:\program_file\project\pp_project
    exit /b 1
)

echo [1/4] Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo Error: Python not found. Please install Python 3.13+
    exit /b 1
)

echo.
echo [2/4] Installing Selenium dependencies...
pip install -q -r tests/selenium-requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    exit /b 1
)

echo ✓ Dependencies installed successfully

echo.
echo [3/4] Checking for required services...
echo.
echo ⚠ IMPORTANT: Make sure both servers are running in separate terminals:
echo   Terminal 1: cd backend && python -m uvicorn app.main:app --reload
echo   Terminal 2: cd frontend && bun dev
echo.
echo Press any key to continue when both servers are running...
pause >nul

echo.
echo [4/4] Running Selenium tests...
echo.

REM Run tests with verbose output
pytest tests/selenium_tests.py -v --tb=short

if %errorlevel% equ 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════════════╗
    echo ║                   ✓ ALL TESTS PASSED!                            ║
    echo ╚════════════════════════════════════════════════════════════════════╝
) else (
    echo.
    echo ╔════════════════════════════════════════════════════════════════════╗
    echo ║                   ✗ SOME TESTS FAILED                            ║
    echo ║                   See output above for details                    ║
    echo ╚════════════════════════════════════════════════════════════════════╝
)

exit /b %errorlevel%
