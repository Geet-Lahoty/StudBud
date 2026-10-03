/**
 * AuthScreen – Magic-link login via Supabase signInWithOtp.
 * Shown when there is no active session.
 */
import { useState } from "react";
import { supabase } from "../supabase";

export default function AuthScreen() {
  const [mode, setMode] = useState("magic"); // "magic" | "password"
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "magic") {
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (err) throw err;
        setMessage("Check your email for a magic login link!");
      } else {
        if (isSignUp) {
          const { error: err, data } = await supabase.auth.signUp({
            email,
            password,
          });
          if (err) throw err;
          if (data?.session) {
            setMessage("Account created and signed in!");
          } else {
            setMessage("Account created! You can now sign in.");
            setIsSignUp(false);
          }
        } else {
          const { error: err } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (err) throw err;
        }
      }
    } catch (err) {
      if (err.message?.toLowerCase().includes("rate limit")) {
        setError(
          "Supabase email rate limit reached. Switch to 'Password' below or increase the limit in Supabase Dashboard → Auth → Rate Limits."
        );
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
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
          {/* Auth Method Tabs */}
          <div className="flex rounded-lg bg-surface-container-low p-1 mb-5 border border-outline-variant/60">
            <button
              type="button"
              onClick={() => {
                setMode("magic");
                setError(null);
                setMessage(null);
              }}
              className={`flex-1 py-1.5 font-label text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === "magic"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("password");
                setError(null);
                setMessage(null);
              }}
              className={`flex-1 py-1.5 font-label text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === "password"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Password
            </button>
          </div>

          <h2 className="font-serif text-lg text-primary font-semibold mb-1">
            {mode === "magic"
              ? "Sign in with Magic Link"
              : isSignUp
              ? "Create an account"
              : "Sign in with password"}
          </h2>
          <p className="font-body text-xs text-on-surface-variant mb-5">
            {mode === "magic"
              ? "We'll send you a login link — no password needed."
              : isSignUp
              ? "Choose an email and password to register."
              : "Enter your email and password to log in directly."}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">
                error
              </span>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">mail</span>
              <span>{message}</span>
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

            {mode === "password" && (
              <div>
                <label
                  htmlFor="login-password"
                  className="block font-label text-xs uppercase tracking-wider text-on-surface font-semibold mb-1.5"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg text-sm focus:border-secondary focus:outline-none transition-colors"
                />
              </div>
            )}

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
                  Processing…
                </>
              ) : (
                <>
                  {mode === "magic"
                    ? "Send magic link"
                    : isSignUp
                    ? "Sign Up"
                    : "Sign In"}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>

            {mode === "password" && (
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-label text-xs text-secondary hover:underline cursor-pointer"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Need an account? Create one"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
