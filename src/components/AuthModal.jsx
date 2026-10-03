import { useState, useEffect } from "react";

export default function AuthModal({ initialTab = "login", onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "enroll") {
      setSuccessMessage("Scholar enrollment registered. Access key generated.");
    } else {
      setSuccessMessage("Scholar authenticated successfully. Redirecting to Timetable...");
    }
    setTimeout(() => {
      onClose();
      setSuccessMessage("");
    }, 1500);
  };

  const handleSsoClick = (provider) => {
    alert(`Redirecting to ${provider}...`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="bg-surface-container-lowest rounded-xl shadow-2xl p-8 max-w-md w-full relative border border-outline-variant"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-outline hover:text-primary p-1 rounded focus:outline-hidden cursor-pointer"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Modal Tabs: Existing Scholar vs New Scholar */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="auth-modal-title"
              onClick={() => setActiveTab("login")}
              className={`text-xs uppercase font-semibold tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeTab === "login"
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Existing Scholar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("enroll")}
              className={`text-xs uppercase font-semibold tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeTab === "enroll"
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              New Scholar
            </button>
          </div>
          <span className="font-mono text-[10px] text-outline font-semibold">
            SECURE-TLS
          </span>
        </div>

        {/* Success Alert Banner if submitted */}
        {successMessage ? (
          <div className="p-4 rounded-lg bg-secondary-fixed/50 border border-secondary text-on-secondary-fixed text-xs font-mono text-center mb-4">
            <span className="material-symbols-outlined text-sm inline-block mr-1.5 align-middle">
              verified
            </span>
            {successMessage}
          </div>
        ) : (
          /* Auth Form */
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="scholar-email"
                className="block text-xs uppercase font-semibold tracking-wider text-on-surface mb-1.5"
              >
                Institutional Email
              </label>
              <div className="relative">
                <input
                  id="scholar-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scholar@university.edu"
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2.5 rounded text-sm focus:bg-surface-container-lowest focus:border-secondary focus:outline-hidden transition-all"
                />
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline text-lg pointer-events-none">
                  school
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="scholar-passkey"
                  className="block text-xs uppercase font-semibold tracking-wider text-on-surface"
                >
                  Vault Passkey
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Passkey recovery link dispatched to institutional email.");
                  }}
                  className="text-xs text-secondary hover:underline font-mono"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  id="scholar-passkey"
                  type="password"
                  required
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2.5 rounded text-sm focus:bg-surface-container-lowest focus:border-secondary focus:outline-hidden transition-all"
                />
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline text-lg pointer-events-none">
                  key
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded bg-primary text-on-primary text-xs uppercase font-semibold tracking-wider hover:bg-black shadow transition-all flex items-center justify-center gap-2 active:translate-y-px mt-2 cursor-pointer"
            >
              <span>
                {activeTab === "enroll"
                  ? "Create Scholar Account"
                  : "Log In & Access Timetable"}
              </span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>
        )}

        {/* University SSO / Federated Login Buttons */}
        <div className="mt-6 pt-4 border-t border-outline-variant">
          <span className="block text-center text-[10px] font-mono uppercase tracking-wider text-outline mb-3">
            Institutional Single Sign-On
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSsoClick("University SSO Gateway")}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant text-primary text-xs font-semibold tracking-wider transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">account_balance</span>
              <span>University SSO</span>
            </button>
            <button
              type="button"
              onClick={() => handleSsoClick("Google Student Workspace")}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant text-primary text-xs font-semibold tracking-wider transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-secondary">
                verified_user
              </span>
              <span>Google Student</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
