/**
 * StudyKanban – Board view with three columns (To Do / In Progress / Done).
 *
 * Props:
 *   tasks        – array of task objects from Supabase
 *   refreshTasks – callback to reload tasks
 *   onNavigate   – navigate to another view
 */
import { useState } from "react";
import { updateTaskStatus } from "../api/tasks";
import QuizModal from "../components/QuizModal";

// 8 colors for subject badges — picked by hashing the subject name
const SUBJECT_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-800",
  "bg-purple-100 text-purple-800",
  "bg-rose-100 text-rose-800",
  "bg-cyan-100 text-cyan-800",
  "bg-orange-100 text-orange-800",
  "bg-indigo-100 text-indigo-800",
];

function subjectColor(subject) {
  let hash = 0;
  const str = subject || "";
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

// Urgency badge from exam_date
function urgencyBadge(examDate) {
  if (!examDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate + "T00:00:00");
  const days = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

  if (days <= 2) return { label: `${days}d left`, cls: "bg-error text-on-error" };
  if (days <= 7) return { label: `${days}d left`, cls: "bg-amber-500 text-white" };
  return { label: `${days}d left`, cls: "bg-tertiary-fixed text-on-tertiary-fixed" };
}

function Column({ title, count, dotColor, items, renderCard }) {
  return (
    <div className="flex flex-col bg-surface-container-low rounded-2xl p-4 xl:p-5 shadow-sm border border-outline-variant/80">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-outline-variant/40">
        <span className={`w-3 h-3 rounded-full ${dotColor}`} />
        <h2 className="font-serif text-lg text-primary font-semibold">{title}</h2>
        <span className="px-2 py-0.5 rounded-full font-label text-xs bg-surface-container-highest text-on-surface-variant font-medium">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="font-body text-xs text-on-surface-variant text-center py-6">
            No tasks
          </p>
        )}
        {items.map(renderCard)}
      </div>
    </div>
  );
}

export default function StudyKanban({ tasks, refreshTasks, onNavigate }) {
  const [filter, setFilter] = useState("all");
  const [quizTask, setQuizTask] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // task id being acted on

  // Split tasks by status
  const allSubjects = [...new Set(tasks.map((t) => t.subject).filter(Boolean))];
  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.subject === filter);
  const todo = filtered.filter((t) => t.status === "todo");
  const inProgress = filtered.filter((t) => t.status === "in_progress");
  const done = filtered.filter((t) => t.status === "done");

  // Move task to "in_progress"
  const handleStart = async (task) => {
    try {
      setActionLoading(task.id);
      await updateTaskStatus(task.id, "in_progress");
      await refreshTasks();
    } catch {
      // error shown at app level
    } finally {
      setActionLoading(null);
    }
  };

  // Open quiz modal for an in-progress task
  const handleTakeQuiz = (task) => {
    setQuizTask(task);
  };

  const handleQuizPass = async () => {
    setQuizTask(null);
    await refreshTasks();
  };

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
          view_kanban
        </span>
        <h2 className="font-serif text-2xl text-primary font-semibold mb-2">
          No tasks yet
        </h2>
        <p className="font-body text-sm text-on-surface-variant max-w-sm mb-6">
          Upload a syllabus image to generate your study plan.
        </p>
        <button
          type="button"
          onClick={() => onNavigate("upload")}
          className="px-6 py-3 bg-primary text-on-primary rounded-lg font-label text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-sm"
        >
          Upload Syllabus
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto">
      {/* Subject filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full font-label text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            filter === "all"
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface"
          }`}
        >
          All ({tasks.length})
        </button>
        {allSubjects.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full font-label text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              filter === s
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Column
          title="To Do"
          count={todo.length}
          dotColor="bg-outline-variant"
          items={todo}
          renderCard={(task) => (
            <article
              key={task.id}
              className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/60"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`px-2 py-0.5 rounded font-label text-[11px] font-semibold ${subjectColor(task.subject)}`}>
                  {task.subject}
                </span>
                {urgencyBadge(task.exam_date) && (
                  <span className={`px-1.5 py-0.5 rounded font-label text-[10px] font-bold ${urgencyBadge(task.exam_date).cls}`}>
                    {urgencyBadge(task.exam_date).label}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-sm text-primary font-medium mb-1">
                {task.title}
              </h3>
              <div className="flex items-center gap-2 text-on-surface-variant font-body text-xs mb-3">
                <span>{task.study_date}</span>
                {task.type !== "study" && (
                  <span className="px-1.5 py-0.5 rounded bg-surface-container font-label text-[10px] uppercase">
                    {task.type}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleStart(task)}
                disabled={actionLoading === task.id}
                className="w-full py-2 bg-primary text-on-primary rounded-lg font-label text-xs uppercase font-semibold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1"
              >
                {actionLoading === task.id ? "Starting…" : "Start"}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </article>
          )}
        />

        <Column
          title="In Progress"
          count={inProgress.length}
          dotColor="bg-secondary"
          items={inProgress}
          renderCard={(task) => (
            <article
              key={task.id}
              className="bg-surface-container-lowest p-4 rounded-xl shadow-md border border-outline-variant/60"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`px-2 py-0.5 rounded font-label text-[11px] font-semibold ${subjectColor(task.subject)}`}>
                  {task.subject}
                </span>
                {urgencyBadge(task.exam_date) && (
                  <span className={`px-1.5 py-0.5 rounded font-label text-[10px] font-bold ${urgencyBadge(task.exam_date).cls}`}>
                    {urgencyBadge(task.exam_date).label}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-sm text-primary font-semibold mb-1">
                {task.title}
              </h3>
              <div className="flex items-center gap-2 text-on-surface-variant font-body text-xs mb-3">
                <span>{task.study_date}</span>
                {task.type !== "study" && (
                  <span className="px-1.5 py-0.5 rounded bg-surface-container font-label text-[10px] uppercase">
                    {task.type}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleTakeQuiz(task)}
                className="w-full py-2 bg-secondary text-on-secondary rounded-lg font-label text-xs uppercase font-semibold cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">school</span>
                Take quiz to finish
              </button>
            </article>
          )}
        />

        <Column
          title="Done"
          count={done.length}
          dotColor="bg-on-tertiary-container"
          items={done}
          renderCard={(task) => (
            <article
              key={task.id}
              className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/60"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`px-2 py-0.5 rounded font-label text-[11px] font-semibold ${subjectColor(task.subject)}`}>
                  {task.subject}
                </span>
                {task.quiz_score != null && (
                  <span className="px-1.5 py-0.5 rounded font-label text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">
                    Score: {task.quiz_score}/5
                  </span>
                )}
              </div>
              <h3 className="font-serif text-sm text-primary font-medium mb-1">
                {task.title}
              </h3>
              <div className="flex items-center gap-2 text-on-surface-variant font-body text-xs">
                <span>{task.study_date}</span>
                {task.type !== "study" && (
                  <span className="px-1.5 py-0.5 rounded bg-surface-container font-label text-[10px] uppercase">
                    {task.type}
                  </span>
                )}
              </div>
            </article>
          )}
        />
      </div>

      {/* Quiz modal */}
      {quizTask && (
        <QuizModal
          task={quizTask}
          onClose={() => setQuizTask(null)}
          onPass={handleQuizPass}
        />
      )}
    </div>
  );
}
