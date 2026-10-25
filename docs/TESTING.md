# Testing Guide — Campus to Career

> This document describes the complete testing strategy for Campus to Career, covering backend, frontend, and end-to-end tests.

---

## Table of Contents

1. [Test Strategy Overview](#1-test-strategy-overview)
2. [Backend Tests (pytest)](#2-backend-tests-pytest)
3. [Frontend Tests (Vitest)](#3-frontend-tests-vitest)
4. [End-to-End Tests (Playwright)](#4-end-to-end-tests-playwright)
5. [Test Categories and Coverage](#5-test-categories-and-coverage)
6. [Synthetic Test Data](#6-synthetic-test-data)
7. [CI/CD Testing Pipeline](#7-cicd-testing-pipeline)
8. [How to Add New Tests](#8-how-to-add-new-tests)
9. [Known Limitations](#9-known-limitations)

---

## 1. Test Strategy Overview

Campus to Career follows a **layered testing approach**:

```
           ┌──────────────────────┐
           │   E2E (Playwright)    │  ← Full browser flows (critical paths only)
           └──────────┬───────────┘
                      │ ~10 tests
           ┌──────────┴───────────┐
           │  Integration Tests    │  ← API endpoints with test DB
           └──────────┬───────────┘
                      │ ~30 tests
           ┌──────────┴───────────┐
           │    Unit Tests         │  ← Services, utilities, components
           └──────────────────────┘
                 ~80 tests
```

**Testing philosophy:**
- Unit tests are fast and isolated — no real DB, no real Ollama calls (mocked)
- Integration tests use a real SQLite in-memory database but mock Ollama
- E2E tests run against a full local stack with Ollama mocked at the HTTP level
- AI responses in tests always use mocked/deterministic outputs — never real LLM calls

---

## 2. Backend Tests (pytest)

### Setup

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
```

`requirements-dev.txt` includes:
```
pytest==8.x
pytest-asyncio==0.23.x
pytest-cov==5.x
httpx==0.27.x          # async test client for FastAPI
respx==0.21.x          # mock httpx calls (for Ollama)
factory-boy==3.3.x     # test data factories
```

### Running Tests

```powershell
# Run all backend tests
pytest

# With coverage report (terminal)
pytest --cov=app --cov-report=term-missing

# With HTML coverage report
pytest --cov=app --cov-report=html
# Open: backend/htmlcov/index.html

# Run only a specific test file
pytest tests/test_trustcheck.py

# Run only tests matching a keyword
pytest -k "trustcheck"

# Run tests with verbose output
pytest -v

# Run tests and stop at first failure
pytest -x
```

### Test Structure

```
backend/tests/
├── conftest.py                ← Shared fixtures (app, async DB, auth tokens)
├── factories.py               ← factory-boy model factories
├── test_auth.py               ← Registration, login, token refresh
├── test_users.py              ← Profile CRUD, skills update
├── test_opportunities.py      ← Listing CRUD, skill-match filtering
├── test_trustcheck.py         ← TrustCheck scan, rule engine, LLM mock
├── test_resume.py             ← Upload, tailor (mocked LLM), download
├── test_applications.py       ← Apply, status updates, tracker
└── services/
    ├── test_trustcheck_service.py   ← Unit tests for scoring logic
    ├── test_resume_service.py       ← Unit tests for PDF generation
    └── test_opportunity_service.py  ← Unit tests for match scoring
```

### Key Fixtures (`conftest.py`)

```python
@pytest.fixture
async def db():
    """In-memory SQLite database, fresh for each test."""

@pytest.fixture
async def client(db):
    """Async httpx client with overridden DB dependency."""

@pytest.fixture
def student_token(client):
    """Pre-issued JWT for a test student user."""

@pytest.fixture
def employer_token(client):
    """Pre-issued JWT for a test employer user."""

@pytest.fixture
def mock_ollama(respx_mock):
    """Intercepts all httpx calls to localhost:11434 and returns canned responses."""
```

### Coverage Targets

| Module | Target |
|--------|--------|
| `services/` | ≥ 90% |
| `api/v1/` | ≥ 80% |
| `core/` | ≥ 75% |
| Overall | ≥ 70% |

CI will fail if overall coverage drops below **70%**.

---

## 3. Frontend Tests (Vitest)

### Setup

```powershell
cd frontend
npm install
```

Dev dependencies (in `package.json`):
```json
{
  "vitest": "^1.x",
  "@testing-library/react": "^16.x",
  "@testing-library/user-event": "^14.x",
  "@vitejs/plugin-react": "^4.x",
  "jsdom": "^24.x",
  "msw": "^2.x"
}
```

### Running Tests

```powershell
# Run all frontend tests
npm run test

# Watch mode (re-runs on file save)
npm run test:watch

# With coverage
npm run test:coverage

# TypeScript type check (no compilation output)
npm run type-check

# ESLint
npm run lint
```

### Test Structure

```
frontend/
├── vitest.config.ts           ← Vitest configuration
├── tests/
│   ├── setup.ts               ← Global test setup (jsdom, MSW server)
│   ├── mocks/
│   │   └── api-handlers.ts    ← MSW API mock handlers
│   ├── components/
│   │   ├── OpportunityCard.test.tsx
│   │   ├── TrustCheckForm.test.tsx
│   │   ├── ResumeUpload.test.tsx
│   │   ├── KanbanBoard.test.tsx
│   │   └── SkillFilter.test.tsx
│   ├── lib/
│   │   ├── api.test.ts        ← API client tests
│   │   └── auth.test.ts       ← Token handling tests
│   └── pages/
│       ├── marketplace.test.tsx
│       └── trustcheck.test.tsx
```

### What is Tested

- **Component rendering** — correct DOM structure given props
- **User interactions** — click, type, submit via `userEvent`
- **API integration** — components respond correctly to mocked API responses
- **Error states** — components handle API errors gracefully
- **Loading states** — skeleton/spinner shown during fetch
- **Accessibility** — `getByRole`, `getByLabelText` ensure semantic HTML

### MSW Handlers

Mock Service Worker intercepts all `fetch` calls in test environment:

```typescript
// tests/mocks/api-handlers.ts
export const handlers = [
  http.get('/api/v1/opportunities', () =>
    HttpResponse.json({ items: [mockOpportunity], total: 1 })
  ),
  http.post('/api/v1/trustcheck/scan', () =>
    HttpResponse.json(mockTrustCheckResult)
  ),
  // ...
]
```

---

## 4. End-to-End Tests (Playwright)

### Setup

```powershell
cd frontend
npx playwright install --with-deps chromium
```

> [!IMPORTANT]
> E2E tests require the full local stack to be running:
> - Backend on `http://localhost:8000`
> - Frontend on `http://localhost:3000`
> - Ollama mocked via a local HTTP mock server (provided by `scripts/mock-ollama.js`)

### Running E2E Tests

```powershell
# Run all E2E tests (headless)
npx playwright test

# Run with browser visible
npx playwright test --headed

# Run specific test file
npx playwright test tests/e2e/trustcheck.spec.ts

# Show HTML report
npx playwright show-report
```

### Test Structure

```
frontend/tests/e2e/
├── fixtures.ts                ← Shared page objects, test helpers
├── auth.spec.ts               ← Registration, login, logout flows
├── marketplace.spec.ts        ← Browse, filter by skill, view listing
├── trustcheck.spec.ts         ← Paste listing → scan → see result
├── resume.spec.ts             ← Upload → tailor → preview → download
└── tracker.spec.ts            ← Apply, move card through kanban
```

### Critical Paths Covered

| Path | Test File |
|------|-----------|
| Student can register and log in | `auth.spec.ts` |
| Student can filter opportunities by skill | `marketplace.spec.ts` |
| TrustCheck returns HIGH risk for fee-request text | `trustcheck.spec.ts` |
| Resume upload triggers tailoring, PDF downloadable | `resume.spec.ts` |
| Application status moves through kanban stages | `tracker.spec.ts` |

---

## 5. Test Categories and Coverage

| Category | Framework | What It Covers |
|----------|-----------|----------------|
| Auth unit | pytest | Password hashing, JWT creation/validation |
| Auth integration | pytest + httpx | Register, login, refresh, unauthorized access |
| Opportunity unit | pytest | Skill overlap scoring algorithm |
| Opportunity integration | pytest + httpx | CRUD, pagination, skill-based filtering |
| TrustCheck unit | pytest | Rule engine keyword detection, scoring weights |
| TrustCheck integration | pytest + respx | Full scan endpoint with mocked Ollama |
| Resume unit | pytest | Text extraction, prompt building, PDF rendering |
| Resume integration | pytest + httpx | Upload → tailor → download flow |
| Component rendering | Vitest + RTL | Every UI component in isolation |
| API client | Vitest | Error handling, token injection, retry logic |
| Critical paths | Playwright | Registration, marketplace, TrustCheck, resume |

---

## 6. Synthetic Test Data

All test data is **synthetic** — no real people, companies, or locations.

### Student Profiles

```python
# factories.py
class UserFactory(factory.Factory):
    class Meta:
        model = User
    email = factory.Sequence(lambda n: f"student{n}@testmail.example")
    full_name = factory.Sequence(lambda n: f"Test Student {n}")
    role = "student"
    skills = ["Python", "Machine Learning"]
```

### Opportunity Listings

```python
class OpportunityFactory(factory.Factory):
    title = factory.Iterator([
        "Junior AI Developer Intern",
        "Frontend Web Developer",
        "Data Analyst Trainee",
    ])
    description = "Synthetic listing for testing purposes only."
    required_skills = ["Python", "SQL"]
    stipend = 15000
    location_type = "remote"
```

### TrustCheck Test Inputs

| Scenario | Input text snippet | Expected result |
|----------|-------------------|-----------------|
| Legitimate listing | "Apply via careers portal, no fees" | `LOW` risk |
| Fee request scam | "Pay ₹500 registration fee to proceed" | `HIGH` risk |
| Vague role | "Work from home, earn unlimited, WhatsApp us" | `HIGH` risk |
| Borderline listing | "Unpaid internship, learn skills" | `MEDIUM` risk |

---

## 7. CI/CD Testing Pipeline

See [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) for the full workflow.

```
Push / PR
    │
    ├── backend-test job
    │   ├── Set up Python 3.11
    │   ├── pip install -r requirements.txt -r requirements-dev.txt
    │   ├── pytest --cov=app --cov-report=xml
    │   └── Upload coverage to CI artifacts
    │
    ├── frontend-test job
    │   ├── Set up Node 20
    │   ├── npm ci
    │   ├── npm run lint
    │   ├── npm run type-check
    │   └── npm run test -- --coverage
    │
    └── build-check job (needs both above)
        ├── npm run build
        └── Report build size
```

> [!NOTE]
> E2E (Playwright) tests are not run in CI by default (require running services). They can be enabled by adding a `playwright-test` job with service containers.

---

## 8. How to Add New Tests

### Adding a Backend Unit Test

1. Create (or edit) a file in `backend/tests/services/test_<feature>_service.py`.
2. Import the service function and any required models.
3. Use `pytest.mark.asyncio` for async functions.
4. Mock external dependencies (DB, Ollama) using fixtures from `conftest.py`.

```python
# backend/tests/services/test_opportunity_service.py
import pytest
from app.services.opportunity_service import compute_match_score

def test_match_score_perfect_overlap():
    user_skills = {"Python", "ML", "SQL"}
    required_skills = {"Python", "ML"}
    score = compute_match_score(user_skills, required_skills)
    assert score == 100.0

def test_match_score_no_overlap():
    score = compute_match_score({"Java"}, {"Python"})
    assert score == 0.0
```

### Adding a Frontend Component Test

1. Create `frontend/tests/components/<ComponentName>.test.tsx`.
2. Import the component and render with `@testing-library/react`.
3. Assert on DOM output and user interactions.

```typescript
// frontend/tests/components/ResultBadge.test.tsx
import { render, screen } from '@testing-library/react'
import { ResultBadge } from '@/components/trustcheck/ResultBadge'

test('renders HIGH risk badge with correct styles', () => {
  render(<ResultBadge riskLevel="HIGH" />)
  expect(screen.getByText('HIGH RISK')).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveClass('bg-red-500')
})
```

### Adding an E2E Test

1. Create `frontend/tests/e2e/<feature>.spec.ts`.
2. Use Playwright's page fixtures.
3. Keep tests atomic — each test should set up its own state.

```typescript
// frontend/tests/e2e/trustcheck.spec.ts
test('flags fee-request listing as HIGH risk', async ({ page }) => {
  await page.goto('/trustcheck')
  await page.fill('[data-testid="listing-input"]',
    'Pay ₹500 registration fee to proceed with your application.')
  await page.click('[data-testid="scan-button"]')
  await expect(page.getByText('HIGH RISK')).toBeVisible({ timeout: 10000 })
})
```

---

## 9. Known Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| Ollama is mocked in all automated tests | AI quality not tested automatically | Manual QA with real model |
| SQLite in tests, PostgreSQL in production | Some SQL dialects may behave differently | Run full integration suite against PG in staging |
| E2E tests not in CI by default | Critical path regressions may slip through | Run E2E manually before merges to `main` |
| PDF rendering (WeasyPrint) not tested end-to-end | Layout regressions possible | Visual regression testing planned |
| No load/performance tests | Unknown behavior under concurrent users | Add `locust` tests before production deployment |
| TrustCheck accuracy not measurable with fixed mocks | Prompt changes may degrade quality silently | Maintain a golden dataset of labeled listings for manual eval |
