# Contributing to Campus to Career

Welcome, and thank you for taking the time to contribute! 🎉

**Campus to Career** is an open-source, student-first career platform. Whether you're fixing a typo, adding a test, or building a feature — every contribution matters. This guide will walk you through everything you need to get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Report Bugs](#how-to-report-bugs)
- [How to Suggest Features](#how-to-suggest-features)
- [Development Setup (Windows)](#development-setup-windows)
- [Branch Strategy](#branch-strategy)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Commit Message Format](#commit-message-format)

---

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct v2.1](./CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards. Please read it before contributing.

Report unacceptable behavior to the maintainers through GitHub's private security advisory or by emailing the team lead listed in the repository.

---

## 🐛 How to Report Bugs

1. **Search existing issues** at [GitHub Issues](https://github.com/your-org/campus-to-career/issues) to avoid duplicates.
2. If no existing issue matches, click **New Issue** and select the **Bug Report** template.
3. Fill in all sections of the template:
   - Clear description of the bug
   - Exact steps to reproduce it
   - Expected vs. actual behavior
   - Your environment (OS, Python version, Node version, browser)
   - Screenshots or logs if available
4. Add relevant labels (e.g., `bug`, `frontend`, `backend`, `ai`).
5. Submit — a maintainer will triage it within 48 hours.

> [!IMPORTANT]
> Do **not** include real personal data, API keys, or credentials in bug reports.

---

## 💡 How to Suggest Features

1. **Search existing issues** labeled `enhancement` to see if your idea already exists.
2. If not, open a **New Issue** and choose the **Feature Request** template.
3. Describe:
   - The problem your feature solves
   - Your proposed solution
   - Alternatives you considered
   - Any mockups or examples
4. Label the issue `enhancement` and `discussion`.
5. Wait for maintainer feedback before starting implementation — this prevents duplicate effort.

---

## 🛠 Development Setup (Windows)

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Git | Latest | https://git-scm.com/downloads |
| Python | 3.11+ | https://www.python.org/downloads/ |
| Node.js | 20+ | https://nodejs.org/ |
| Ollama | Latest | https://ollama.com/download |
| GitHub Desktop | Latest (optional) | https://desktop.github.com/ |

### 1. Fork and Clone

```powershell
# Fork on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/campus-to-career.git
cd campus-to-career

# Add the upstream remote
git remote add upstream https://github.com/your-org/campus-to-career.git
```

### 2. Environment Variables

```powershell
Copy-Item .env.example .env
# Edit .env with your preferred editor — do NOT commit .env
notepad .env
```

### 3. Backend Setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install -r requirements-dev.txt   # dev/test dependencies
alembic upgrade head
```

> [!TIP]
> If you see an execution policy error, run:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### 4. Frontend Setup

```powershell
cd frontend
npm install
```

### 5. Pull the AI Model

```powershell
ollama pull llama3.2:1b
```

### 6. Verify the Setup

```powershell
# Terminal 1 — Ollama
ollama serve

# Terminal 2 — Backend
cd backend && .\venv\Scripts\Activate.ps1 && uvicorn app.main:app --reload

# Terminal 3 — Frontend
cd frontend && npm run dev
```

Visit http://localhost:3000 — if the landing page loads, you're good!

---

## 🌿 Branch Strategy

| Branch | Purpose | Protected? |
|--------|---------|------------|
| `main` | Stable, production-ready code | ✅ Yes — PRs only |
| `feat/frontend` | Frontend feature development | ❌ No |
| `feat/backend` | Backend API development | ❌ No |
| `feat/trustcheck` | TrustCheck AI pipeline | ❌ No |
| `feat/resume` | Resume tailor & PDF export | ❌ No |

**Workflow:**

```
main
 └── feat/backend
      └── feat/backend-auth-jwt        ← your personal feature branch
```

Always branch off the relevant `feat/` branch (or `main` for cross-cutting concerns). Never commit directly to `main`.

```powershell
# Sync with upstream first
git fetch upstream
git checkout feat/backend
git merge upstream/feat/backend

# Create your feature branch
git checkout -b feat/backend-add-skill-endpoint
```

---

## 🔁 Pull Request Process

1. **Ensure your branch is up to date** with its parent branch before opening a PR.
2. **Run all tests locally** — the CI must pass. See [Testing Requirements](#testing-requirements).
3. **Open a PR** using the [PR template](./.github/pull_request_template.md).
4. **Link the relevant issue** in the PR description (e.g., `Closes #42`).
5. **Request a review** from at least one teammate.
6. **Address review comments** — push additional commits to the same branch.
7. Once approved, the **repository owner** merges using **Squash and Merge** to keep history clean.
8. Delete your branch after merging.

> [!WARNING]
> PRs without tests, or that break existing tests, will not be merged until fixed.

---

## 🎨 Coding Standards

### Python (Backend)

- Follow **PEP 8**. Use `black` for formatting: `black app/`
- Use `isort` for import ordering: `isort app/`
- Use `flake8` for linting: `flake8 app/`
- Type-hint all function signatures.
- Write docstrings for all public functions and classes (Google style).
- Keep functions small and single-purpose (≤ 40 lines as a guideline).

```python
# Good
async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Retrieve a user record by email address.

    Args:
        db: Active async database session.
        email: Email address to search for.

    Returns:
        User ORM object if found, else None.
    """
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()
```

### TypeScript (Frontend)

- Use **strict TypeScript** (`"strict": true` in tsconfig).
- Use `eslint` and `prettier` — run `npm run lint` before committing.
- Prefer named exports over default exports for components.
- Use `interface` for object shapes, `type` for unions/aliases.
- Keep components small — extract hooks and helpers when logic grows.
- All new UI components must be accessible (ARIA attributes, keyboard nav).

### General

- No `console.log` or `print()` left in committed code (use proper logging).
- No hardcoded credentials, URLs, or secrets.
- Comment the *why*, not the *what*.

---

## ✅ Testing Requirements

All PRs **must** maintain or improve test coverage.

### Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pytest --cov=app --cov-report=term-missing
```

Minimum coverage: **70%** overall, **90%** for service layer.

### Frontend

```powershell
cd frontend
npm run test
npm run type-check
```

### End-to-End

```powershell
cd frontend
npx playwright test
```

See [docs/TESTING.md](./docs/TESTING.md) for full details.

---

## 📝 Commit Message Format

We use **Conventional Commits** (https://www.conventionalcommits.org/).

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Use for |
|------|---------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code restructure without feature/fix |
| `test` | Adding or fixing tests |
| `chore` | Build process, dependency updates, tooling |
| `ci` | CI/CD pipeline changes |

### Scope (optional but encouraged)

`frontend`, `backend`, `trustcheck`, `resume`, `auth`, `db`, `docs`, `ci`

### Examples

```
feat(backend): add skill-based opportunity matching endpoint

fix(frontend): resolve hydration error on marketplace page

test(trustcheck): add unit tests for red-flag pattern detection

docs: update CONTRIBUTING.md with branch strategy

chore(deps): upgrade FastAPI to 0.115.0
```

> [!NOTE]
> Breaking changes must include `BREAKING CHANGE:` in the footer and a `!` after the type:
> `feat(auth)!: replace session tokens with JWT`
