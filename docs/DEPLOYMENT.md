# Cloud Deployment Guide — Campus to Career

This guide provides step-by-step instructions for deploying **Campus to Career** to the cloud with **zero monthly cost** and **no credit card required**.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │            User Browser              │
                      └──────────────────┬───────────────────┘
                                         │
                         HTTPS           │           HTTPS
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │    Frontend (Next.js)     │                   │     Backend (FastAPI)     │
   │  Hosted on Vercel / Render│ ── REST API ───►  │  Hosted on Render / Docker│
   └───────────────────────────┘                   └─────────────┬─────────────┘
                                                                 │
                                                   ┌─────────────┴─────────────┐
                                                   │    SQLite / PostgreSQL    │
                                                   │    Auto-Seeded on Boot    │
                                                   └───────────────────────────┘
```

---

## Method 1: The Recommended Free Stack (Vercel + Render)

### Step 1: Deploy Backend to Render (Free)
1. Sign up / Log in to **[Render.com](https://render.com)** using your GitHub account (`sakshampete91-jpg`).
2. In the Render Dashboard, click **New +** ➔ **Web Service**.
3. Select your repository: **`sakshampete91-jpg/campus-to-career`**.
4. Configure the settings:
   - **Name:** `campus-to-career-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Region:** Choose closest to you (e.g. Oregon, Frankfurt, Singapore)
   - **Branch:** `main`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   - `CORS_ORIGINS` = `*`
   - `ENVIRONMENT` = `production`
6. Click **Create Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://campus-to-career-backend.onrender.com`).
   - Test it by opening `https://campus-to-career-backend.onrender.com/health` in your browser.

---

### Step 2: Deploy Frontend to Vercel (Free)
1. Sign up / Log in to **[Vercel.com](https://vercel.com)** using your GitHub account.
2. Click **Add New...** ➔ **Project**.
3. Import your repository: **`sakshampete91-jpg/campus-to-career`**.
4. In Project Settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click **Edit** and select `frontend`.
5. Under **Environment Variables**, add:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** Your Render backend URL + `/api/v1` (e.g. `https://campus-to-career-backend.onrender.com/api/v1`)
6. Click **Deploy**.
7. In ~60 seconds, your site is live with a custom domain (e.g. `https://campus-to-career.vercel.app`)!

---

## Method 2: 1-Click Blueprint on Render (`render.yaml`)

We have included a pre-configured `render.yaml` infrastructure-as-code file in this repository.

1. Go to **[Render Dashboard](https://dashboard.render.com)**.
2. Click **New +** ➔ **Blueprint**.
3. Connect your repository: **`sakshampete91-jpg/campus-to-career`**.
4. Render automatically detects `render.yaml` and provisions:
   - `campus-to-career-backend` (FastAPI Web Service)
   - `campus-to-career-frontend` (Next.js Web Service)
5. Click **Apply**. Both services will build and link automatically.

---

## Method 3: Docker Container Deployment

You can build and run the backend anywhere Docker is supported (Railway, Fly.io, AWS App Runner, GCP Cloud Run, or your own VPS):

```bash
# Build backend image
docker build -t campus-to-career-backend ./backend

# Run container on port 8000
docker run -d -p 8000:8000 --name ctc-backend campus-to-career-backend
```

---

## Post-Deployment Verification Checklist

- [ ] Backend root health check: `GET https://<backend-url>/` returns `{"status":"ok"}`.
- [ ] Backend OpenAPI docs: Open `https://<backend-url>/docs`.
- [ ] Frontend loads homepage: Open `https://<frontend-url>/`.
- [ ] Browse opportunities: Navigate to `https://<frontend-url>/marketplace`.
- [ ] Internship TrustCheck: Test scan a URL at `https://<frontend-url>/trustcheck`.
- [ ] AI Resume PDF download: Download tailored resume from `https://<frontend-url>/resume`.
