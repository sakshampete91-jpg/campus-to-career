# GitHub Setup & Publishing Guide — Campus to Career

This guide explains how to initialize, configure, and publish `campus-to-career` to GitHub with automated CI/CD workflows and secure secret scanning.

---

## 1. Prerequisites

- **Git** (version 2.30+ recommended)
- **GitHub CLI (`gh`)** or **GitHub Desktop**
- An authenticated GitHub account
- Python 3.10+ (for backend validation)
- Node.js 18+ and npm (for frontend build)

---

## 2. Automated Scripts (Windows PowerShell)

We provide two pre-configured PowerShell scripts in the `scripts/` directory:

### A. Pre-flight Setup & Check (`scripts/setup-github.ps1`)
Inspects the repository, validates `.gitignore`, scans for private resumes or secrets, and prepares the workspace.

```powershell
# Run pre-flight check in dry-run mode (safe)
.\scripts\setup-github.ps1

# Run with execution flag
.\scripts\setup-github.ps1 -Execute
```

### B. Safe GitHub Publishing (`scripts/publish-github.ps1`)
Safely creates the remote repository using the GitHub CLI or guides you through standard remote attachment, performing pre-commit secret scans and verifying staged files.

```powershell
# Preview what would be published (Dry Run)
.\scripts\publish-github.ps1 -DryRun

# Publish repository (requires explicit confirmation prompt)
.\scripts\publish-github.ps1
```

---

## 3. Manual Publishing Flow (Step-by-Step)

If you prefer to configure manually:

### Step 1: Initialize Git
```bash
git init
git branch -M main
```

### Step 2: Verify `.gitignore`
Ensure `.gitignore` contains:
```
# Resumes and uploads
uploads/
resumes/
*.pdf
*.docx

# Environment and secrets
.env
.env.local
campus_to_career.db

# Dependencies
node_modules/
.next/
__pycache__/
*.pyc
```

### Step 3: Add Remote
```bash
# Create repository via GitHub CLI
gh repo create campus-to-career --public --source=. --remote=origin

# OR manually add remote
git remote add origin https://github.com/<your-username>/campus-to-career.git
```

### Step 4: Initial Commit & Push
```bash
git add .
git commit -m "feat: initial release of Campus to Career open-source career platform"
git push -u origin main
```

---

## 4. Branch Protection Rules

For team collaboration on `main`:
1. Go to **Settings** > **Branches** > **Add rule**.
2. Branch name pattern: `main`.
3. Check:
   - **Require a pull request before merging**
   - **Require status checks to pass before merging** (select `CI / backend-test` and `CI / frontend-test`)
4. Save changes.
