/**
 * AuthScreen – Magic-link login via Supabase signInWithOtp.
 * Shown when there is no active session.
 */
import { useState } from "react";
import { supabase } from "../supabase";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: err } = await supabase.auth.signInWithOtp({ email });
      if (err) throw err;
      setMessage("Check your email for a magic login link!");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center font-serif font-bold text-xl mx-auto mb-3">
            SG
          </div>
          <h1 className="font-serif text-3xl text-primary font-bold">
            StudyGate
          </h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Exam prep, powered by AI. Log in to get started.
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-md p-6 sm:p-8">
          <h2 className="font-serif text-lg text-primary font-semibold mb-1">
            Sign in with email
          </h2>
          <p className="font-body text-xs text-on-surface-variant mb-5">
            We'll send you a magic link — no password needed.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">mail</span>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="login-email"
                className="block font-label text-xs uppercase tracking-wider text-on-surface font-semibold mb-1.5"
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg text-sm focus:border-secondary focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg bg-primary text-on-primary font-label text-xs uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                  Sending link…
                </>
              ) : (
                <>
                  Send magic link
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
