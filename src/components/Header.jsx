export default function Header({ currentPath, onNavigate, onOpenAuth }) {
  const navItems = [
    { id: "syllabus-upload", label: "Syllabus Upload" },
    { id: "study-kanban", label: "Study Kanban" },
    { id: "quiz-gate", label: "Quiz Gate" },
    { id: "landing", label: "Methodology" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f6]/92 backdrop-blur-md border-b border-outline-variant/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Left */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onNavigate("study-kanban")}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-serif font-bold text-sm">
              SG
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base text-primary leading-none font-bold">
                StudyGate
              </span>
              <span className="font-label text-[10px] uppercase text-on-surface-variant tracking-wider">
                Exam Mastery System
              </span>
            </div>
          </button>

          <div className="hidden xl:flex items-center px-2.5 py-1 bg-surface-container-low border border-outline-variant/50 rounded-lg">
            <span className="font-label text-xs text-secondary font-semibold mr-2 uppercase tracking-wide">
              Active Sprint
            </span>
            <span className="font-label text-xs text-on-surface">
              CS 201: Data Structures • 6 Days to Exam • Sprint Health: 94%
            </span>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-container-low/70 p-1 rounded-xl border border-outline-variant/40">
          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`font-label text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                  isActive
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action & Scholar Profile */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("syllabus-upload")}
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 bg-primary text-on-primary font-label text-xs uppercase tracking-wider rounded-lg hover:bg-black transition-colors shadow-xs cursor-pointer font-semibold"
          >
            + New Syllabus
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/60">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label text-xs font-bold border border-secondary/30">
              AS
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-label text-xs text-on-surface font-semibold leading-tight">
                Ananya Sharma
              </span>
              <span className="font-body text-xs text-on-surface-variant leading-none">
                Scholar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-outline-variant/40 bg-surface-container-low px-2 py-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`font-label text-[11px] uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                isActive ? "text-secondary font-bold" : "text-on-surface-variant"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
