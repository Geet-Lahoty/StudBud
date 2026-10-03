# StudyGate – AI-Powered Exam Prep System

StudyGate is an intelligent exam preparation assistant built for university students. It transforms syllabus photos into structured, actionable study schedules, tracks progress on a Kanban board, and enforces academic mastery through AI-generated quiz gates before tasks can be marked as complete.

---

## Features

- 📷 **Syllabus Image Extraction**: Upload syllabus images (PNG, JPEG, WebP) to automatically extract subjects and topics using Google's Gemma model via `@google/genai`.
- 📅 **Automated Schedule Generation**: Intelligently spreads topics evenly between today and 2 days before the exam, automatically scheduling a dedicated revision day before each exam.
- 📋 **Study Kanban Board**: Visual 3-column workflow (`To Do`, `In Progress`, `Done`) with subject color hashing, urgency badges, and subject filtering.
- 🎓 **Mastery Quiz Gates**: Tasks can only move to `Done` by passing a 5-question AI-generated multiple-choice quiz (minimum 4/5 score required). Attempt history is persistently tracked in Supabase.
- 📊 **Timetable Dashboard**: Real-time summary cards (Due Today, Done Today, Behind Schedule), overall progress tracking, overdue action items, and 7-day upcoming roadmap.
- 🔒 **Secure Multi-User Data**: Powered by Supabase Auth (magic link OTP) and Row Level Security (RLS) guaranteeing complete data isolation per student.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS (v4)
- **Database & Auth**: Supabase (`@supabase/supabase-js`) with Row Level Security (RLS)
- **AI / LLM**: Gemini API via `@google/genai` (Model: `gemma-4-26b-a4b-it`)

---

## Environment Variables

Create a `.env` file in the project root based on `.env.example`:

| Variable | Description | Used In |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `src/supabase.js` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous / public API key | `src/supabase.js` |
| `VITE_GEMINI_API_KEY` | Google AI Studio Gemini API Key | `src/api/ai.js` |
| `VITE_USE_MOCK` | Set to `"true"` to use realistic mock data without hitting AI APIs | `src/api/ai.js` |
| `VITE_DEMO_MODE` | Set to `"true"` to enable one-click "Skip quiz (demo)" button | `src/components/QuizModal.jsx` |

---

## Getting Started

### 1. Clone and Install Dependencies
```bash
git clone <repo-url>
cd hacktoberfest
npm install
```

### 2. Configure Database
Run the idempotent SQL script in [`supabase/setup.sql`](supabase/setup.sql) inside your [Supabase SQL Editor](https://app.supabase.com/). See [`MANUAL_STEPS.md`](MANUAL_STEPS.md) for full details.

### 3. Configure `.env`
```bash
cp .env.example .env
# Edit .env and fill in your Supabase & Gemini keys
```

### 4. Run Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## Security

> [!WARNING]
> **Client-Side API Key Notice**: In Vite applications, variables prefixed with `VITE_` (such as `VITE_GEMINI_API_KEY`) are bundled into client-side JavaScript and accessible in browser network inspection.
>
> **Recommended Production Fix**:
> For production deployments, migrate direct Gemini calls to a backend serverless proxy function (e.g. Vercel Serverless Function `/api/gemini.js` or Supabase Edge Functions) that reads `GEMINI_API_KEY` securely from server environment variables and validates user Supabase JWT authentication tokens.

- **Supabase Anon Key & RLS**: The Supabase Anonymous key (`VITE_SUPABASE_ANON_KEY`) is safe to expose in the frontend because Row Level Security (RLS) is strictly enabled on all tables (`tasks` and `quiz_attempts`), restricting access to `auth.uid() = user_id`.
- **Secret Hygiene**: The Supabase `service_role` key must **never** be included in frontend code or client-facing `.env` files.
