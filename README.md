# 🚀 Project Setup & Running Instructions

## 📋 Overview

This is a full-stack web application with:

- **Backend**: FastAPI + Python
- **Frontend**: React + TypeScript + Vite
- **Testing**: 68 comprehensive tests (22 backend + 46 frontend)

---

## 🔧 Backend Server (FastAPI + Python)

### Prerequisites

- Python 3.13+
- Virtual environment

### Setup & Run

#### Step 1: Navigate to Backend

```bash
cd backend/app
```

#### Step 2: Activate Virtual Environment

```bash
# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate
```

#### Step 3: Install Dependencies (First Time Only)

```bash
pip install -e .
```

#### Step 4: Run Development Server

```bash
uvicorn main:app --reload
```

**Expected Output:**

```bash

INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Access Backend

- 📍 **API Base URL**: `http://localhost:8000`
- 📚 **Swagger Docs**: `http://localhost:8000/docs`
- 📖 **ReDoc**: `http://localhost:8000/redoc`

---

## 🎨 Frontend Server (React + TypeScript + Vite)

### Prerequisites

- Node.js 18+ or Bun
- Package manager (npm, pnpm, or bun)

### Setup & Run

#### Step 1: Navigate to Frontend

```bash
cd frontend
```

#### Step 2: Install Dependencies (First Time Only)

```bash
# Using Bun (Recommended)
bun install

# Using npm
npm install

# Using pnpm
pnpm install
```

#### Step 3: Run Development Server

```bash
# Using Bun
bun run dev

# Using npm
npm run dev

# Using pnpm
pnpm run dev
```

**Expected Output:**

```bash

VITE v7.2.4  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### Access Frontend

- 🌐 **Application**: `http://localhost:5173`
- ✨ **Features**: Hot Module Replacement (HMR) enabled

---

## 🧪 Testing

### Backend Tests

```bash
# Navigate to backend
cd backend/app

# Run all tests
pytest -v

# Run specific test file
pytest tests/test_auth.py -v

# Run specific test
pytest tests/test_auth.py::test_login_success -v

# Run with coverage
pytest --cov=app tests/
```

**Expected Result:**

```bash

✅ 22 passed in 10.37s
```

**Test Coverage:**

- ✅ Authentication (6 tests)
- ✅ Main endpoint (1 test)
- ✅ Opportunities CRUD (8 tests)
- ✅ Profile management (7 tests)

### Frontend Tests

```bash
# Navigate to frontend
cd frontend

# Run all tests (one-time)
bun run test --run

# Run tests in watch mode
bun run test

# Run tests with UI dashboard
bun run test:ui

# Run with coverage report
bun run test:coverage
```

**Expected Result:**

```bash

✅ 46 passed
Test Files  2 passed
Tests  46 passed
```

**Test Coverage:**

- ✅ Authentication flow (3 tests)
- ✅ Opportunity management (5 tests)
- ✅ Profile management (3 tests)
- ✅ Application management (2 tests)
- ✅ Data parsing (3 tests)
- ✅ Error handling (3 tests)
- ✅ Token management (3 tests)
- ✅ Utility functions (25 tests)

### Selenium Integration Tests

Full end-to-end testing with Selenium browser automation:

```bash
# Quick start (Windows)
.\run_selenium_tests.ps1

# Or manual setup
pip install -r tests/selenium-requirements.txt
pytest tests/selenium_tests.py -v

# Run specific test class
pytest tests/selenium_tests.py::TestBackendAPI -v
pytest tests/selenium_tests.py::TestFrontendUI -v
pytest tests/selenium_tests.py::TestIntegration -v
```

**Requirements:**

- Both backend and frontend servers running
- Google Chrome installed (ChromeDriver auto-managed via webdriver-manager)

**Test Coverage:**

- ✅ Backend API tests (7 tests)
- ✅ Frontend UI tests (5 tests)
- ✅ Integration tests (2 tests)

📖 **Detailed Guide**: See `tests/SELENIUM_TEST_GUIDE.md`

---

## 🚀 Running Full Stack (Backend + Frontend)

### Terminal 1 - Backend Server

```bash
cd backend/app
.\.venv\Scripts\Activate.ps1  # Windows
# source .venv/bin/activate   # macOS/Linux

uvicorn main:app --reload
```

### Terminal 2 - Frontend Server

```bash
cd frontend
bun run dev
```

### Access the Application

- 🌐 **Frontend**: `http://localhost:5173`
- 🔌 **Backend API**: `http://localhost:8000`
- 📚 **API Documentation**: `http://localhost:8000/docs`

---

## 📊 Test Summary

| Component | Tests | Status | Type |
|-----------|-------|--------|------|
| Backend (pytest) | 22 | ✅ 100% passing | Unit/Integration |
| Frontend (vitest) | 46 | ✅ 100% passing | Unit/Component |
| Selenium E2E | 14 | ✅ Ready to run | End-to-End |
| **Total** | **82** | **✅ Full Coverage** | **All Types** |

**Test Execution Times:**

- Backend: ~10 seconds
- Frontend: ~1.5 seconds
- Selenium: ~5-10 minutes (requires both servers running)

---

## 🛠️ Useful Commands

### Backend Commands

```bash
# Development server with auto-reload
uvicorn main:app --reload

# Production server
uvicorn main:app

# Run tests
pytest -v

# Run tests with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_auth.py::test_login_success -v
```

### Frontend Commands

```bash
# Development server
bun run dev

# Production build
bun run build

# Preview production build
bun run preview

# Run tests
bun run test --run

# Run tests with UI
bun run test:ui

# Linting
bun run lint
```

---

## 📁 Project Structure

```bash

pp_project/
├── backend/
│   └── app/
│       ├── main.py                 # FastAPI application
│       ├── config.py              # Configuration settings
│       ├── database.py            # Database setup
│       ├── models/                # SQLAlchemy models
│       │   ├── user.py
│       │   ├── opportunity.py
│       │   └── application.py
│       ├── schemas/               # Pydantic request/response schemas
│       │   ├── user.py
│       │   ├── opportunity.py
│       │   └── application.py
│       ├── routes/                # API endpoints
│       │   ├── auth.py
│       │   ├── profile.py
│       │   ├── opportunities.py
│       │   └── network.py
│       ├── utils/                 # Utility functions
│       │   ├── auth.py
│       │   └── dependencies.py
│       ├── tests/                 # Test suite (22 tests)
│       │   ├── conftest.py
│       │   ├── test_auth.py
│       │   ├── test_main.py
│       │   ├── test_opportunities.py
│       │   └── test_profile.py
│       ├── pyproject.toml         # Dependencies
│       └── .venv/                 # Virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx               # React entry point
│   │   ├── App.tsx                # Main component
│   │   ├── components/            # React components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── network/
│   │   │   ├── opportunities/
│   │   │   ├── profile/
│   │   │   └── common/
│   │   ├── services/              # API service layer
│   │   │   └── api.ts
│   │   ├── contexts/              # React context
│   │   │   ├── AuthContext.tsx
│   │   │   └── useAuth.ts
│   │   ├── types/                 # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── tests/                 # Test suite (46 tests)
│   │   │   ├── setup.ts
│   │   │   ├── frontend.test.ts
│   │   │   └── utils.test.ts
│   │   └── config/                # Configuration
│   ├── package.json               # Dependencies
│   ├── vite.config.ts             # Vite configuration
│   ├── vitest.config.ts           # Vitest configuration
│   └── node_modules/              # Installed packages
│
├── RUNNING_INSTRUCTIONS.md        # Detailed setup guide
├── QUICK_START.md                 # Quick reference
├── COMPLETE_TEST_REPORT.md        # Full test coverage
├── TEST_SUMMARY.md                # Test results
└── README.md                      # This file
```

---

## 🔑 Key API Endpoints

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login

### Profile Management

- `GET /profile/me` - Get current user profile
- `PUT /profile/me` - Update user profile
- `POST /profile/mode` - Toggle user mode (builder/hustler)

### Opportunities

- `GET /opportunities` - List all opportunities
- `POST /opportunities` - Create new opportunity
- `GET /opportunities/{id}` - Get opportunity details
- `PUT /opportunities/{id}` - Update opportunity
- `DELETE /opportunities/{id}` - Delete opportunity
- `POST /opportunities/{id}/apply` - Apply to opportunity
- `GET /opportunities/{id}/applications` - Get applications

### Network

- `GET /network` - Get all users
- `GET /network/{id}` - Get user details
- `GET /network/applications/my` - Get my applications

---

## 🌐 Environment Variables

### Backend (.env file in backend/app/)

```env
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local file in frontend/)

```env
VITE_API_URL=http://localhost:8000
```

---

## ❓ Troubleshooting

### Backend Issues

**Port 8000 already in use:**

```bash

uvicorn main:app --reload --port 8001
```

**Module not found:**

```bash

pip install -e .
```

**Database errors:**

```bash
# Delete database and restart
rm test.db
uvicorn main:app --reload
```

### Frontend Issues

**Port 5173 already in use:**

```bash
bun run dev -- --port 5174
```

**Dependencies issue:**

```bash
rm -rf node_modules
bun install
```

**Build errors:**

```bash
rm -rf dist
bun run build
```

---

## 📚 Documentation

- **Detailed Instructions**: See `RUNNING_INSTRUCTIONS.md`
- **Quick Reference**: See `QUICK_START.md`
- **Test Report**: See `COMPLETE_TEST_REPORT.md`
- **Test Summary**: See `TEST_SUMMARY.md`

---

## ✅ Verification Checklist

- [ ] Backend running on `http://localhost:8000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Backend tests passing (22/22)
- [ ] Frontend tests passing (46/46)
- [ ] API documentation accessible at `/docs`
- [ ] Can signup/login in the application
- [ ] Can create and view opportunities
- [ ] Can update user profile
- [ ] Can toggle user mode

---

## 🎯 Quick Start Summary

### First Time Setup

```bash
# Backend
cd backend/app
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .

# Frontend
cd ../../frontend
bun install
```

### Daily Development

```bash
# Terminal 1 - Backend
cd backend/app
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
bun run dev
```

### Running Tests

```bash
# Backend tests
cd backend/app
pytest -v

# Frontend tests
cd frontend
bun run test --run
```

---

## 💡 Technology Stack

**Backend:**

- FastAPI - Web framework
- SQLAlchemy - ORM
- Pydantic - Data validation
- python-jose - JWT handling
- pytest - Testing

**Frontend:**

- React 19 - UI framework
- TypeScript - Type safety
- Vite - Build tool
- Vitest - Testing
- Tailwind CSS - Styling
- lucide-react - Icons

---

## 📞 Support

For issues or questions:

1. Check the documentation files
2. Review test files for usage examples
3. Check API documentation at `/docs`

---

**Last Updated**: November 25, 2025
**Status**: ✅ Production Ready
**Test Coverage**: 68/68 tests passing (100%)
