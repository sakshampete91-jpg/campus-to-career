# Architecture — Campus to Career

> **From Skills to Opportunities.**

This document describes the complete technical architecture of the Campus to Career platform, including system topology, component design, data flows, and AI integration patterns.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Schema Summary](#4-database-schema-summary)
5. [AI Integration Architecture](#5-ai-integration-architecture)
6. [TrustCheck Pipeline](#6-trustcheck-pipeline)
7. [Resume Tailor Pipeline](#7-resume-tailor-pipeline)
8. [Security Architecture](#8-security-architecture)
9. [Data Flow Diagrams](#9-data-flow-diagrams)
10. [API Contract Summary](#10-api-contract-summary)

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER'S MACHINE (Dev / Single-Host)           │
│                                                                     │
│   ┌─────────────────┐       ┌─────────────────┐                    │
│   │   Browser        │       │   Ollama Server  │                   │
│   │  localhost:3000  │       │  localhost:11434  │                  │
│   └────────┬────────┘       └────────▲─────────┘                   │
│            │ HTTP/REST                │ HTTP (internal)              │
│            ▼                          │                              │
│   ┌─────────────────┐       ┌─────────────────┐                    │
│   │  Next.js 14     │       │   FastAPI        │                    │
│   │  App Router     │──────▶│   localhost:8000 │                   │
│   │  (TypeScript)   │       │   (Python 3.11)  │                   │
│   └─────────────────┘       └────────┬─────────┘                   │
│                                       │ SQLAlchemy 2.0              │
│                                       ▼                              │
│                              ┌─────────────────┐                   │
│                              │   SQLite / PG    │                   │
│                              │   campus_to_     │                   │
│                              │   career.db      │                   │
│                              └─────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **Monorepo layout** — `frontend/` and `backend/` in one repository, deployed independently.
- **Local-first AI** — Ollama runs on the same host; no data leaves the machine for inference.
- **SQLite for development** — zero-configuration database; swap URL for PostgreSQL in production.
- **Stateless API** — JWT tokens enable horizontal scaling of the backend without session storage.

---

## 2. Frontend Architecture

### Technology

| Concern | Solution |
|---------|----------|
| Framework | Next.js 14 with App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (Radix UI primitives) |
| State management | React Context + SWR for server state |
| Forms | React Hook Form + Zod validation |
| PDF viewer | `react-pdf` |
| HTTP client | `fetch` (native) wrapped in `lib/api.ts` |

### Component Hierarchy

```
app/
├── layout.tsx                  ← Root layout (font, providers)
├── page.tsx                    ← Landing page
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (student)/
│   ├── dashboard/page.tsx      ← Student home
│   ├── profile/page.tsx        ← Skills, bio, education
│   ├── marketplace/page.tsx    ← Opportunity listings
│   ├── trustcheck/page.tsx     ← TrustCheck scan UI
│   ├── resume/
│   │   ├── upload/page.tsx     ← Upload + tailor form
│   │   └── preview/page.tsx    ← PDF preview + download
│   └── tracker/page.tsx        ← Application kanban board
└── (employer)/
    ├── dashboard/page.tsx      ← Employer home
    ├── post/page.tsx           ← Post new listing
    └── candidates/page.tsx     ← Browse skill-matched students

components/
├── ui/                         ← shadcn/ui primitives (Button, Card, etc.)
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── marketplace/
│   ├── OpportunityCard.tsx
│   ├── SkillFilter.tsx
│   └── MatchScore.tsx
├── trustcheck/
│   ├── ScanForm.tsx
│   ├── ResultBadge.tsx
│   └── FlagList.tsx
├── resume/
│   ├── UploadDropzone.tsx
│   ├── TailorForm.tsx
│   └── PreviewPanel.tsx
└── tracker/
    ├── KanbanBoard.tsx
    └── ApplicationCard.tsx

lib/
├── api.ts                      ← Typed API client (wraps fetch)
├── auth.ts                     ← JWT storage, token refresh logic
└── utils.ts                    ← Shared helpers
```

### Routing Strategy

- **App Router** with React Server Components for data-fetching routes.
- Client components (`"use client"`) only where interactivity is required.
- Route groups `(auth)`, `(student)`, `(employer)` for layout isolation.
- Middleware (`middleware.ts`) guards protected routes using JWT presence in cookies.

---

## 3. Backend Architecture

### Technology

| Concern | Solution |
|---------|----------|
| Framework | FastAPI 0.115+ |
| Language | Python 3.11 |
| ORM | SQLAlchemy 2.0 (async) |
| Migrations | Alembic |
| Validation | Pydantic v2 |
| Auth | python-jose (JWT), passlib/bcrypt |
| HTTP client | httpx (async, for Ollama calls) |
| PDF generation | WeasyPrint |
| Server | Uvicorn (ASGI) |

### Application Layout

```
backend/app/
├── main.py                     ← FastAPI app factory, middleware, router mount
├── core/
│   ├── config.py               ← Settings (Pydantic BaseSettings, reads .env)
│   ├── security.py             ← JWT creation/verification, password hashing
│   ├── database.py             ← Async SQLAlchemy engine, session factory
│   └── ollama_client.py        ← Async Ollama HTTP client with fallback
├── api/
│   └── v1/
│       ├── router.py           ← Aggregate all v1 routes
│       ├── auth.py             ← /auth/register, /auth/login, /auth/refresh
│       ├── users.py            ← /users/me, /users/{id}
│       ├── opportunities.py    ← /opportunities CRUD + skill match
│       ├── trustcheck.py       ← /trustcheck/scan
│       ├── resume.py           ← /resume/upload, /resume/tailor, /resume/download
│       └── applications.py     ← /applications CRUD
├── models/                     ← SQLAlchemy ORM models
│   ├── user.py
│   ├── opportunity.py
│   ├── resume.py
│   └── application.py
├── schemas/                    ← Pydantic request/response schemas
│   ├── auth.py
│   ├── user.py
│   ├── opportunity.py
│   ├── trustcheck.py
│   └── resume.py
└── services/                   ← Business logic (no ORM imports here)
    ├── auth_service.py
    ├── opportunity_service.py
    ├── trustcheck_service.py
    └── resume_service.py
```

### Service Layer Pattern

```
Route Handler → Dependency Injection → Service → ORM Model → Database
                       ↓
                  Ollama Client (AI features only)
```

Route handlers are thin — they validate input (Pydantic), call a service function, and return a schema. All business logic lives in `services/`.

---

## 4. Database Schema Summary

```
┌──────────────┐        ┌───────────────────┐
│    users     │        │   opportunities   │
├──────────────┤        ├───────────────────┤
│ id (PK)      │        │ id (PK)           │
│ email        │        │ title             │
│ hashed_pw    │        │ description       │
│ role         │        │ employer_id (FK)  │
│ full_name    │        │ required_skills[] │
│ skills[]     │        │ location_type     │
│ bio          │        │ stipend           │
│ created_at   │        │ is_verified       │
└──────┬───────┘        │ created_at        │
       │                └────────┬──────────┘
       │                         │
       │         ┌───────────────┘
       │         │
       ▼         ▼
┌─────────────────────┐   ┌──────────────────┐
│    applications     │   │     resumes      │
├─────────────────────┤   ├──────────────────┤
│ id (PK)             │   │ id (PK)          │
│ student_id (FK)     │   │ student_id (FK)  │
│ opportunity_id (FK) │   │ original_path    │
│ status              │   │ tailored_path    │
│ applied_at          │   │ target_role      │
│ notes               │   │ ai_suggestions   │
└─────────────────────┘   │ created_at       │
                           └──────────────────┘
```

**Status values for `applications.status`:**
`applied` → `shortlisted` → `interview` → `offer` | `rejected`

---

## 5. AI Integration Architecture

### Ollama Client

All AI calls go through `core/ollama_client.py`:

```python
class OllamaClient:
    base_url: str          # from OLLAMA_BASE_URL env var
    model: str             # from OLLAMA_MODEL env var (gemma2:2b)
    timeout: int = 60      # seconds

    async def generate(self, prompt: str) -> str: ...
    async def health_check(self) -> bool: ...
```

### Fallback Strategy

```
Request arrives
      │
      ▼
Is Ollama reachable?
  ├─ YES → Send prompt → Parse response → Return result
  └─ NO  → Log warning → Return rule-based fallback
              (TrustCheck: keyword scan only)
              (Resume: return original text with note)
```

The fallback ensures the platform remains functional even if Ollama is not running, with degraded AI features instead of total failure.

### Prompt Engineering

Prompts are stored as templates in `core/prompts/`:

```
prompts/
├── trustcheck_system.txt       ← System prompt for TrustCheck
├── trustcheck_user.txt         ← User prompt template (injects listing text)
├── resume_tailor_system.txt    ← System prompt for resume tailoring
└── resume_tailor_user.txt      ← User prompt template (injects resume + role)
```

---

## 6. TrustCheck Pipeline

```
User pastes listing text
         │
         ▼
┌─────────────────────┐
│  Input Sanitization  │  ← Strip HTML, limit to 4000 chars
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Rule-Based Pre-scan │  ← Fast keyword checks (always runs)
│  - Fee requests      │    "registration fee", "deposit",
│  - Vague contact     │    "WhatsApp only", no company email
│  - Too-good claims   │    "earn ₹X/hr guaranteed"
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Ollama LLM Scan     │  ← Contextual understanding
│  (Google Gemma 2)    │    Detects nuanced red flags
│                      │    Returns structured JSON
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Score Aggregation   │  ← Combine rule + LLM signals
│  Risk: LOW/MED/HIGH  │    Weighted scoring
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Response Schema     │  ← risk_level, flags[], explanation
└─────────────────────┘
```

**Output schema:**
```json
{
  "risk_level": "HIGH",
  "confidence": 0.87,
  "flags": [
    {"code": "FEE_REQUEST", "description": "Listing requests a registration fee", "severity": "HIGH"},
    {"code": "VAGUE_ROLE", "description": "Role responsibilities are undefined", "severity": "MEDIUM"}
  ],
  "explanation": "This listing exhibits multiple high-risk patterns...",
  "disclaimer": "TrustCheck is provisional. This is not legal advice."
}
```

---

## 7. Resume Tailor Pipeline

```
User uploads PDF/DOCX + selects target role
              │
              ▼
┌──────────────────────────┐
│  File Validation          │  ← MIME type, size ≤ 10 MB, extension check
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Text Extraction          │  ← PyMuPDF (PDF) / python-docx (DOCX)
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Prompt Construction      │  ← Inject resume text + target role into template
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Ollama LLM Tailoring     │  ← Google Gemma 2 (gemma2:2b) generates tailored content
│                           │    (reorders, emphasizes, adds keywords)
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  HTML Template Render     │  ← Jinja2 template with branded styling
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  PDF Generation           │  ← WeasyPrint renders HTML → PDF
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Storage + Response       │  ← Saved to uploads/, URL returned to frontend
└──────────────────────────┘
```

---

## 8. Security Architecture

```
Browser
   │
   │ HTTPS (TLS in production)
   ▼
Next.js Middleware
   │ JWT cookie check → redirect if invalid
   ▼
FastAPI
   │ CORS middleware (allowlist only)
   │ Rate limiter (slowapi) — login, TrustCheck endpoints
   ▼
Route Handler
   │ Pydantic validation (reject malformed input)
   │ OAuth2PasswordBearer dependency (validates JWT)
   ▼
Service Layer
   │ No raw SQL — SQLAlchemy ORM only
   │ File uploads: MIME + extension whitelist
   ▼
Database (SQLite / PostgreSQL)
```

**JWT Flow:**
1. Login → server issues `access_token` (30 min) + `refresh_token` (7 days)
2. Client stores tokens in **httpOnly cookies** (not localStorage)
3. Every API request sends `access_token` in `Authorization: Bearer` header
4. On 401, client uses `refresh_token` to get a new `access_token` silently
5. Logout clears both cookies server-side

---

## 9. Data Flow Diagrams

### Student Registration Flow

```
Browser → POST /auth/register → Validate email uniqueness
                               → Hash password (bcrypt)
                               → Insert User row
                               → Issue JWT pair
                               → Return tokens
```

### Opportunity Match Flow

```
Browser → GET /opportunities?skills=python,ml
        → Parse skills query param
        → SQL: SELECT where required_skills && user_skills
        → Score by overlap count (0–100%)
        → Sort descending by match score
        → Paginate (page, page_size)
        → Return OpportunityList schema
```

### TrustCheck Flow

```
Browser → POST /trustcheck/scan {listing_text}
        → Rule-based scan (sync, fast)
        → Ollama POST /api/generate (async, up to 60s)
        → Merge results + compute risk_level
        → Return TrustCheckResult schema
```

---

## 10. API Contract Summary

Base URL: `http://localhost:8000/api/v1`

Full interactive docs at: `http://localhost:8000/docs` (Swagger UI)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register student or employer |
| `POST` | `/auth/login` | ❌ | Login, receive JWT pair |
| `POST` | `/auth/refresh` | 🔑 Refresh token | Refresh access token |
| `GET` | `/users/me` | 🔑 JWT | Get current user profile |
| `PATCH` | `/users/me` | 🔑 JWT | Update profile / skills |
| `GET` | `/opportunities` | ❌ | List opportunities (filterable by skills) |
| `POST` | `/opportunities` | 🔑 Employer | Create new listing |
| `GET` | `/opportunities/{id}` | ❌ | Get single listing |
| `PATCH` | `/opportunities/{id}` | 🔑 Owner | Update listing |
| `DELETE` | `/opportunities/{id}` | 🔑 Owner | Delete listing |
| `POST` | `/trustcheck/scan` | 🔑 JWT | Run TrustCheck on listing text |
| `POST` | `/resume/upload` | 🔑 Student | Upload resume file |
| `POST` | `/resume/tailor` | 🔑 Student | Tailor resume for a role (AI) |
| `GET` | `/resume/download/{id}` | 🔑 Owner | Download tailored PDF |
| `GET` | `/applications` | 🔑 Student | List student's applications |
| `POST` | `/applications` | 🔑 Student | Apply to an opportunity |
| `PATCH` | `/applications/{id}` | 🔑 Student | Update application status/notes |
| `GET` | `/health` | ❌ | Health check (API + DB + Ollama status) |

**Common response codes:**
- `200 OK` — Success
- `201 Created` — Resource created
- `400 Bad Request` — Validation error
- `401 Unauthorized` — Missing or invalid JWT
- `403 Forbidden` — Authenticated but not authorized
- `404 Not Found` — Resource does not exist
- `422 Unprocessable Entity` — Pydantic schema mismatch
- `503 Service Unavailable` — Ollama unreachable (AI endpoints only)
