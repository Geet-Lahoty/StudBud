import { useState, useEffect, useCallback } from "react";
import { supabase, isConfigured } from "./supabase";
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
  const [loading, setLoading] = useState(isConfigured);
  const [error, setError] = useState(null);

  // ── Auth: read session on mount + listen for changes ──
  useEffect(() => {
    if (!isConfigured) return;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  // ── Load tasks whenever the session changes ──
  const refreshTasks = useCallback(async () => {
    if (!session || !isConfigured) return;
    try {
      const data = await loadTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [session]);

  useEffect(() => {
    let ignore = false;
    if (session && isConfigured) {
      loadTasks()
        .then((data) => {
          if (!ignore) {
            setTasks(data);
            setError(null);
          }
        })
        .catch((err) => {
          if (!ignore) setError(err.message);
        });
    }
    return () => {
      ignore = true;
    };
  }, [session]);

  // ── Logout ──
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setTasks([]);
    setView("board");
  };

  // ── Missing configuration screen ──
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest border border-error/30 rounded-2xl p-8 max-w-lg shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">warning</span>
          </div>
          <h1 className="font-serif text-2xl text-primary font-bold mb-2">
            Supabase Configuration Missing
          </h1>
          <p className="font-body text-sm text-on-surface-variant mb-6 text-left leading-relaxed">
            The application cannot connect to your backend because the Supabase environment variables were not found during the deployment build.
          </p>
          <div className="bg-surface-container-low p-4 rounded-xl text-left font-mono text-xs text-on-surface mb-6 border border-outline-variant space-y-2">
            <p className="font-sans font-semibold text-secondary">
              Add these variables in your hosting dashboard (Vercel / Netlify / Cloudflare):
            </p>
            <div className="bg-surface p-2 rounded border border-outline-variant/60 select-all">
              <strong>VITE_SUPABASE_URL</strong> = https://your-project.supabase.co
            </div>
            <div className="bg-surface p-2 rounded border border-outline-variant/60 select-all">
              <strong>VITE_SUPABASE_ANON_KEY</strong> = eyJhbGci...
            </div>
          </div>
          <p className="font-body text-xs text-on-surface-variant">
            After saving these variables in your hosting settings, trigger a <strong>Redeploy</strong>.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading state ──
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

  // ── No session → auth screen ──
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

      <main className="w-full pt-28 sm:pt-20 flex-1">
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
            onDone={async () => {
              await refreshTasks();
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
