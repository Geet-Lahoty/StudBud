import { BENCHMARKS } from "../data/content";

export default function MethodologyComparison() {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-8 pb-20 w-full"
      id="methodology-comparison"
    >
      <div className="border-t border-outline-variant pt-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-secondary">
            Why Active Practice Wins
          </span>
          <h2 className="font-editorial-heading text-3xl sm:text-4xl font-bold text-primary tracking-tight mt-1">
            Active Practice vs. Rereading Notes
          </h2>
          <p className="font-reading text-base text-on-surface-variant mt-2 leading-relaxed">
            Simply rereading notes gives an illusion of knowing the material. Quick
            checkpoints prove you can actually recall concepts when it counts.
          </p>
        </div>

        {/* 2-Column Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-8">
          {/* Left Column: Traditional Checklists */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-error-container text-error flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">trending_down</span>
                  </span>
                  <div>
                    <h3 className="font-editorial-heading text-lg font-bold text-primary">
                      Rereading Notes
                    </h3>
                    <span className="font-mono text-[10px] uppercase text-outline tracking-wider">
                      Passive Study
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-error-container text-on-error-container font-bold">
                  Traditional Habit
                </span>
              </div>

              {/* SVG Forgetting Curve */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-outline uppercase tracking-wider font-semibold">
                    Forgetting Curve (Fast Drop)
                  </span>
                  <span className="text-error font-bold">Steep 30-Day Drop</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                  <svg className="w-full h-28" viewBox="0 0 320 100">
                    <defs>
                      <linearGradient id="ebbinghausDrop" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line
                      stroke="#e7e5e4"
                      strokeDasharray="3,3"
                      strokeWidth="1"
                      x1="20"
                      x2="300"
                      y1="20"
                      y2="20"
                    />
                    <line
                      stroke="#e7e5e4"
                      strokeDasharray="3,3"
                      strokeWidth="1"
                      x1="20"
                      x2="300"
                      y1="85"
                      y2="85"
                    />
                    <path
                      d="M 20 20 Q 60 25 90 58 T 190 78 T 300 84 L 300 95 L 20 95 Z"
                      fill="url(#ebbinghausDrop)"
                    />
                    <path
                      d="M 20 20 Q 60 25 90 58 T 190 78 T 300 84"
                      fill="transparent"
                      stroke="#ba1a1a"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    />
                    <circle cx="20" cy="20" fill="#ba1a1a" r="3.5" />
                    <text
                      fill="#1f2421"
                      fontFamily="monospace"
                      fontSize="9"
                      fontWeight="700"
                      x="26"
                      y="16"
                    >
                      Day 1: 100%
                    </text>
                    <circle cx="95" cy="60" fill="#ba1a1a" r="3.5" />
                    <text
                      fill="#71717a"
                      fontFamily="monospace"
                      fontSize="9"
                      x="103"
                      y="58"
                    >
                      Day 7: 45%
                    </text>
                    <circle cx="285" cy="84" fill="#ba1a1a" r="3.5" />
                    <text
                      fill="#ba1a1a"
                      fontFamily="monospace"
                      fontSize="9"
                      fontWeight="700"
                      x="210"
                      y="94"
                    >
                      Day 30: 32% Memory
                    </text>
                  </svg>
                  <div className="flex justify-between text-[10px] font-mono text-on-surface-variant pt-2 border-t border-outline-variant mt-1">
                    <span>Day 0 (Cramming)</span>
                    <span>Day 14 (Rapid Decay)</span>
                    <span className="text-error font-semibold">Forgotten by Exam</span>
                  </div>
                </div>
              </div>

              {/* Drawbacks */}
              <ul className="space-y-3 font-reading text-sm text-on-surface-variant mb-6">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-error-container text-error flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </span>
                  <span>
                    <strong className="text-primary font-medium font-sans">
                      False Sense of Fluency:
                    </strong>{" "}
                    Looking at notes feels easy, but doesn't mean you can recall answers on test day.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-error-container text-error flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </span>
                  <span>
                    <strong className="text-primary font-medium font-sans">
                      Hidden Blindspots:
                    </strong>{" "}
                    It's easy to avoid difficult proofs and review comfortable concepts over and over.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-error-container text-error flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </span>
                  <span>
                    <strong className="text-primary font-medium font-sans">
                      Stressful Cramming:
                    </strong>{" "}
                    Unpaced studying leads to chaotic midnight sprints and tired exam mornings.
                  </span>
                </li>
              </ul>
            </div>

            {/* Retention Bar */}
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-outline uppercase tracking-wider font-semibold">
                  Exam Retention
                </span>
                <span className="text-error font-bold">32% (Passive Drop-off)</span>
              </div>
              <div className="w-full bg-outline-variant h-3 rounded-full overflow-hidden">
                <div className="bg-error h-full rounded-full" style={{ width: "32%" }} />
              </div>
            </div>
          </div>

          {/* Right Column: The stud bud Standard */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border-2 border-secondary/40 flex flex-col justify-between shadow-md relative">
            <div className="absolute -top-3 right-6 bg-secondary text-on-secondary px-3 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-widest shadow-xs">
              Proven Results
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">verified</span>
                  </span>
                  <div>
                    <h3 className="font-editorial-heading text-lg font-bold text-primary">
                      The stud bud Way
                    </h3>
                    <span className="font-mono text-[10px] uppercase text-secondary font-bold tracking-wider">
                      Active Recall &amp; Proof
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-secondary text-on-secondary font-bold">
                  80% Quiz Checkpoints
                </span>
              </div>

              {/* Spaced Retrieval Saw-tooth Graph */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-secondary font-bold uppercase tracking-wider">
                    Spaced Practice &amp; Retention
                  </span>
                  <span className="text-secondary font-bold">88% Long-Term Memory</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg border border-secondary/30">
                  <svg className="w-full h-28" viewBox="0 0 320 100">
                    <defs>
                      <linearGradient id="spacedRetrievalFill" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#c85a32" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#c85a32" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line
                      stroke="#e7e5e4"
                      strokeDasharray="3,3"
                      strokeWidth="1"
                      x1="20"
                      x2="300"
                      y1="25"
                      y2="25"
                    />
                    <path
                      d="M 20 20 Q 38 35 48 48 L 52 24 Q 85 38 102 46 L 106 23 Q 150 30 180 38 L 184 22 Q 240 26 300 27 L 300 95 L 20 95 Z"
                      fill="url(#spacedRetrievalFill)"
                    />
                    <path
                      d="M 20 20 Q 38 35 48 48 L 52 24 Q 85 38 102 46 L 106 23 Q 150 30 180 38 L 184 22 Q 240 26 300 27"
                      fill="transparent"
                      stroke="#c85a32"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                    <circle cx="52" cy="24" fill="#c85a32" r="3" />
                    <circle cx="106" cy="23" fill="#c85a32" r="3" />
                    <circle cx="184" cy="22" fill="#c85a32" r="3" />
                    <circle cx="300" cy="27" fill="#c85a32" r="3.5" />
                    <text
                      fill="#1f2421"
                      fontFamily="monospace"
                      fontSize="9"
                      fontWeight="700"
                      x="180"
                      y="16"
                    >
                      Day 30: 88% Retention
                    </text>
                  </svg>
                  <div className="flex justify-between text-[10px] font-mono text-secondary pt-2 border-t border-outline-variant mt-1">
                    <span>Quiz 1 (Day 1)</span>
                    <span>Quiz 2 (Day 3)</span>
                    <span>Quiz 3 (Day 7)</span>
                    <span className="font-bold">Locked in Memory</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <ul className="space-y-3 font-reading text-sm text-on-surface mb-6">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </span>
                  <span>
                    <strong className="text-primary font-medium font-sans">
                      80% Passing Rule:
                    </strong>{" "}
                    You only move to the next chapter once you score 4 out of 5 on a practice quiz.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </span>
                  <span>
                    <strong className="text-primary font-medium font-sans">
                      Prerequisites in Order:
                    </strong>{" "}
                    Topics are arranged in logical order so you don't struggle on advanced problems.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </span>
                  <span>
                    <strong className="text-primary font-medium font-sans">
                      Energy-Matched Sessions:
                    </strong>{" "}
                    Hard concepts are studied when your brain is sharpest, avoiding burnout.
                  </span>
                </li>
              </ul>
            </div>

            {/* Retention Bar */}
            <div className="p-4 rounded-lg bg-surface-container-low border border-secondary/30">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-primary font-bold uppercase tracking-wider">
                  Exam Retention
                </span>
                <span className="text-secondary font-bold">
                  88% (+56% Higher Recall)
                </span>
              </div>
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: "88%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Scorecard Benchmark Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-container-low p-6 rounded-xl border border-outline-variant">
          {BENCHMARKS.map((benchmark) => (
            <div
              key={benchmark.title}
              className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant text-center"
            >
              <span className="text-[11px] font-mono uppercase text-outline tracking-wider block mb-1">
                {benchmark.title}
              </span>
              <div className="flex items-center justify-center gap-3 font-mono text-sm">
                <span className={benchmark.beforeClass}>{benchmark.before}</span>
                <span className="text-outline">→</span>
                <span className={benchmark.afterClass}>{benchmark.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
