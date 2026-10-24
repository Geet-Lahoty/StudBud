-- StudyGate – Complete Database Setup & Reset
-- Run this in the Supabase SQL Editor (https://app.supabase.com/)
-- This script cleanly resets existing tables and recreates the schema with all constraints and RLS.

-- ── 1. Teardown existing tables (Full Reset) ─────────────────────────
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE; -- cleans up legacy projects table if present

-- ── 2. Create tasks table ───────────────────────────────────────────
CREATE TABLE tasks (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  subject     text        NOT NULL DEFAULT 'General',
  study_date  date,
  exam_date   date,
  type        text        NOT NULL DEFAULT 'study'
                          CHECK (type IN ('study', 'revision', 'exam')),
  status      text        NOT NULL DEFAULT 'todo'
                          CHECK (status IN ('todo', 'in_progress', 'done')),
  quiz_score  int,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for ordering by study_date and querying per user
CREATE INDEX idx_tasks_user_date ON tasks (user_id, study_date);

-- ── 3. Create quiz_attempts table ───────────────────────────────────
CREATE TABLE quiz_attempts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id     uuid        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  score       int         NOT NULL,
  total       int         NOT NULL DEFAULT 5,
  passed      boolean     NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for querying attempts per user and task
CREATE INDEX idx_quiz_attempts_user_task ON quiz_attempts (user_id, task_id);

-- ── 4. Enable Row Level Security (RLS) ──────────────────────────────
ALTER TABLE tasks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts  ENABLE ROW LEVEL SECURITY;

-- ── 5. RLS Policies ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users manage own tasks" ON tasks;
CREATE POLICY "Users manage own tasks" ON tasks
  FOR ALL
  USING       (auth.uid() = user_id)
  WITH CHECK  (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own quiz_attempts" ON quiz_attempts;
CREATE POLICY "Users manage own quiz_attempts" ON quiz_attempts
  FOR ALL
  USING       (auth.uid() = user_id)
  WITH CHECK  (auth.uid() = user_id);
