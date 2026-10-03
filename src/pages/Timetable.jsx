/**
 * Timetable – Computed from loaded tasks with local date math.
 *
 * Props:
 *   tasks      – array of task objects from Supabase
 *   onNavigate – function to switch views (e.g. "board", "upload")
 */
import { useMemo } from "react";

// Subject color hashing to match Kanban board
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
  for (let i = 0; i < (subject || "").length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

function getTodayLocalDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getUpcomingLocalDateStrings() {
  const dates = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
}

export default function Timetable({ tasks = [], onNavigate }) {
  const todayStr = useMemo(() => getTodayLocalDateString(), []);
  const upcomingDateStrings = useMemo(() => getUpcomingLocalDateStrings(), []);

  // Filter tasks into categories
  const dueToday = useMemo(
    () => tasks.filter((t) => t.study_date === todayStr),
    [tasks, todayStr]
  );

  const doneToday = useMemo(
    () => tasks.filter((t) => t.study_date === todayStr && t.status === "done"),
    [tasks, todayStr]
  );

  const behindSchedule = useMemo(
    () =>
      tasks.filter(
        (t) => t.study_date && t.study_date < todayStr && t.status !== "done"
      ),
    [tasks, todayStr]
  );

  const totalTasks = tasks.length;
  const totalDone = useMemo(
    () => tasks.filter((t) => t.status === "done").length,
    [tasks]
  );
  const completionPercentage =
    totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  // Group upcoming tasks by date
  const upcomingGrouped = useMemo(() => {
    const groups = {};
    for (const dStr of upcomingDateStrings) {
      groups[dStr] = [];
    }
    for (const t of tasks) {
      if (t.study_date && upcomingDateStrings.includes(t.study_date)) {
        groups[t.study_date].push(t);
      }
    }
    return groups;
  }, [tasks, upcomingDateStrings]);

  const formatDateDisplay = (dateStr) => {
    try {
      const parts = dateStr.split("-");
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
          calendar_month
        </span>
        <h2 className="font-serif text-2xl text-primary font-semibold mb-2">
          No schedule available
        </h2>
        <p className="font-body text-sm text-on-surface-variant max-w-sm mb-6">
          Upload a syllabus to generate your study timetable.
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
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 max-w-6xl mx-auto space-y-8">
      {/* Title & Overall Progress */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
              Study Timetable
            </h1>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
              Today is{" "}
              <span className="font-semibold text-primary">
                {formatDateDisplay(todayStr)}
              </span>
            </p>
          </div>
          <div className="text-right sm:text-right">
            <span className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Overall Progress
            </span>
            <div className="font-serif text-2xl font-bold text-secondary">
              {completionPercentage}%{" "}
              <span className="text-xs font-normal text-on-surface-variant">
                ({totalDone}/{totalTasks} tasks)
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary transition-all duration-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Due Today */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">today</span>
          </div>
          <div>
            <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Due Today
            </span>
            <div className="font-serif text-2xl font-bold text-primary">
              {dueToday.length}
            </div>
          </div>
        </div>

        {/* Done Today */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
          <div>
            <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Done Today
            </span>
            <div className="font-serif text-2xl font-bold text-emerald-800">
              {doneToday.length}
            </div>
          </div>
        </div>

        {/* Behind Schedule */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Behind Schedule
            </span>
            <div className="font-serif text-2xl font-bold text-error">
              {behindSchedule.length}
            </div>
          </div>
        </div>
      </div>

      {/* Behind Schedule Section (Red accent with actions) */}
      {behindSchedule.length > 0 && (
        <section className="bg-error-container/20 border border-error/40 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-error/20">
            <span className="material-symbols-outlined text-error text-xl">
              notification_important
            </span>
            <h2 className="font-serif text-lg text-error font-semibold">
              Behind Schedule ({behindSchedule.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {behindSchedule.map((task) => (
              <div
                key={task.id}
                className="bg-surface-container-lowest p-4 rounded-xl border border-error/30 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded font-label text-[11px] font-semibold ${subjectColor(
                        task.subject
                      )}`}
                    >
                      {task.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded font-label text-[10px] font-bold bg-error text-on-error">
                      Overdue (due {task.study_date})
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-primary mb-1">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 text-on-surface-variant font-body text-xs mb-3">
                    <span className="capitalize">Status: {task.status.replace("_", " ")}</span>
                    {task.type !== "study" && (
                      <span className="px-1.5 py-0.5 rounded bg-surface-container font-label text-[10px] uppercase">
                        {task.type}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("board")}
                  className="w-full py-2 bg-error text-on-error rounded-lg font-label text-xs uppercase font-semibold cursor-pointer hover:bg-error/90 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Go to Board to Complete</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Today's Tasks Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/40">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <h2 className="font-serif text-lg text-primary font-semibold">
              Today&apos;s Plan ({dueToday.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("board")}
            className="font-label text-xs uppercase font-semibold text-secondary hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Open Board</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {dueToday.length === 0 ? (
          <p className="font-body text-sm text-on-surface-variant py-6 text-center">
            No tasks scheduled for today. Great job or plan ahead!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dueToday.map((task) => {
              const isDone = task.status === "done";
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isDone
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-surface-container-low border-outline-variant/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded font-label text-[11px] font-semibold ${subjectColor(
                        task.subject
                      )}`}
                    >
                      {task.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-label text-[10px] font-bold uppercase ${
                        isDone
                          ? "bg-emerald-100 text-emerald-800"
                          : task.status === "in_progress"
                          ? "bg-secondary-fixed text-on-secondary-fixed"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-primary mb-2">
                    {task.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="uppercase font-label text-[10px]">
                      {task.type}
                    </span>
                    {task.quiz_score != null && (
                      <span className="font-semibold text-emerald-800">
                        Score: {task.quiz_score}/5
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Upcoming (Next 7 Days) */}
      <section className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 mb-6 border-b border-outline-variant/40">
          <span className="material-symbols-outlined text-primary text-xl">
            date_range
          </span>
          <h2 className="font-serif text-lg text-primary font-semibold">
            Upcoming Schedule (Next 7 Days)
          </h2>
        </div>

        <div className="space-y-6">
          {upcomingDateStrings.map((dStr) => {
            const dateTasks = upcomingGrouped[dStr] || [];
            return (
              <div key={dStr} className="border-l-2 border-secondary/40 pl-4 py-1">
                <h3 className="font-serif text-sm font-bold text-primary mb-2">
                  {formatDateDisplay(dStr)}{" "}
                  <span className="text-xs font-normal font-body text-on-surface-variant">
                    ({dateTasks.length} {dateTasks.length === 1 ? "task" : "tasks"})
                  </span>
                </h3>
                {dateTasks.length === 0 ? (
                  <p className="font-body text-xs text-on-surface-variant italic">
                    No tasks scheduled
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dateTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/60"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`px-2 py-0.5 rounded font-label text-[10px] font-semibold ${subjectColor(
                              task.subject
                            )}`}
                          >
                            {task.subject}
                          </span>
                          <span className="font-label text-[10px] uppercase text-on-surface-variant">
                            {task.type}
                          </span>
                        </div>
                        <h4 className="font-serif text-xs font-medium text-primary line-clamp-2">
                          {task.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
