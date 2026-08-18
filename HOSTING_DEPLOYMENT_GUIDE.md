# 🚀 SGIP Platform — Production Hosting & Deployment Guide

This guide details the fastest and most reliable ways to host the **SGIP Student Growth Intelligence & Placement Platform** online with live public URLs.

---

## ⚡ Option 1: Recommended Free Production Hosting (Vercel + Render + MongoDB Atlas)

This configuration is **100% Free**, reliable, and takes less than 10 minutes to deploy.

```
┌─────────────────────────┐       ┌───────────────────────────┐       ┌────────────────────────┐
│     Vercel Frontend     │ ────► │       Render Backend      │ ────► │     MongoDB Atlas      │
│  (React / Vite + SPA)   │       │  (Node.js + Express API)  │       │     (Free Cluster)     │
└─────────────────────────┘       └───────────────────────────┘       └────────────────────────┘
             │                                  │
             ▼                                  ▼
┌─────────────────────────┐       ┌───────────────────────────┐
│ Streamlit Cloud / Render│       │        Groq Cloud         │
│ (Python Resume ATS App) │       │   (Llama-3 / GPT-OSS AI)  │
└─────────────────────────┘       └───────────────────────────┘
```

---

### Step 1: Setup Free MongoDB Database (MongoDB Atlas)
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Click **"Create a Database"** → Select **M0 (Free)**.
3. Under **Security Quickstart**:
   - Create a database user (e.g. `sgip_admin` and a strong password).
   - Under **IP Access List**, click **"Add IP Address"** → Select **Allow Access from Anywhere (`0.0.0.0/0`)**.
4. Click **"Connect"** → Choose **"Drivers"** (Node.js) → Copy the connection string:
   ```
   mongodb+srv://sgip_admin:<password>@cluster0.xxxx.mongodb.net/sgip_db?retryWrites=true&w=majority
   ```

---

### Step 2: Push Your Code to GitHub
1. In your local terminal, initialize Git if not already done:
   ```bash
   git init
   git add .
   git commit -m "Production ready SGIP release"
   ```
2. Create a new repository on [https://github.com](https://github.com) (e.g., `SGIP-Placement-Platform`).
3. Push your repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/SGIP-Placement-Platform.git
   git push -u origin main
   ```

---

### Step 3: Deploy Backend API on Render (Free Web Service)
1. Go to [https://render.com](https://render.com) and sign in with GitHub.
2. Click **"New +"** → Select **"Web Service"** → Connect your GitHub repository.
3. Configure the service:
   - **Name**: `sgip-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && pip install pypdf python-docx reportlab`
   - **Start Command**: `node src/server.js`
   - **Plan**: `Free`
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGO_URI` | *Your MongoDB Atlas connection string from Step 1* |
   | `JWT_SECRET` | `sgip_super_secret_jwt_key_production_2026` |
   | `GROQ_API_KEY` | `your_groq_api_key_here` |
   | `SMTP_USER` | `cooperative.team8503@gmail.com` |
   | `SMTP_PASS` | `smojmmngxobpgpuf` |
   | `FRONTEND_URL` | *Your frontend URL (e.g. `https://sgip-frontend.vercel.app`)* |
5. Click **"Deploy Web Service"**.
6. Copy your live backend URL (e.g., `https://sgip-backend.onrender.com`).

---

### Step 4: Deploy Python Streamlit Resume ATS Engine (Streamlit Community Cloud or Render)

#### Option A: Streamlit Community Cloud (Recommended - Free & Fast)
1. Go to [https://share.streamlit.io](https://share.streamlit.io) and log in with GitHub.
2. Click **"New App"**:
   - **Repository**: `<your-username>/SGIP-Placement-Platform`
   - **Branch**: `main`
   - **Main file path**: `streamlit_app.py`
3. Click **"Advanced Settings"** → Under **Secrets**, add:
   ```toml
   GROQ_API_KEY = "your_groq_api_key_here"
   ```
4. Click **"Deploy"**. Copy the live Streamlit URL (e.g., `https://sgip-resume.streamlit.app`).

---

### Step 5: Deploy Frontend on Vercel (Free & Instant)
1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **"Add New..."** → **"Project"** → Import your repository.
3. In project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` → select `frontend`.
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://sgip-backend.onrender.com/api` *(Your Render Backend URL + /api)* |
   | `VITE_STREAMLIT_URL` | `https://sgip-resume.streamlit.app` *(Your Streamlit URL)* |
5. Click **"Deploy"**.
6. Your platform will be live at `https://sgip-frontend.vercel.app`! 🎉

---

## 🐳 Option 2: 1-Command Docker Deployment (Any Linux VPS / AWS / DigitalOcean / Railway)

If you have a Linux VPS (Ubuntu / Debian), you can launch the **entire stack** (Frontend + Backend + Streamlit + MongoDB) with a single command:

1. Clone your repo onto the server:
   ```bash
   git clone https://github.com/<your-username>/SGIP-Placement-Platform.git
   cd SGIP-Placement-Platform
   ```
2. Start all containers in background:
   ```bash
   docker compose up -d --build
   ```
3. That's it!
   - Frontend is live on port `80` (`http://your-server-ip`)
   - Backend API is live on port `5000`
   - Streamlit Resume ATS Engine is live on port `8501`

---

## 📋 Pre-Configured Credentials Reference

| Service | Setting | Production Value |
|---|---|---|
| **AI Engine** | `GROQ_API_KEY` | `your_groq_api_key_here` |
| **Email SMTP** | `SMTP_USER` | `cooperative.team8503@gmail.com` |
| **Email App Password** | `SMTP_PASS` | `smojmmngxobpgpuf` |
| **JWT Secret** | `JWT_SECRET` | `sgip_super_secret_jwt_key_production_2026` |
| **Database** | `MONGO_URI` | MongoDB Atlas cluster connection string |

---

## 🔍 Verification Checklist Post-Deployment

- [ ] Open Frontend URL in browser → Verify landing page and theme.
- [ ] Test Candidate Registration at `/register` → Verify user created in MongoDB and welcome email sent.
- [ ] Test Academic Save at `/academics` → Verify diff email dispatched to Gmail.
- [ ] Test Resume ATS Scanner at `/resume-analyzer` → Verify Python Streamlit parsing and PDF download.
- [ ] Test AI Assistant drawer → Verify responses from Groq LLM.
