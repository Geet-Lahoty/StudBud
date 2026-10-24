# StudyGate — Database Design

> **Status:** Implemented Production Schema
>
> **Purpose:** Single source of truth for the StudyGate database structure.

------------------------------------------------------------------------

## 1. Product Model

StudyGate organizes study plans directly around the authenticated user:

```text
auth.users
  │
  ├── tasks (Study / Revision / Exam tasks)
  │     ├── status: todo | in_progress | done
  │     ├── type: study | revision | exam
  │     └── quiz_score: 0..5 (set upon passing)
  │
  └── quiz_attempts (Gate attempts per task)
        ├── score: 0..5
        ├── total: 5
        └── passed: true | false (pass threshold ≥ 4/5)
```

The system flow:
1. Student authenticates via Supabase Auth (magic link OTP or email/password).
2. Student uploads a syllabus image. AI extracts subjects and topics.
3. Student sets exam dates for each subject.
4. System calculates task schedule and populates the `tasks` table with study days and revision days.
5. Student moves a task from `todo` to `in_progress` on the Kanban board.
6. To complete a task and move it to `done`, the student must pass an AI-generated 5-question mastery quiz (score ≥ 4/5).
7. Each attempt is permanently logged in `quiz_attempts`, and passing updates `tasks.status = 'done'` with `tasks.quiz_score`.

------------------------------------------------------------------------

## 2. Database Technology

- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth (`auth.users`)
- **Primary Key:** UUID (`gen_random_uuid()`)
- **Row Level Security (RLS):** Strictly enforced on all application tables (`auth.uid() = user_id`)

------------------------------------------------------------------------

## 3. Tables

### Table 1: `tasks`

Stores every study, revision, and exam task generated for a student.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique Task ID |
| `user_id` | `uuid` | `NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE` | Owner ID |
| `title` | `text` | `NOT NULL` | Task title / topic name |
| `subject` | `text` | `NOT NULL DEFAULT 'General'` | Subject name |
| `study_date` | `date` | `nullable` | Planned study date |
| `exam_date` | `date` | `nullable` | Subject exam date |
| `type` | `text` | `NOT NULL DEFAULT 'study' CHECK (type IN ('study', 'revision', 'exam'))` | Task category |
| `status` | `text` | `NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done'))` | Kanban column |
| `quiz_score` | `int` | `nullable` | Passing quiz score (0–5) |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Creation timestamp |

#### SQL Definition
```sql
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

CREATE INDEX idx_tasks_user_date ON tasks (user_id, study_date);
```

------------------------------------------------------------------------

### Table 2: `quiz_attempts`

Tracks every student attempt on a topic mastery quiz gate.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique Attempt ID |
| `user_id` | `uuid` | `NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE` | Student ID |
| `task_id` | `uuid` | `NOT NULL REFERENCES tasks(id) ON DELETE CASCADE` | Associated Task |
| `score` | `int` | `NOT NULL` | Questions answered correctly |
| `total` | `int` | `NOT NULL DEFAULT 5` | Total questions in quiz |
| `passed` | `boolean` | `NOT NULL` | True if score ≥ 4 |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Attempt timestamp |

#### SQL Definition
```sql
CREATE TABLE quiz_attempts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id     uuid        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  score       int         NOT NULL,
  total       int         NOT NULL DEFAULT 5,
  passed      boolean     NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_attempts_user_task ON quiz_attempts (user_id, task_id);
```

------------------------------------------------------------------------

## 4. Row Level Security (RLS)

All tables enforce Row Level Security ensuring students can only access their own data:

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own tasks" ON tasks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own quiz_attempts" ON quiz_attempts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```
