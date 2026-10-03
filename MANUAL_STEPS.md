# StudyGate – Manual Configuration & Setup Checklist

This document details all the steps that require manual execution in your Supabase, Google AI Studio, and deployment dashboards.

---

### 1. Database Schema & Policies (Supabase SQL Editor)
1. Open your [Supabase Dashboard](https://app.supabase.com/) and select your project.
2. Navigate to **SQL Editor** in the left sidebar.
3. Click **New query**, paste the entire contents of [`supabase/setup.sql`](supabase/setup.sql), and click **Run**.
4. Verify that:
   - Tables `tasks` and `quiz_attempts` are created.
   - Row Level Security (RLS) is enabled on both tables.
   - Policies `"Users manage own tasks"` and `"Users manage own quiz_attempts"` are active.

---

### 2. Configure Supabase Authentication (Magic Link)
1. In your Supabase Dashboard, go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to `http://localhost:5173` for local development (or your production URL after deploying).
3. Under **Redirect URLs**, add:
   - `http://localhost:5173`
   - `http://localhost:5173/**`
   - (And your production domain once deployed).
4. Go to **Authentication** → **Email Templates** to ensure Magic Link / Confirmation emails are enabled.

---

### 3. Configure Local Environment Variables
1. Ensure your local `.env` file contains valid credentials copied from `.env.example`:
   ```bash
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   VITE_GEMINI_API_KEY=<your-gemini-api-key>
   VITE_USE_MOCK=false
   VITE_DEMO_MODE=false
   ```
2. In development without an API key, set `VITE_USE_MOCK=true` to test extraction and quiz features with sample data.
3. For fast judging or demoing without taking full quizzes, set `VITE_DEMO_MODE=true` to enable the "Skip quiz (demo)" button.

---

### 4. Rotate Any Previously Exposed API Keys
1. If any Gemini API key was committed to git history previously, open [Google AI Studio](https://aistudio.google.com/apikey) and delete/revoke the exposed key.
2. Generate a new API key and paste it strictly into your local `.env` file (which is gitignored).

---

### 5. Check API & Tier Quotas
1. **Google AI Studio (Gemini / Gemma)**: Check your project rate limits (e.g. 15 RPM for free tier).
2. **Supabase**: Check your database bandwidth, monthly active users, and storage limits on the free tier.
