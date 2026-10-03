import { TRUST_METRICS } from "../data/content";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-16">
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-[11px] font-mono tracking-wider uppercase text-on-surface-variant mb-6">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-bold text-primary">Smart Study System</span>
          <span className="text-outline-variant">•</span>
          <span className="text-secondary font-semibold">80% Passing Score</span>
        </div>

        {/* Editorial Serif Headline */}
        <h1 className="font-editorial-heading text-4xl sm:text-5xl lg:text-[58px] lg:leading-[66px] font-bold text-primary tracking-tight">
          Master Your Syllabus.
          <br />
          <span className="italic font-normal text-secondary font-editorial-heading">
            Prove It at the Gate.
          </span>
        </h1>

        {/* Body Copy - Clear and Easy Vocabulary */}
        <p className="font-reading text-lg sm:text-xl text-on-surface-variant mt-6 leading-relaxed max-w-2xl">
          stud bud replaces passive reading with clear syllabus plans, focused study
          sessions, and quick quizzes that prove you truly know your stuff.
        </p>

        {/* Trust Metrics Pill */}
        <div className="flex items-center justify-center flex-wrap gap-4 text-xs font-mono text-on-surface-variant mt-10 pt-6 border-t border-outline-variant/80 w-full max-w-xl mx-auto">
          {TRUST_METRICS.map((metric, idx) => (
            <div key={metric.label} className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-sm">
                  {metric.icon}
                </span>
                {metric.label}
              </span>
              {idx < TRUST_METRICS.length - 1 && (
                <span className="text-outline-variant">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
