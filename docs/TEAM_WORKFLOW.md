# Four-Person Team Collaboration Workflow

Campus to Career is architected for collaborative development by a four-person engineering team using GitHub and GitHub Desktop.

---

## 1. Team Ownership & Responsibilities

| Role | Primary Ownership | Key Deliverables |
|------|-------------------|------------------|
| **Teammate 1 — Frontend & UX** | `frontend/src/app/`, `frontend/src/components/` | Design system, landing page, responsive layouts, dashboard, accessibility |
| **Teammate 2 — Backend & Database** | `backend/app/api/`, `backend/app/models/`, `backend/app/core/` | FastAPI routers, SQLAlchemy ORM, authentication, migrations, role-based authorization |
| **Teammate 3 — AI & TrustCheck** | `backend/app/services/trustcheck/`, `backend/app/services/ai/` | Deterministic risk scoring, SSRF safeguards, Ollama integration, fraud signals |
| **Teammate 4 — Resume Tailor & Integration** | `backend/app/services/resume/`, `frontend/src/app/resume/` | Resume parsing, gap analysis, ReportLab PDF generation, ATS verification |

---

## 2. Git Branching Strategy

All production and submission code lives on `main`. Work is done on dedicated feature branches:

```
main (Production / Hackathon Submission)
 │
 ├── feat/frontend    (Teammate 1: UI components & page workflows)
 ├── feat/backend     (Teammate 2: Database schemas, auth & CRUD APIs)
 ├── feat/trustcheck  (Teammate 3: Risk scoring, URL validation, Ollama AI)
 └── feat/resume      (Teammate 4: Parser, PDF generator, ATS tailoring)
```

---

## 3. GitHub Desktop Step-by-Step Guide

### Step 1: Repository Owner Setup
1. The repository owner publishes the repository: `https://github.com/<owner>/campus-to-career`.
2. Go to **Settings** > **Collaborators** > **Add People**.
3. Enter the GitHub usernames of the three teammates and send invitations.
4. Each teammate accepts the email or GitHub notification invite.

### Step 2: Clone with GitHub Desktop
1. Open **GitHub Desktop**.
2. Click **File** > **Clone Repository...**
3. Select `campus-to-career` from your repositories list (or paste the URL).
4. Choose your local folder: e.g., `C:\Projects\campus-to-career`.
5. Click **Clone**.

### Step 3: Daily Team Workflow
1. **Pull latest changes:** Click **Fetch origin** and ensure your local `main` is up to date.
2. **Switch to your branch:** Click the **Current Branch** dropdown and select or create your branch (e.g. `feat/trustcheck`).
3. **Make code changes:** Work in your editor. Keep documentation integrity and adhere to the project branding rules.
4. **Run tests:**
   - Backend tests: `pytest backend/tests`
   - Frontend verification: `npm run build`
5. **Commit cleanly:** Enter a concise summary (e.g. `feat(trustcheck): add domain mismatch heuristic`) and click **Commit to feat/...**.
6. **Push to GitHub:** Click **Push origin**.
7. **Open a Pull Request:** Click **Create Pull Request** in GitHub Desktop to open the PR on GitHub.
8. **Peer Review:** At least one teammate reviews the code, checks tests pass, and approves the PR before merging into `main`.

---

## 4. Conflict Resolution Protocol

If two teammates modify the same file:
1. Switch to `main` and pull latest changes: `git pull origin main`.
2. Switch back to your feature branch: `git checkout feat/<your-feature>`.
3. Merge `main` into your feature branch: `git merge main`.
4. Open the conflicting files in VS Code, inspect the conflicting sections, and pick the desired changes.
5. Re-run automated tests to confirm everything still passes.
6. Commit the merge and push to origin.

---

## 5. Security & Privacy Rules for Team Members
- **Never commit `.env` or API credentials.**
- **Never commit actual resumes or personal documents.**
- **Never include university names or specific geographic affiliations.**
- **Always use synthetic demo data for examples and tests.**
