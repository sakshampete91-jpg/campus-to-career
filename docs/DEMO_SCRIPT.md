# Demo Script — Campus to Career

**Event:** Hacktoberfest 2026 — Best Open-Source AI Project
**Duration:** ~5 minutes
**Format:** Live screen-share demo

> [!IMPORTANT]
> Use **only synthetic demo data**. No real company names, no real people, no real email addresses.
> All data shown must be clearly fictional (e.g., "TechNova Labs", "Aanya Sharma", `student@demo.example`).

---

## Pre-Demo Checklist

Before starting the demo, ensure:

- [ ] Backend running: `http://localhost:8000` (check `/health` returns OK)
- [ ] Frontend running: `http://localhost:3000`
- [ ] Ollama running: `ollama serve` (model `llama3.2:1b` pulled)
- [ ] Demo student account pre-created: `demo.student@example.test` / password `DemoPass123!`
- [ ] Demo employer account pre-created: `technova@example.test` / password `DemoPass123!`
- [ ] 3 synthetic listings seeded in the database
- [ ] Sample resume file ready: `demo_resume_aanya.pdf` (synthetic, fictional person)
- [ ] Browser zoom: 110% for readability
- [ ] Close all unrelated tabs and notifications

---

## Scene 1 — Landing Page Walk-Through (30 seconds)

**Action:** Open browser to `http://localhost:3000`

**Narration:**
> "This is Campus to Career — a free, open-source platform with one goal: connecting students from any college to legitimate career opportunities, using AI that runs entirely on your own machine."

**Show:**
- Hero section: title "Campus to Career" and tagline "From Skills to Opportunities."
- Feature highlights: Marketplace, TrustCheck, Resume Tailor, Tracker
- No subscription, no fees, no cloud AI costs

**Transition:** Click "Get Started as a Student"

---

## Scene 2 — Student Registration + Profile with Skills (45 seconds)

**Action:** Register as a new student (or log in with the pre-created demo account)

**Narration:**
> "Registering takes 30 seconds. No college affiliation needed — this platform works for any student, anywhere."

**Show:**
- Registration form: Name `Aanya Sharma`, email `aanya.demo@example.test`, role: Student
- After login, navigate to **Profile**
- Skills section — add skills: `Python`, `Machine Learning`, `SQL`, `Data Visualization`
- Bio: "Final-year CS student passionate about AI and data."
- Click Save Profile

**Key talking point:**
> "Notice there's no GPA field, no college name field. We match on skills — what you can *do*, not where you studied."

---

## Scene 3 — Marketplace — Skills-Based Matching (30 seconds)

**Action:** Navigate to **Marketplace**

**Narration:**
> "The marketplace surfaces opportunities based on skill overlap. I'll filter for Python and Machine Learning."

**Show:**
- Type `Python, ML` into the skill filter
- Three synthetic listings appear with match scores:
  - "Junior AI Developer Intern" at TechNova Labs — **95% match** ⭐
  - "Data Analyst Trainee" at Analytica Co — **72% match**
  - "Frontend Developer" at PixelForge — **20% match** (visually deprioritized)
- Click on "Junior AI Developer Intern" to show details

**Key talking point:**
> "Higher match score means your skill profile aligns with what the role needs. No guessing."

---

## Scene 4 — TrustCheck Scan (60 seconds)

**Action:** Navigate to **TrustCheck**

**Narration:**
> "TrustCheck is our AI-powered safety scanner for job listings. Students sometimes encounter fake or exploitative postings. Let's test one."

**Paste this synthetic suspicious listing:**
```
URGENT HIRING — Work From Home Data Entry Specialist

Earn ₹800–₹2,000 per hour from home!
No experience needed. Guaranteed income from Day 1.
To confirm your slot, pay a one-time registration fee of ₹499.
Contact only via WhatsApp: +91-XXXXXXXXXX
No official website. Limited slots available — apply NOW.
```

- Click **Scan Listing**
- Wait ~5-8 seconds (show the loading spinner)

**Show result:**
- Risk level badge: 🔴 **HIGH RISK**
- Flags list:
  - ⚠️ `FEE_REQUEST` — Listing requests a registration fee (Severity: HIGH)
  - ⚠️ `GUARANTEED_INCOME` — Claims guaranteed income, a common scam signal (Severity: HIGH)
  - ⚠️ `UNOFFICIAL_CONTACT` — Contact via WhatsApp only, no official email (Severity: MEDIUM)
  - ⚠️ `URGENCY_PRESSURE` — Artificial urgency to rush decision (Severity: LOW)
- AI explanation: "This listing exhibits multiple high-confidence red flags..."

**Narration:**
> "The AI identified four red flags in under 8 seconds — all running on a 1-billion parameter model locally. No data left the machine."

**Point to disclaimer:**
> "TrustCheck is provisional — it's a tool to surface signals, not a legal guarantee. We're transparent about that in the UI and README."

---

## Scene 5 — Resume Upload + Tailor (60 seconds)

**Action:** Navigate to **Resume → Upload & Tailor**

**Narration:**
> "Now let's use the AI to tailor Aanya's resume for that Junior AI Developer role."

**Show:**
- Drag and drop `demo_resume_aanya.pdf` into the upload zone
- File validation passes (PDF, 142 KB, under 10 MB)
- In "Target Role" field, type: `Junior AI Developer`
- Click **Tailor Resume**
- Loading state: "AI is tailoring your resume…" (~10-15 seconds)

**Show tailored result:**
- Skills section reordered: Python, ML, SQL highlighted first
- Summary rewritten to emphasize AI/data profile
- Original resume shown side-by-side for comparison

**Then demonstrate contrast:**
- Change target role to `Graphic Designer`
- Click **Tailor Resume** again
- New version emphasizes different aspects (data visualization, creativity)

**Key talking point:**
> "Same resume, two completely different target roles — the AI adapts the narrative while keeping the facts accurate. Aanya reviews and edits before downloading."

---

## Scene 6 — PDF Download (15 seconds)

**Action:** On the preview panel, click **Download as PDF**

**Narration:**
> "One click — a professionally formatted PDF, branded with her name, ready to submit."

**Show:**
- PDF opens in browser viewer or downloads
- Clean, readable layout
- File name: `aanya_sharma_junior_ai_developer_resume.pdf`

---

## Scene 7 — Application Tracker (20 seconds)

**Action:** Navigate to **Tracker**

**Narration:**
> "Aanya applies to the TechNova Labs role. The tracker keeps everything organized."

**Show:**
- Kanban board with 4 columns: **Applied | Shortlisted | Interview | Offer/Rejected**
- "Junior AI Developer Intern — TechNova Labs" card in Applied column
- Drag it to **Interview** column
- Notes field: "Technical round scheduled — prep Python + ML basics"

---

## Scene 8 — Employer Dashboard (15 seconds)

**Action:** Log out as student, log in as `technova@example.test`

**Narration:**
> "From the employer side — TechNova Labs posted that listing and can browse skill-matched candidates."

**Show:**
- Employer dashboard: listing stats, number of applicants
- "Browse Candidates" — filtered list showing Aanya at top (95% skill match)
- Candidate card: name, skills tags, match score — no contact info until employer expresses interest

---

## Scene 9 — GitHub Repository (15 seconds)

**Action:** Open `https://github.com/your-org/campus-to-career` (or show local repo)

**Narration:**
> "Everything you saw is fully open-source under the MIT License."

**Quickly show:**
- `README.md` — project overview, quick start, AI model info
- `LICENSE` — MIT, 2026
- `backend/tests/` — pytest suite
- `docs/ARCHITECTURE.md` — system design
- `.github/workflows/ci.yml` — automated CI pipeline
- Green CI badge on README

**Closing line:**
> "Campus to Career: From Skills to Opportunities — open-source, locally AI-powered, and built for every student, everywhere."

---

## Demo Data Reference

| Item | Value |
|------|-------|
| Student name | Aanya Sharma *(fictional)* |
| Student email | `aanya.demo@example.test` |
| Employer name | TechNova Labs *(fictional)* |
| Employer email | `technova@example.test` |
| Demo password | `DemoPass123!` |
| Opportunity 1 | Junior AI Developer Intern — TechNova Labs |
| Opportunity 2 | Data Analyst Trainee — Analytica Co *(fictional)* |
| Opportunity 3 | Frontend Developer — PixelForge *(fictional)* |
| Suspicious listing | Synthetic scam text (see Scene 4) |
| Resume file | `demo_resume_aanya.pdf` *(synthetic, no real person)* |

---

## Timing Summary

| Scene | Duration |
|-------|---------|
| 1. Landing page | 0:30 |
| 2. Registration + profile | 0:45 |
| 3. Marketplace | 0:30 |
| 4. TrustCheck | 1:00 |
| 5. Resume tailor | 1:00 |
| 6. PDF download | 0:15 |
| 7. Application tracker | 0:20 |
| 8. Employer dashboard | 0:15 |
| 9. GitHub repo | 0:15 |
| **Total** | **~5:10** |

> [!TIP]
> Scenes 3 and 6 can be shortened or skipped if running over time. Scenes 4 (TrustCheck) and 5 (Resume Tailor) are the highest-impact AI demonstrations — always include these.
