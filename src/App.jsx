import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import Header from "./components/Header";
import AuthScreen from "./components/AuthScreen";
import SyllabusUpload from "./pages/SyllabusUpload";
import StudyKanban from "./pages/StudyKanban";
import Timetable from "./pages/Timetable";

import { loadTasks } from "./api/tasks";

export default function App() {
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("board");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Auth: read session on mount + listen for changes ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load tasks whenever the session changes ──
  const refreshTasks = useCallback(async () => {
    if (!session) return;
    try {
      setError(null);
      const data = await loadTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }, [session]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  // ── Logout ──
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setTasks([]);
    setView("board");
  };

  // ── No session → auth screen ──
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-secondary animate-spin">
            progress_activity
          </span>
          <span className="font-label text-sm text-on-surface-variant">Loading…</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Header
        view={view}
        onNavigate={setView}
        onLogout={handleLogout}
        userEmail={session.user?.email}
      />

      <main className="w-full pt-16 flex-1">
        {error && (
          <div className="max-w-3xl mx-auto mt-4 px-4">
            <div className="p-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-auto font-label text-xs font-semibold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {view === "upload" && (
          <SyllabusUpload
            onDone={() => {
              refreshTasks();
              setView("board");
            }}
          />
        )}

        {view === "board" && (
          <StudyKanban
            tasks={tasks}
            refreshTasks={refreshTasks}
            onNavigate={setView}
          />
        )}

        {view === "timetable" && (
          <Timetable tasks={tasks} onNavigate={setView} />
        )}
      </main>
    </div>
  );
}
