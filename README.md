# Campus to Career

> **From Skills to Opportunities.**

[![CI](https://github.com/sakshampete91-jpg/campus-to-career/actions/workflows/ci.yml/badge.svg)](https://github.com/sakshampete91-jpg/campus-to-career/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Ollama: Gemma 2](https://img.shields.io/badge/AI-Google_Gemma_2_(2B)-emerald.svg)](https://ollama.com/library/gemma2)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-orange.svg)](https://hacktoberfest.com/)

**Campus to Career** is an open-source, AI-powered career platform that connects students with legitimate internship and job opportunities — anywhere, from any college. It uses a locally-running open-weight AI model (**Google Gemma 2 via Ollama**) to tailor resumes, flag suspicious listings, and match students to roles based on skills — with zero subscription fees, zero cloud data leakage, and full transparency.

---

## 📸 Screenshots

> _Screenshots will be added after the UI is fully built. Contributions welcome!_

<!-- Add screenshots here after the UI is complete:
![Landing Page](docs/screenshots/landing.png)
![Marketplace](docs/screenshots/marketplace.png)
![TrustCheck](docs/screenshots/trustcheck.png)
![Resume Tailor](docs/screenshots/resume-tailor.png)
-->

---

## 🏆 Hackathon Context

This project was built for **Hacktoberfest 2026** in the **Best Open-Source AI Project** category.

- ✅ Fully open-source (MIT License)
- ✅ AI powered by an open-weight model (Google Gemma 2: 2B parameters)
- ✅ Locally-running AI — no API keys, no cloud AI costs
- ✅ Student-focused, no college/institutional lock-in
- ✅ End-to-end tested with CI/CD

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Skills-Based Marketplace** | Students list their skills; opportunities surface based on skill match — no GPA gatekeeping. |
| 2 | **TrustCheck™** | AI-powered scan of internship/job listings to detect red flags (fee requests, vague role descriptions, suspicious contact info). ⚠️ Provisional — see disclaimer below. |
| 3 | **Resume Tailor** | Upload a resume (PDF/DOCX), select a target role, and get an AI-tailored version — downloadable as PDF. |
| 4 | **Application Tracker** | Kanban-style board to track applications from Applied → Interview → Offer → Rejected. |
| 5 | **Employer Dashboard** | Verified employers post listings and browse skill-matched candidate profiles. |
| 6 | **Offline-First AI** | All AI inference runs locally via Ollama — no data leaves your machine, no cloud AI costs. |

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS | UI and server-side rendering |
| **UI Components** | shadcn/ui, Radix UI | Accessible component library |
| **Backend** | FastAPI (Python 3.11), Uvicorn | REST API server |
| **ORM** | SQLAlchemy 2.0, Alembic | Database access and migrations |
| **Database** | SQLite (dev) / PostgreSQL (prod-ready) | Persistent data storage |
| **AI Runtime** | [Ollama](https://ollama.com/) | Local LLM inference server |
| **AI Model** | `gemma2:2b` (Google Gemma 2) | Resume tailoring, TrustCheck contextual analysis |
| **Authentication** | JWT (python-jose), bcrypt | Stateless auth tokens |
| **PDF Generation** | WeasyPrint | Tailored resume PDF export |
| **Testing (BE)** | pytest, pytest-cov, httpx | Backend unit + integration tests |
| **Testing (FE)** | Vitest, Testing Library | Frontend component tests |
| **E2E Testing** | Playwright | End-to-end browser tests |
| **CI/CD** | GitHub Actions | Automated test and build pipeline |

---

## 🤖 AI Model Information

Campus to Career uses **Google Gemma 2 (2B parameters)** running locally via **Ollama**.

- **Model tag:** `gemma2:2b`
- **Provider:** [Google DeepMind / Ollama](https://ollama.com/library/gemma2)
- **License:** [Gemma Terms of Use](https://ai.google.dev/gemma/terms) (Open-weight permissive license)
- **Why local?** All inference happens locally on the host machine. Student resumes and sensitive career queries never leave the device.
- **Hardware:** Extremely lightweight (~1.6 GB VRAM/RAM required). Fast on standard CPUs and modern laptops.

> [!NOTE]
> `gemma2:2b` is lightweight and fast for hackathon evaluation. The platform also seamlessly detects and supports `gemma:2b` or larger models by updating `OLLAMA_MODEL` in `.env`.

---

## 🚀 Quick Start (Windows)

### Prerequisites

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 20+](https://nodejs.org/)
- [Git](https://git-scm.com/downloads)
- [Ollama](https://ollama.com/download) (for AI features)

### Step 1 — Clone the Repository

```powershell
git clone https://github.com/your-org/campus-to-career.git
cd campus-to-career
```

### Step 2 — Set Up Environment Variables

```powershell
Copy-Item .env.example .env
# Open .env in your editor and review/adjust values
notepad .env
```

### Step 3 — Set Up the Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

> [!TIP]
> If you see a script execution policy error, run:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Step 4 — Set Up the Frontend

Open a **new** PowerShell terminal:

```powershell
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:3000**

### Step 5 — Pull the AI Model (for TrustCheck & Resume Tailor)

Open a **new** PowerShell terminal:

```powershell
ollama pull llama3.2:1b
ollama serve
```

Ollama will listen on `http://localhost:11434` by default.

### Step 6 — Verify Everything Is Running

| Service | URL | Expected |
|---------|-----|----------|
| Frontend | http://localhost:3000 | Landing page |
| Backend API | http://localhost:8000/docs | Swagger UI |
| Ollama | http://localhost:11434 | `{"status":"ok"}` |

---

## 📁 Project Structure

```
campus-to-career/
├── frontend/               # Next.js 14 App Router
│   ├── app/                # Route segments
│   ├── components/         # Shared UI components
│   ├── lib/                # API client, utilities
│   └── public/             # Static assets
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── api/v1/         # Route handlers
│   │   ├── core/           # Config, security, AI client
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   └── services/       # Business logic layer
│   ├── alembic/            # Database migrations
│   └── tests/              # pytest test suite
├── docs/                   # Project documentation
│   ├── ARCHITECTURE.md
│   ├── TESTING.md
│   ├── DEMO_SCRIPT.md
│   ├── TEAM_WORKFLOW.md
│   └── GITHUB_SETUP.md
├── scripts/                # Developer utility scripts
│   ├── setup-github.ps1
│   └── publish-github.ps1
├── .github/
│   ├── workflows/ci.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── .env.example
├── .gitignore
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── SECURITY.md
```

---

## 👥 Team Structure

| Role | Responsibility |
|------|----------------|
| **Frontend Developer** | Next.js UI, component library, responsive design |
| **Backend Developer** | FastAPI routes, database models, authentication |
| **AI / TrustCheck Engineer** | Ollama integration, prompt engineering, TrustCheck pipeline |
| **Resume & DevOps Engineer** | Resume tailor pipeline, PDF generation, CI/CD, documentation |

---

## 🤝 Contributing

We welcome contributions from students, developers, and anyone passionate about fair career access!

Please read our [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) before submitting a pull request.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

## ⚠️ Disclaimer

**TrustCheck™ is a provisional AI-assisted tool.** It is designed to surface potential red flags in job/internship listings based on common scam patterns. It does **not** constitute legal advice, employment law guidance, or a guarantee that any listing is safe or legitimate. Always exercise independent judgment and consult appropriate authorities if you suspect fraud.

The AI model (Meta Llama 3.2) may produce inaccurate or incomplete outputs. Campus to Career contributors are not liable for decisions made based on AI-generated content.
