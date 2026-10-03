export default function IntellectualRigor() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20 w-full" id="intellectual-rigor">
      <div className="border-t border-outline-variant pt-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-[11px] font-mono uppercase tracking-wider text-on-surface-variant mb-3">
            <span className="material-symbols-outlined text-secondary text-sm">
              psychology
            </span>
            <span>Study Science</span>
          </div>
          <h2 className="font-editorial-heading text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            Built on Proven Study Science.
          </h2>
          <p className="font-reading text-base sm:text-lg text-on-surface-variant mt-3 leading-relaxed">
            Designed around how your brain actually learns: active quiz practice, step-by-step
            topic order, and studying during your highest-energy hours.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Smart Syllabus Breakdown */}
          <div className="bg-surface-container-lowest rounded-xl p-7 border border-outline-variant shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-lg">schema</span>
                  </span>
                  <div>
                    <h3 className="font-editorial-heading text-base font-bold text-primary">
                      Smart Syllabus Plan
                    </h3>
                    <span className="font-mono text-[10px] uppercase text-outline tracking-wider">
                      Step-by-Step Order
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-primary text-[10px] font-mono font-bold uppercase">
                  Plan Ready
                </span>
              </div>

              {/* Progress Visual */}
              <div className="space-y-3 bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-primary font-semibold">Unit 1: Combinatorics</span>
                    <span className="text-secondary font-bold">100% Passed</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-primary font-semibold">
                      Unit 2: Dynamic Programming
                    </span>
                    <span className="text-primary font-bold">84% Passed</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "84%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-outline">Unit 3: Graph Traversal</span>
                    <span className="text-outline font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">lock</span>
                      Locked Until Ready
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-outline-variant h-full rounded-full" style={{ width: "20%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-outline-variant/60 flex items-center gap-2 text-xs font-mono text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Clear prerequisite order with zero guesswork</span>
            </div>
          </div>

          {/* Column 2: 80% Quiz Checkpoints */}
          <div
            className="bg-surface-container-lowest rounded-xl p-7 border border-outline-variant shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            id="quiz-gates"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-lg">verified_user</span>
                  </span>
                  <div>
                    <h3 className="font-editorial-heading text-base font-bold text-primary">
                      80% Quiz Checkpoints
                    </h3>
                    <span className="font-mono text-[10px] uppercase text-outline tracking-wider">
                      Passing Score
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-mono font-bold uppercase">
                  4/5 Target
                </span>
              </div>

              {/* Radial Gauge */}
              <div className="flex flex-col items-center justify-center py-2 relative">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#efeeeb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#e7e5e4"
                      strokeDasharray="251.2"
                      strokeDashoffset="90.4"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#c85a32"
                      strokeDasharray="251.2"
                      strokeDashoffset="50.24"
                      strokeLinecap="round"
                      strokeWidth="8"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-editorial-heading text-3xl font-bold text-primary leading-none">
                      80%
                    </span>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-secondary font-bold mt-1">
                      Passing Score
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/60 text-center">
              <p className="font-reading text-xs text-on-surface-variant leading-snug">
                <span className="font-semibold text-primary">
                  Just rereading notes averages only 64% retention;
                </span>{" "}
                quick checkpoints make sure you actually remember the material on exam day.
              </p>
            </div>
          </div>

          {/* Column 3: Daily Study Schedule */}
          <div className="bg-surface-container-lowest rounded-xl p-7 border border-outline-variant shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-lg">vital_signs</span>
                  </span>
                  <div>
                    <h3 className="font-editorial-heading text-base font-bold text-primary">
                      Daily Study Schedule
                    </h3>
                    <span className="font-mono text-[10px] uppercase text-outline tracking-wider">
                      Peak Focus Hours
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-mono font-bold uppercase">
                  Auto-Timed
                </span>
              </div>

              {/* Wave Curve */}
              <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant">
                <svg className="w-full h-24" viewBox="0 0 240 80">
                  <defs>
                    <linearGradient id="circadianFill" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#c85a32" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#c85a32" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line
                    stroke="#e7e5e4"
                    strokeWidth="1"
                    x1="10"
                    x2="230"
                    y1="65"
                    y2="65"
                  />
                  <path
                    d="M 10 55 Q 55 12 95 30 T 170 48 T 225 65 L 225 70 L 10 70 Z"
                    fill="url(#circadianFill)"
                  />
                  <path
                    d="M 10 55 Q 55 12 95 30 T 170 48 T 225 65"
                    fill="transparent"
                    stroke="#c85a32"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                  <circle cx="65" cy="22" fill="#c85a32" r="3.5" />
                  <text
                    fill="#1f2421"
                    fontFamily="'Work Sans', sans-serif"
                    fontSize="8"
                    fontWeight="700"
                    textAnchor="middle"
                    x="63"
                    y="14"
                  >
                    Peak Focus
                  </text>
                  <circle cx="130" cy="38" fill="#747874" r="3" />
                  <text
                    fill="#747874"
                    fontFamily="'Work Sans', sans-serif"
                    fontSize="8"
                    fontWeight="600"
                    textAnchor="middle"
                    x="130"
                    y="30"
                  >
                    Review
                  </text>
                  <circle cx="200" cy="58" fill="#747874" r="3" />
                  <text
                    fill="#747874"
                    fontFamily="'Work Sans', sans-serif"
                    fontSize="8"
                    fontWeight="600"
                    textAnchor="middle"
                    x="200"
                    y="52"
                  >
                    Rest
                  </text>
                </svg>

                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant pt-2 border-t border-outline-variant">
                  <span>08:00 AM Deep Focus</span>
                  <span>02:00 PM Quick Review</span>
                  <span>10:00 PM Rest</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-outline-variant/60 flex items-center gap-2 text-xs font-mono text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Avoids late-night burnout by studying when you are alert</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
