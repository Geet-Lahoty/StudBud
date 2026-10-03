/**
 * Header – Top navigation bar.
 * Shows Board / Timetable / Upload tabs, user email, and logout.
 */
export default function Header({ view, onNavigate, onLogout, userEmail }) {
  const tabs = [
    { id: "board", label: "Board", icon: "view_kanban" },
    { id: "timetable", label: "Timetable", icon: "calendar_month" },
    { id: "upload", label: "Upload", icon: "upload_file" },
  ];

  // Show first two letters of email as avatar
  const initials = (userEmail || "??").slice(0, 2).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f6]/92 backdrop-blur-md border-b border-outline-variant/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate("board")}
          className="flex items-center gap-2.5 cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-serif font-bold text-sm">
            SG
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base text-primary leading-none font-bold">
              StudyGate
            </span>
            <span className="font-label text-[10px] uppercase text-on-surface-variant tracking-wider">
              Exam Prep System
            </span>
          </div>
        </button>

        {/* Center nav tabs */}
        <nav className="hidden sm:flex items-center gap-1 bg-surface-container-low/70 p-1 rounded-xl border border-outline-variant/40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`flex items-center gap-1.5 font-label text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                view === tab.id
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right: user + logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/60">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label text-xs font-bold border border-secondary/30">
              {initials}
            </div>
            <span className="hidden lg:inline font-label text-xs text-on-surface truncate max-w-[140px]">
              {userEmail}
            </span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-label text-xs text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
            title="Log out"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex items-center justify-around border-t border-outline-variant/40 bg-surface-container-low px-2 py-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors cursor-pointer ${
              view === tab.id
                ? "text-secondary font-bold"
                : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            <span className="font-label text-[10px] uppercase">{tab.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
