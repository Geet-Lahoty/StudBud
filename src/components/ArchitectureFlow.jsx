import { useState, useEffect } from "react";

export default function ArchitectureFlow() {
  const [seconds, setSeconds] = useState(23 * 60 + 45);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 23 * 60 + 45));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20 w-full" id="how-it-works">
      <div className="border-t border-outline-variant pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-[11px] font-mono tracking-wider uppercase text-secondary mb-3">
              <span className="material-symbols-outlined text-sm">account_tree</span>
              <span>How It Works</span>
            </div>
            <h2 className="font-editorial-heading text-2xl sm:text-4xl font-bold text-primary tracking-tight mt-1">
              The 3-Step Study Plan
            </h2>
          </div>
          <p className="font-reading text-base text-on-surface-variant max-w-lg leading-relaxed">
            Most study apps let you check off boxes without testing if you actually
            remember anything. stud bud organizes your syllabus, guides your focus sessions,
            and only marks topics done when you pass a quick quiz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Phase 01: To Do */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-outline">
                    Step 01 • To Do
                  </span>
                  <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-surface-container text-on-surface-variant">
                    Syllabus Plan
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary font-mono font-bold text-sm border border-outline-variant">
                    01
                  </span>
                  <h3 className="font-editorial-heading text-xl font-bold text-primary">
                    To Do — Course Topics
                  </h3>
                </div>
                <p className="font-reading text-sm text-on-surface-variant leading-relaxed">
                  Add your syllabus or notes. We organize topics in order so you always know
                  what to learn first.
                </p>
              </div>

              {/* Module 1 */}
              <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base">
                      dns
                    </span>
                    <span className="font-mono text-xs font-bold text-primary">
                      Distributed Systems
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded">
                    High Priority
                  </span>
                </div>
                <div className="space-y-2 text-xs font-reading text-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium">
                      • Consensus &amp; Raft
                    </span>
                    <span className="text-[10px] font-mono text-secondary font-semibold">
                      Up Next
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Vector Clocks</span>
                    <span className="text-[10px] font-mono text-outline">
                      Step 1
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Fault Tolerance</span>
                    <span className="text-[10px] font-mono text-outline">
                      Locked
                    </span>
                  </div>
                </div>
              </div>

              {/* Module 2 */}
              <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-base">
                      functions
                    </span>
                    <span className="font-mono text-xs font-bold text-primary">
                      Linear Algebra
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-outline font-medium">
                    6 Topics
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-reading text-on-surface-variant">
                  <span className="truncate">• Eigenvalues &amp; Vectors</span>
                  <span className="text-[10px] font-mono text-outline shrink-0">
                    2 Left
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-outline-variant/60 flex items-center justify-between text-xs font-mono text-on-surface-variant">
              <span className="text-outline">Topic Order</span>
              <span className="text-primary font-bold">Ready to Learn</span>
            </div>
          </div>

          {/* Phase 02: Doing (Highlighted) */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border-2 border-secondary/50 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 bg-secondary text-on-secondary px-3 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-widest shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Current Session</span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-secondary">
                    Step 02 • Active Study
                  </span>
                  <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed">
                    Session 2 of 3
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-9 h-9 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center font-mono font-bold text-sm border border-secondary/30">
                    02
                  </span>
                  <h3 className="font-editorial-heading text-xl font-bold text-primary">
                    Doing — Focused Study
                  </h3>
                </div>
                <p className="font-reading text-sm text-on-surface-variant leading-relaxed">
                  Shows what you are studying right now, paired with focused timers and a
                  quick notes area.
                </p>
              </div>

              <div className="bg-surface-container-low p-4 rounded-lg border border-secondary/30 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase font-bold text-secondary tracking-wider">
                      Current Topic
                    </span>
                    <span className="font-editorial-heading font-bold text-primary text-sm">
                      Leader Election &amp; Heartbeats
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-primary bg-surface-container px-2.5 py-1 rounded border border-outline-variant flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-secondary text-xs">
                      timer
                    </span>
                    {formatTimer(seconds)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-on-surface-variant">Focus Match</span>
                    <span className="text-secondary font-bold">Peak Focus (98%)</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded-full transition-all duration-500"
                      style={{ width: "98%" }}
                    />
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded border border-outline-variant/80 text-xs space-y-1">
                  <span className="font-mono text-[10px] uppercase text-outline font-semibold block">
                    Quick Study Note
                  </span>
                  <p className="font-reading text-on-surface leading-snug italic">
                    “Quorum size must satisfy Q &gt; N/2 to avoid split-brain across partition
                    barriers...”
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-outline-variant/60 flex items-center justify-between text-xs font-mono">
              <span className="text-secondary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">hourglass_top</span>
                Study Timer
              </span>
              <span className="text-outline font-medium">Quiz Ready in 15m</span>
            </div>
          </div>

          {/* Phase 03: Done */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-outline">
                    Step 03 • Done
                  </span>
                  <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-primary text-on-primary">
                    80% Passing Score
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary font-mono font-bold text-sm border border-outline-variant">
                    03
                  </span>
                  <h3 className="font-editorial-heading text-xl font-bold text-primary">
                    Done — Passed with 80%+
                  </h3>
                </div>
                <p className="font-reading text-sm text-on-surface-variant leading-relaxed">
                  No guessing or unchecked boxes. A topic only moves to Done after you pass a
                  quick practice quiz with at least 80% accuracy.
                </p>
              </div>

              <div className="bg-surface-container-low p-4 rounded-lg border border-secondary/30 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/60">
                  <div className="w-7 h-7 rounded bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm">lock</span>
                  </div>
                  <div className="leading-none">
                    <span className="text-[10px] font-mono uppercase font-bold text-secondary tracking-wider block">
                      Quiz Checkpoint
                    </span>
                    <span className="text-xs font-semibold text-primary font-editorial-heading">
                      5-Question Challenge
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-outline-variant/80">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-sm">
                        verified
                      </span>
                      <span className="text-primary font-medium font-sans">
                        Consistent Hashing
                      </span>
                    </div>
                    <span className="text-secondary font-bold">100% Passed</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-outline-variant/80">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-sm">
                        verified
                      </span>
                      <span className="text-primary font-medium font-sans">
                        Gossip Protocols
                      </span>
                    </div>
                    <span className="text-secondary font-bold">85% Passed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-outline-variant/60 flex items-center justify-between text-xs font-mono text-on-surface-variant">
              <span className="text-outline">Passing Rule</span>
              <span className="text-secondary font-bold">Retake If Under 80%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
