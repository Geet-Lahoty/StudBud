-- StudyGate – Database Setup (idempotent)
-- Run this in the Supabase SQL Editor (or via supabase db push).
-- Safe to run more than once.

-- ── tasks table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users ON DELETE CASCADE,
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

-- Upgrade existing tasks table if it was created with old schema
DO $$ BEGIN
  -- Add user_id if missing
  ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users ON DELETE CASCADE;
  ALTER TABLE tasks ALTER COLUMN user_id SET DEFAULT auth.uid();
  -- Add subject if missing
  ALTER TABLE tasks ADD COLUMN IF NOT EXISTS subject text NOT NULL DEFAULT 'General';
  -- Add date and type columns if missing
  ALTER TABLE tasks ADD COLUMN IF NOT EXISTS study_date date;
  ALTER TABLE tasks ADD COLUMN IF NOT EXISTS exam_date date;
  ALTER TABLE tasks ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'study';
  ALTER TABLE tasks ADD COLUMN IF NOT EXISTS quiz_score int;
  -- If old project_id had a NOT NULL constraint, remove it
  ALTER TABLE tasks ALTER COLUMN project_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── quiz_attempts table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users ON DELETE CASCADE,
  task_id     uuid        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  score       int         NOT NULL,
  total       int         NOT NULL DEFAULT 5,
  passed      boolean     NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Enable Row Level Security ────────────────────────────────────
ALTER TABLE tasks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts  ENABLE ROW LEVEL SECURITY;

-- ── RLS policies (drop-then-create for idempotency) ──────────────
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
