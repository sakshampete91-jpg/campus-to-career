# Security Policy

## Supported Versions

The following versions of Campus to Career currently receive security updates:

| Version | Supported |
|---------|-----------|
| `main` (latest) | ✅ Active |
| Any tagged release ≥ 1.0.0 | ✅ Supported |
| Pre-release / development branches | ❌ Not supported |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub Issues.**

We use GitHub's **Private Security Advisory** feature to handle all vulnerability reports confidentially.

### How to Report

1. Navigate to the repository on GitHub.
2. Click the **Security** tab.
3. Click **Report a vulnerability** (under "Advisories").
4. Fill in the advisory form with:
   - A clear description of the vulnerability
   - Steps to reproduce
   - Potential impact (data exposure, authentication bypass, etc.)
   - Suggested fix (if you have one)
5. Submit — maintainers will acknowledge within **72 hours**.

### What to Expect

| Timeline | Action |
|----------|--------|
| ≤ 72 hours | Acknowledgement of your report |
| ≤ 7 days | Initial assessment and severity classification |
| ≤ 30 days | Fix developed and tested |
| After fix ships | Public disclosure (CVE requested if applicable) |

We follow responsible disclosure. We will credit reporters in release notes unless they prefer to remain anonymous.

---

## ⚠️ Known Limitations

### TrustCheck™ — Provisional AI Tool

> [!CAUTION]
> TrustCheck is an **AI-assisted heuristic tool** and has significant known limitations:

- It is **not a legal service** and does not constitute employment law advice.
- The underlying AI model (`llama3.2:1b`) can produce **false positives** (flagging legitimate listings) and **false negatives** (missing actual scams).
- TrustCheck does **not** verify employer identity, business registration, or legal compliance.
- Results should be treated as **preliminary signals only**. Users must exercise their own judgment and consult appropriate authorities if fraud is suspected.
- Pattern detection is based on training data cutoffs and may not catch novel scam techniques.

### General AI Limitations

- The AI model runs locally and may produce inaccurate, outdated, or biased outputs.
- Resume tailoring suggestions are AI-generated and should be reviewed by the user before use.
- No AI output from this platform should be relied upon as professional advice (legal, financial, career, or otherwise).

---

## 🔒 Security Features Implemented

| Feature | Implementation |
|---------|----------------|
| **Authentication** | JWT tokens (HS256), 30-minute expiry, refresh token rotation |
| **Password storage** | bcrypt with per-user salt (cost factor 12) |
| **SQL injection prevention** | SQLAlchemy ORM with parameterized queries — no raw SQL |
| **File upload validation** | MIME type check, extension whitelist (PDF/DOCX), size limit (10 MB) |
| **CORS** | Strict origin allowlist configured via `CORS_ORIGINS` env var |
| **Secrets management** | All secrets in `.env` (never committed); `.env.example` contains no real values |
| **Input validation** | Pydantic v2 schemas validate all API request bodies |
| **Local AI inference** | No student data is sent to external AI providers |
| **Dependency scanning** | `pip-audit` and `npm audit` run in CI pipeline |
| **Rate limiting** | Planned via `slowapi` on sensitive endpoints (login, TrustCheck) |

---

## 🚫 Out of Scope

The following are **not** considered security vulnerabilities for this project:

- Issues in third-party dependencies that have no known exploit path in this application
- Self-XSS (requires the attacker to run their own browser code)
- Missing security headers that do not affect functionality in the current deployment context
- Brute-force attacks without evidence of missing rate limiting (rate limiting is planned)
- Social engineering attacks against users (outside the application boundary)
- TrustCheck producing incorrect AI outputs — this is a known model limitation, not a security vulnerability
- Vulnerabilities in Ollama itself — report those to [Ollama's repository](https://github.com/ollama/ollama/security)
- Issues reproducible only with physical access to the machine running the local Ollama server

---

## 🔐 Security Best Practices for Deployers

If you deploy Campus to Career to a production environment:

1. **Change `SECRET_KEY`** in `.env` to a random 64-character string before deployment.
2. **Use PostgreSQL** instead of SQLite for production.
3. **Run Ollama on a private network** — do not expose port 11434 to the public internet.
4. **Enable HTTPS** — use a reverse proxy (nginx, Caddy) with TLS certificates.
5. **Restrict `CORS_ORIGINS`** to only your production frontend domain.
6. **Do not store resumes indefinitely** — implement a retention policy for uploaded files.
7. **Review uploads directory permissions** — ensure the web process cannot execute files from `uploads/`.
