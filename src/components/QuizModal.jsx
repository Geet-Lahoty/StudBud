/**
 * QuizModal – 5-question MCQ gate for moving a task to Done.
 *
 * Props:
 *   task        – the task object { id, title, subject, … }
 *   onClose     – close without changes
 *   onPass      – called after quiz is passed and data saved
 */
import { useState, useEffect } from "react";
import { generateQuiz } from "../api/ai";
import { saveQuizAttempt, markTaskDone } from "../api/tasks";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export default function QuizModal({ task, onClose, onPass }) {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quiz play state
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState([]); // array of { correct: boolean }

  // End screen
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load questions
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const quiz = await generateQuiz(task.subject, task.title);
        if (!cancelled) setQuestions(quiz.questions);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [task.subject, task.title]);

  const score = results.filter((r) => r.correct).length;
  const passed = score >= 4;

  // Select an option (before confirming)
  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
  };

  // Confirm answer and show feedback
  const handleConfirm = () => {
    if (selected === null) return;
    const q = questions[current];
    const correct = selected === q.answer_index;
    setResults([...results, { correct }]);
    setAnswered(true);
  };

  // Move to next question or finish
  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  // Save attempt and optionally mark done
  const handleSaveResult = async () => {
    try {
      setSaving(true);
      await saveQuizAttempt(task.id, score, 5, passed);
      if (passed) {
        await markTaskDone(task.id, score);
        onPass();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Retry with new questions
  const handleRetry = async () => {
    setFinished(false);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    setQuestions(null);
    try {
      setLoading(true);
      setError(null);
      const quiz = await generateQuiz(task.subject, task.title);
      setQuestions(quiz.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Demo skip
  const handleDemoSkip = async () => {
    try {
      setSaving(true);
      await markTaskDone(task.id, 5);
      onPass();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Save result automatically when quiz finishes
  useEffect(() => {
    if (finished && questions) {
      handleSaveResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const q = questions?.[current];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded font-label text-[10px] uppercase font-bold bg-secondary-fixed text-on-secondary-fixed tracking-wider">
                Quiz Gate
              </span>
              <span className="px-2 py-0.5 rounded font-label text-[10px] uppercase font-bold bg-tertiary-fixed text-on-tertiary-fixed tracking-wider">
                Pass ≥ 4/5
              </span>
            </div>
            <h2 className="font-serif text-base text-primary font-semibold leading-snug">
              {task.subject} — {task.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-symbols-outlined text-4xl text-secondary animate-spin">
              progress_activity
            </span>
            <span className="font-label text-sm text-on-surface-variant">
              Generating questions…
            </span>
          </div>
        )}

        {/* Error */}
        {!loading && error && !finished && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4 px-6">
            <span className="material-symbols-outlined text-4xl text-error">error</span>
            <p className="font-body text-sm text-on-surface-variant text-center max-w-sm">
              {error}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="px-4 py-2 bg-primary text-on-primary font-label text-xs uppercase rounded-lg cursor-pointer"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-outline-variant font-label text-xs uppercase rounded-lg text-on-surface-variant cursor-pointer"
              >
                Close
              </button>
            </div>
            {DEMO_MODE && (
              <button
                type="button"
                onClick={handleDemoSkip}
                disabled={saving}
                className="mt-2 px-3 py-1 font-label text-[10px] text-on-surface-variant border border-outline-variant rounded cursor-pointer"
              >
                Skip quiz (demo)
              </button>
            )}
          </div>
        )}

        {/* Question view */}
        {!loading && !error && questions && !finished && (
          <>
            {/* Progress */}
            <div className="px-6 py-3 bg-surface-container border-b border-outline-variant/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-1 max-w-xs">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      i < current
                        ? "bg-secondary"
                        : i === current
                        ? "bg-secondary ring-2 ring-secondary/30"
                        : "bg-outline-variant"
                    }`}
                  />
                ))}
              </div>
              <span className="font-label text-xs font-bold text-primary">
                Question {current + 1} of {questions.length}
              </span>
            </div>

            {/* Question body */}
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="font-serif text-lg text-primary font-semibold mb-5 leading-snug">
                {q.question}
              </h3>

              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  let classes =
                    "bg-surface-container-lowest border-outline-variant/80 hover:bg-surface-container-low text-on-surface";

                  if (answered) {
                    if (idx === q.answer_index) {
                      classes =
                        "bg-tertiary-fixed/30 border-tertiary-fixed text-on-tertiary-fixed-variant ring-1 ring-tertiary-fixed";
                    } else if (idx === selected && idx !== q.answer_index) {
                      classes =
                        "bg-error-container/30 border-error text-on-error-container ring-1 ring-error/40";
                    } else {
                      classes += " opacity-50";
                    }
                  } else if (idx === selected) {
                    classes =
                      "bg-secondary-fixed/20 border-secondary ring-1 ring-secondary/40 text-primary shadow-xs";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(idx)}
                      disabled={answered}
                      className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${classes}`}
                    >
                      <span className="font-label text-xs font-bold text-secondary mt-0.5 shrink-0">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="font-body text-sm leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation after answering */}
              {answered && (
                <div className="mt-4 p-3 rounded-lg bg-surface-container border border-outline-variant/40 text-sm">
                  <span className="font-label text-xs font-semibold text-primary">
                    Explanation:
                  </span>{" "}
                  <span className="font-body text-on-surface-variant">
                    {q.explanation}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
              {DEMO_MODE && (
                <button
                  type="button"
                  onClick={handleDemoSkip}
                  disabled={saving}
                  className="px-3 py-1 font-label text-[10px] text-on-surface-variant border border-outline-variant rounded cursor-pointer"
                >
                  Skip quiz (demo)
                </button>
              )}
              <div className="ml-auto">
                {!answered ? (
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={selected === null}
                    className="px-5 py-2.5 bg-secondary text-on-secondary font-label text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-40"
                  >
                    Confirm Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-primary text-on-primary font-label text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    {current < questions.length - 1 ? "Next" : "See Results"}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Results screen */}
        {finished && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                passed
                  ? "bg-tertiary-fixed text-on-tertiary-fixed"
                  : "bg-error-container text-on-error-container"
              }`}
            >
              <span className="material-symbols-outlined text-4xl">
                {passed ? "verified" : "warning"}
              </span>
            </div>

            <h3 className="font-serif text-2xl text-primary font-semibold mb-1">
              Score: {score}/5 — {passed ? "PASSED! 🎉" : "Not passed"}
            </h3>
            <p className="font-body text-sm text-on-surface-variant max-w-sm mb-6">
              {passed
                ? "Great work! The card has been moved to Done."
                : "You need at least 4/5 to pass. Review the topic and try again."}
            </p>

            {saving && (
              <span className="font-label text-xs text-on-surface-variant mb-4">
                Saving…
              </span>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-xs">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {passed ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-primary text-on-primary font-label text-xs uppercase rounded-lg cursor-pointer"
                >
                  Back to Board
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="px-5 py-3 bg-secondary text-on-secondary font-label text-xs uppercase rounded-lg cursor-pointer"
                  >
                    Retry with new questions
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-3 border border-outline-variant font-label text-xs uppercase rounded-lg text-on-surface-variant cursor-pointer"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
