#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Selenium Test Suite - Setup and Execution Script
.DESCRIPTION
    Installs dependencies and runs Selenium tests for the full-stack application
.EXAMPLE
    .\run_selenium_tests.ps1
#>

# Colors for output
$Green = 'Green'
$Yellow = 'Yellow'
$Red = 'Red'
$Cyan = 'Cyan'

Write-Host "`n╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor $Green
Write-Host "║          SELENIUM TEST SUITE - SETUP AND EXECUTION               ║" -ForegroundColor $Green
Write-Host "╚════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor $Green

# Check if running from correct directory
if (-not (Test-Path "tests/selenium_tests.py")) {
    Write-Host "❌ Error: selenium_tests.py not found. Please run from project root." -ForegroundColor $Red
    Write-Host "   Expected: d:\program_file\project\pp_project" -ForegroundColor $Red
    exit 1
}

# Step 1: Check Python
Write-Host "[1/4] Checking Python installation..." -ForegroundColor $Cyan
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Python not found. Please install Python 3.13+" -ForegroundColor $Red
    exit 1
}
Write-Host "✓ $pythonVersion" -ForegroundColor $Green

# Step 2: Install dependencies
Write-Host "`n[2/4] Installing Selenium dependencies..." -ForegroundColor $Cyan
pip install -q -r tests/selenium-requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to install dependencies" -ForegroundColor $Red
    exit 1
}
Write-Host "✓ Dependencies installed successfully" -ForegroundColor $Green

# Step 3: Check for services
Write-Host "`n[3/4] Checking for required services..." -ForegroundColor $Cyan
Write-Host "`n⚠ IMPORTANT: Make sure both servers are running in separate terminals:" -ForegroundColor $Yellow
Write-Host "   Terminal 1: cd backend && python -m uvicorn app.main:app --reload" -ForegroundColor $Cyan
Write-Host "   Terminal 2: cd frontend && bun dev" -ForegroundColor $Cyan
Write-Host "`nPress any key to continue when both servers are running..." -ForegroundColor $Yellow
[Console]::ReadKey($true) | Out-Null

# Step 4: Run tests
Write-Host "`n[4/4] Running Selenium tests..." -ForegroundColor $Cyan
Write-Host "`n" -ForegroundColor $Green

pytest tests/selenium_tests.py -v --tb=short
$testResult = $LASTEXITCODE

if ($testResult -eq 0) {
    Write-Host "`n╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor $Green
    Write-Host "║                   ✓ ALL TESTS PASSED!                            ║" -ForegroundColor $Green
    Write-Host "╚════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor $Green
} else {
    Write-Host "`n╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor $Red
    Write-Host "║                   ✗ SOME TESTS FAILED                            ║" -ForegroundColor $Red
    Write-Host "║                   See output above for details                    ║" -ForegroundColor $Red
    Write-Host "╚════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor $Red
}

exit $testResult
