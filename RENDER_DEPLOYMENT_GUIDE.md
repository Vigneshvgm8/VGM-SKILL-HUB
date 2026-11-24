# VGM Skill Hub — Live Deployment Guide

This guide covers connecting **Supabase Live Database (PostgreSQL)**, **Razorpay Payment Gateway**, and deploying live on **Render**.

---

## Project Structure Overview

The repository is organized with clean separation of concerns:
```
VGM-Skill-Hub/
├── api/                       # All Backend & Server Code
│   ├── server.ts              # Primary Express application & Vite bridge
│   ├── routes.ts              # All /api route definitions
│   ├── auth.ts                # Session tokens & password hashing
│   ├── db.ts                  # Hybrid Supabase / local JSON database engine
│   ├── supabase.ts            # Live Supabase client & table mappers
│   ├── razorpay.ts            # Payment order creation & webhook verification
│   ├── validators.ts          # Strict Zod input schemas
│   ├── rateLimiter.ts         # Exponential backoff & sliding-window rate limiters
│   ├── errorHandler.ts        # Central error handler with sanitized client responses
│   ├── upload.ts              # Magic-byte file validation & isolated disk storage
│   ├── mailer.ts              # Transactional email notifications
│   └── coursesSeed.ts         # Initial course catalogue seed data
├── frontend/                  # All Frontend Client Code
│   ├── src/                   # React components, pages, hooks, state
│   ├── public/                # Static assets, course SVGs, fonts, sitemap
│   └── index.html             # Client SPA HTML entry point
├── scripts/                   # Security & integration testing scripts
├── storage/                   # Isolated local file upload storage
├── supabase/                  # PostgreSQL DDL schemas & RLS policies
├── package.json               # Root npm scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration pointing to frontend/
└── render.yaml                # 1-Click Render infrastructure blueprint
```

---

## 1. Live Database Setup (Supabase)

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com) and log in.
   - Click **New Project**, choose a project name (e.g., `vgm-skill-hub`), set a secure database password, and pick the region closest to your users (e.g., `Singapore` or `Mumbai`).

2. **Run the Database Schema:**
   - In your Supabase project dashboard, open the **SQL Editor** from the left navigation.
   - Open the [supabase/schema.sql](file:///d:/VGM_Project/WEBSITE/VGM-Skill-Hub/supabase/schema.sql) file from this repository.
   - Paste the SQL script into the SQL Editor and click **Run**.
   - This creates all tables (`courses`, `enrolments`, `coupons`, `project_submissions`, `processed_webhooks`), indexes, Row Level Security (RLS) policies, and initial seed records.

3. **Get Your API Credentials:**
   - In Supabase, navigate to **Project Settings** → **API**.
   - Copy:
     - **Project URL** → `SUPABASE_URL`
     - **anon / public key** → `SUPABASE_ANON_KEY`
     - **service_role key** (under Project API keys) → `SUPABASE_SERVICE_ROLE_KEY` (used securely on your Render backend to manage enrolments).

---

## 2. Payment Gateway Setup (Razorpay)

1. **Get Razorpay API Keys:**
   - Go to the [Razorpay Dashboard](https://dashboard.razorpay.com).
   - In the left sidebar, click **Settings** → **API Keys**.
   - Click **Generate Key** (or use existing keys):
     - For testing: use `rzp_test_...` key.
     - For production: switch to Live Mode and generate `rzp_live_...` key.
   - Copy `Key ID` → `RAZORPAY_KEY_ID` and `Key Secret` → `RAZORPAY_KEY_SECRET`.

2. **Configure Webhook:**
   - In Razorpay Dashboard, go to **Settings** → **Webhooks** → **Add New Webhook**.
   - **Webhook URL:** `https://<YOUR-RENDER-APP-NAME>.onrender.com/api/razorpay-webhook`
   - **Secret:** Enter a custom secret string → `RAZORPAY_WEBHOOK_SECRET`
   - **Active Events:** Check:
     - `payment.captured`
     - `order.paid`
     - `payment.failed`
   - Click **Save**.

---

## 3. Deploy to Render (Live in 3 Steps)

### Method A: Using Render Blueprints (`render.yaml` - Recommended)
1. Push your repository to GitHub or GitLab.
2. Log in to [render.com](https://render.com).
3. Click **New +** → **Blueprint**.
4. Select your `VGM-Skill-Hub` repository. Render will automatically read `render.yaml`!
5. Fill in your environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `ADMIN_PASSWORD` (Your desired password for the `/admin` portal)
   - `APP_URL` (e.g. `https://vgm-skill-hub.onrender.com`)
6. Click **Apply**. Render will install, build the Vite production bundle, compile `server.js`, and start your live service.

### Method B: Manual Web Service Setup
- **Name:** `vgm-skill-hub`
- **Region:** `Singapore`
- **Runtime:** `Node`
- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Start Command:** `node server.js`
- **Health Check Path:** `/health`

---

## 4. Verification Checklist

Once deployed on Render, verify each system:

| Endpoint | Purpose | Expected Status |
| :--- | :--- | :--- |
| `GET /health` | Service & Integration Health Check | `HTTP 200` (`status: healthy`) |
| `GET /api/health/db` | Live Supabase Ping & Latency | `HTTP 200` (`supabase.connected: true`) |
| `GET /api/config` | Razorpay & Database configuration | `HTTP 200` (`isLive: true/false`) |
| `POST /api/validate-coupon` | Coupon validation with rate limiting | `HTTP 200` |
| `POST /api/admin/login` | Exponential backoff auth protection | `HTTP 200` / `401` / `429` |
| `POST /api/upload` | Magic-byte secure file upload | `HTTP 200` |
