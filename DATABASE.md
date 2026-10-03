# StudBud --- Database Design

> **Status:** Proposed MVP schema --- team must agree before
> implementation.
>
> **Purpose:** Single source of truth for the StudBud database
> structure. Coding agents and team members should refer to this file
> before creating or changing database code.

------------------------------------------------------------------------

## 1. Product Model

StudBud has a simple hierarchy:

``` text
User
 │
 └── Projects
       │
       ├── AI-generated Markdown roadmap
       │
       └── Kanban tasks
             ├── todo
             ├── doing
             └── done
```

The initial prototype allows a user to:

1.  Create a project.
2.  Provide a syllabus and deadline to the AI.
3.  Get an AI-generated day-by-day roadmap.
4.  Get AI-generated study tasks.
5.  View tasks on a Kanban board.
6.  Move tasks between `todo`, `doing`, and `done`.
7.  Refresh the page without losing the project or tasks.

------------------------------------------------------------------------

# 2. Database Technology

-   **Database:** PostgreSQL
-   **Backend as a Service:** Supabase
-   **Authentication:** Supabase Auth
-   **Primary key:** UUID
-   **Timestamps:** `timestamptz`
-   **Roadmap storage:** PostgreSQL `text`

We will use Supabase's built-in:

``` text
auth.users
```

for authentication.

We do **not** create a separate application `users` table for the MVP.

------------------------------------------------------------------------

# 3. Tables

The MVP has two application tables:

``` text
auth.users
    │
    │ 1:N
    ▼
projects
    │
    │ 1:N
    ▼
tasks
```

## Table 1: `projects`

A project represents one study/exam preparation plan.

### Schema

  -----------------------------------------------------------------------
  Column            Type              Constraints       Description
  ----------------- ----------------- ----------------- -----------------
  `id`              `uuid`            PK, default UUID  Project ID

  `user_id`         `uuid`            NOT NULL, FK →    Project owner
                                      `auth.users.id`   

  `name`            `text`            NOT NULL          Project name

  `deadline`        `date`            NOT NULL          Study/exam
                                                        deadline

  `roadmap_md`      `text`            nullable          AI-generated
                                                        Markdown roadmap

  `created_at`      `timestamptz`     NOT NULL, default Creation
                                      now               timestamp

  `updated_at`      `timestamptz`     NOT NULL, default Last update
                                      now               timestamp
  -----------------------------------------------------------------------

### SQL

``` sql
create table public.projects (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    name text not null,

    deadline date not null,

    roadmap_md text,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()
);
```

### Example

``` text
id:          8b7...
user_id:     3f2...
name:        DBMS Exam Prep
deadline:    2026-10-15
roadmap_md:  "# DBMS Study Roadmap\n\n## Day 1..."
```

------------------------------------------------------------------------

# 4. Table 2: `tasks`

A task represents one item on the project's Kanban board.

Every task belongs to exactly one project.

### Schema

  -----------------------------------------------------------------------
  Column            Type              Constraints       Description
  ----------------- ----------------- ----------------- -----------------
  `id`              `uuid`            PK, default UUID  Task ID

  `project_id`      `uuid`            NOT NULL, FK →    Parent project
                                      `projects.id`     

  `title`           `text`            NOT NULL          Task title

  `description`     `text`            nullable          Optional task
                                                        details

  `due_date`        `date`            nullable          Planned study
                                                        date

  `status`          `text`            NOT NULL, default Kanban column
                                      `todo`            

  `position`        `integer`         NOT NULL, default Ordering within a
                                      `0`               Kanban column

  `created_at`      `timestamptz`     NOT NULL, default Creation
                                      now               timestamp
  -----------------------------------------------------------------------

### Allowed statuses

``` text
todo
doing
done
```

### SQL

``` sql
create table public.tasks (
    id uuid primary key default gen_random_uuid(),

    project_id uuid not null
        references public.projects(id)
        on delete cascade,

    title text not null,

    description text,

    due_date date,

    status text not null default 'todo'
        check (status in ('todo', 'doing', 'done')),

    position integer not null default 0,

    created_at timestamptz not null default now()
);
```

### Example

``` text
id:          12a...
project_id:  8b7...
title:       Learn Binary Trees
description: Understand traversal and BST operations
due_date:    2026-10-05
status:      todo
position:    0
```

------------------------------------------------------------------------

# 5. Why `roadmap_md` is stored as `text`

The AI-generated roadmap is Markdown content, not necessarily a physical
`.md` file.

Example:

``` md
# DBMS Study Roadmap

## Day 1 — October 3

- Relational Algebra
- Selection and Projection
- Basic SQL

## Day 2 — October 4

- Joins
- Nested Queries
- Aggregation
```

This entire string is stored in:

``` text
projects.roadmap_md
```

PostgreSQL's `text` type supports large variable-length text, so this is
appropriate for the roadmap.

We do **not** need Supabase Storage for the roadmap in the MVP.

------------------------------------------------------------------------

# 6. Relationships

## User → Projects

One user can own many projects.

``` text
auth.users
    │
    │ 1
    │
    │ N
    ▼
projects
```

Relationship:

``` text
projects.user_id → auth.users.id
```

If a user is deleted, their projects are deleted:

``` sql
on delete cascade
```

------------------------------------------------------------------------

## Project → Tasks

One project can have many tasks.

``` text
projects
    │
    │ 1
    │
    │ N
    ▼
tasks
```

Relationship:

``` text
tasks.project_id → projects.id
```

If a project is deleted, its tasks are deleted:

``` sql
on delete cascade
```

------------------------------------------------------------------------

# 7. Kanban Behaviour

The Kanban board is represented entirely by `status` and `position`.

Example:

``` text
TODO                    DOING                   DONE

position 0: Arrays      position 0: Trees       position 0: SQL
position 1: Graphs      position 1: Graphs
position 2: Sorting
```

Moving a task from TODO to DOING means updating:

``` text
status = 'doing'
```

Reordering tasks means updating:

``` text
position
```

The database does not need separate tables for Kanban columns.

------------------------------------------------------------------------

# 8. AI → Database Flow

Gemma generates structured data.

The expected AI output should conceptually look like:

``` json
{
  "roadmap_md": "# Study Roadmap\n\n## Day 1\n- Arrays\n- Linked Lists",
  "tasks": [
    {
      "title": "Arrays",
      "description": "Study array operations and complexity",
      "due_date": "2026-10-03"
    },
    {
      "title": "Linked Lists",
      "description": "Study singly and doubly linked lists",
      "due_date": "2026-10-04"
    }
  ]
}
```

The application then:

1.  Creates the project.
2.  Stores `roadmap_md` in `projects`.
3.  Creates each AI-generated task in `tasks`.
4.  Defaults each task to `status = 'todo'`.
5.  Assigns a `position`.

``` text
Gemma
  │
  ├── roadmap_md ──────→ projects.roadmap_md
  │
  └── tasks[] ─────────→ tasks
```

------------------------------------------------------------------------

# 9. Important Database Rules

### Rule 1 --- Do not create another users table

Use:

``` text
auth.users
```

provided by Supabase.

Do not create:

``` text
public.users
```

for the MVP unless a specific requirement appears later.

------------------------------------------------------------------------

### Rule 2 --- Do not create a roadmap table yet

The roadmap belongs to one project and is currently just Markdown text.

Use:

``` text
projects.roadmap_md
```

Do not create:

``` text
roadmaps
```

unless the product later requires multiple roadmap versions/history.

------------------------------------------------------------------------

### Rule 3 --- Do not store Kanban columns as rows

Do not create:

``` text
kanban_columns
```

for the MVP.

Use:

``` text
tasks.status
```

with:

``` text
todo
doing
done
```

------------------------------------------------------------------------

### Rule 4 --- Keep quiz data out of the MVP schema

The quiz feature may be added later.

Possible future table:

``` text
quiz_attempts
```

But it should not be implemented until the quiz feature is actually
being built.

------------------------------------------------------------------------

### Rule 5 --- AI output must be validated

Never blindly insert AI-generated JSON into the database.

Validate that:

-   `roadmap_md` is a string.
-   `tasks` is an array.
-   Every task has a title.
-   Dates are valid.
-   Status is controlled by the application, not the AI.
-   IDs are generated by the database/application.

AI should **not** generate:

``` text
id
project_id
status
created_at
```

The application/database owns those fields.

------------------------------------------------------------------------

# 10. Row Level Security (RLS)

Because projects belong to users, users must only be able to access
their own projects and tasks.

RLS should be enabled before treating the application as
production-ready.

Conceptually:

``` text
User A
  ↓
can access only
  ↓
User A's projects
  ↓
User A's tasks
```

A task does not directly contain `user_id`, so task access should be
checked through its project's `user_id`.

RLS policies should be implemented as part of the Supabase setup.

------------------------------------------------------------------------

# 11. Indexes

For the MVP, keep indexing simple.

Recommended:

``` sql
create index idx_projects_user_id
on public.projects(user_id);

create index idx_tasks_project_id
on public.tasks(project_id);

create index idx_tasks_project_status
on public.tasks(project_id, status);
```

These support the common queries:

``` text
Get all projects for current user
Get all tasks for a project
Get tasks grouped by Kanban status
```

------------------------------------------------------------------------

# 12. Current Scope vs Future Scope

## MVP

``` text
auth.users
     │
     ▼
projects
     │
     ▼
tasks
```

Supports:

-   User accounts
-   Multiple projects
-   Project deadline
-   AI roadmap
-   AI-generated tasks
-   Kanban board
-   Task status
-   Task ordering
-   Persistence

## Possible future tables

Only add these when their features are actually implemented:

``` text
quiz_attempts
syllabus_files
project_members
roadmap_versions
notifications
```

------------------------------------------------------------------------

# 13. Final Schema

``` text
┌──────────────────────┐
│      auth.users      │
│  (Supabase managed)  │
├──────────────────────┤
│ id                   │
│ email                │
│ ...                  │
└──────────┬───────────┘
           │
           │ 1:N
           ▼
┌──────────────────────┐
│       projects       │
├──────────────────────┤
│ id              PK   │
│ user_id         FK   │
│ name                 │
│ deadline             │
│ roadmap_md           │
│ created_at           │
│ updated_at           │
└──────────┬───────────┘
           │
           │ 1:N
           ▼
┌──────────────────────┐
│        tasks         │
├──────────────────────┤
│ id              PK   │
│ project_id      FK   │
│ title                │
│ description          │
│ due_date             │
│ status               │
│ position             │
│ created_at           │
└──────────────────────┘
```

------------------------------------------------------------------------

# 14. Source of Truth

For the current MVP, the team agrees on:

``` text
Tables:
    auth.users       ← Supabase managed
    projects
    tasks

Project contains:
    name
    deadline
    AI-generated Markdown roadmap

Task contains:
    title
    description
    due_date
    status
    position

Kanban statuses:
    todo
    doing
    done
```

**Do not change this schema casually during development. Discuss schema
changes with the backend owner first.**
