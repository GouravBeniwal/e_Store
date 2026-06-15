# Deploying e_Store on Render — Complete Guide

This guide walks you through deploying **both the Flask backend and React frontend** on [Render](https://render.com) using Docker.

---

## 📁 Files to Add / Replace in Your Repo

| File | Action | Description |
|------|--------|-------------|
| `render.yaml` | **Add** (repo root) | Blueprint – defines both services |
| `backend/Dockerfile` | **Add** | Builds & runs Flask via Gunicorn |
| `backend/requirements.txt` | **Replace** | Adds `gunicorn` |
| `backend/config.py` | **Replace** | Reads config from env vars |
| `backend/app.py` | **Replace** | Binds to `0.0.0.0`, CORS from env |
| `frontend/Dockerfile` | **Add** | Multi-stage: builds React, serves with nginx |
| `frontend/nginx.conf` | **Add** | Handles React Router (`try_files`) |
| `frontend/src/utils/api.js` | **Add** | Central API helper using env var |

---

## 🔧 Step 1 — Update Frontend API Calls

Every `fetch("http://localhost:5000/api/...")` call in your React code must be changed to use the `apiFetch` helper.

### Before (hardcoded):
```js
const res = await fetch("http://localhost:5000/api/products");
```

### After (env-aware):
```js
import { apiFetch } from "../utils/api";
const res = await apiFetch("/api/products");

// With options (POST + body):
const res = await apiFetch("/api/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});

// Image URLs (use BASE_URL directly):
import BASE_URL from "../utils/api";
<img src={`${BASE_URL}/images/${product.image}`} alt={product.name} />
```

Go through every file in `frontend/src/pages/` and `frontend/src/components/` and replace all hardcoded `localhost:5000` references.

---

## 🚀 Step 2 — Deploy on Render

### Option A: Blueprint (Recommended — deploys both services at once)

1. Push all new files to your GitHub repo.
2. Go to **Render Dashboard → New → Blueprint**.
3. Connect your GitHub repo — Render will find `render.yaml` automatically.
4. Click **Apply** — both services will start building.
5. Once deployed, **copy the backend URL** (e.g. `https://e-store-backend.onrender.com`).
6. Update `render.yaml`:
   - In the frontend `buildArgs`, set `REACT_APP_API_URL` to your backend URL.
   - In the backend `envVars`, set `FRONTEND_URL` to your frontend URL.
7. Commit & push — both services will redeploy automatically.

### Option B: Manual (two separate services)

#### Backend
1. **New → Web Service** → connect repo → set **Root Directory** to `backend`
2. **Runtime**: Docker
3. **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `SECRET_KEY` | (generate a random string) |
   | `JWT_SECRET_KEY` | (generate a random string) |
   | `FRONTEND_URL` | `https://your-frontend.onrender.com` |
4. **Disk**: Add a disk, mount path `/app/instance`, size 1 GB.
5. Deploy.

#### Frontend
1. **New → Web Service** → connect repo → set **Root Directory** to `frontend`
2. **Runtime**: Docker
3. **Build-time environment variable**:
   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://your-backend.onrender.com` |
4. Deploy.

---

## ⚠️ Important Notes

### SQLite on Render
SQLite is file-based. On Render's free plan, the filesystem is **ephemeral** — the DB is wiped on every deploy unless you attach a **Disk**. The `render.yaml` above already configures a 1 GB disk mounted at `/app/instance`.

> **For production**: consider migrating to **PostgreSQL** (Render offers a free managed Postgres). Change `SQLALCHEMY_DATABASE_URI` in `config.py` to the Postgres connection string.

### Free Plan Cold Starts
Render's free tier spins down services after 15 minutes of inactivity. The first request after a cold start can take ~30–60 seconds. Upgrade to **Starter ($7/mo)** for always-on.

### CORS
The backend only accepts requests from the URL set in `FRONTEND_URL`. If you see CORS errors after deploy, double-check that env var matches your frontend's exact URL (no trailing slash).

### Product Images
Images are served from Flask's `static/images/` folder. These are baked into the Docker image at build time (they're part of the repo). If you add new images later, you'll need to redeploy the backend.

---

## 🔑 Environment Variables Summary

### Backend (`e-store-backend`)
| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Flask session secret | Yes |
| `JWT_SECRET_KEY` | JWT signing secret | Yes |
| `FRONTEND_URL` | Frontend origin for CORS | Yes |
| `DATABASE_URL` | Override SQLite (for Postgres) | Optional |

### Frontend (`e-store-frontend`) — Build-time only
| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend service URL | Yes |

---

## 🏁 Quick Checklist

- [ ] Added `render.yaml` to repo root
- [ ] Added `backend/Dockerfile`
- [ ] Replaced `backend/requirements.txt` (added `gunicorn`)
- [ ] Replaced `backend/config.py`
- [ ] Replaced `backend/app.py`
- [ ] Added `frontend/Dockerfile`
- [ ] Added `frontend/nginx.conf`
- [ ] Added `frontend/src/utils/api.js`
- [ ] Replaced all `localhost:5000` in frontend with `apiFetch()`
- [ ] Pushed to GitHub
- [ ] Created Blueprint on Render
- [ ] Updated URLs in `render.yaml` after first deploy
