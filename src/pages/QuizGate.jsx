import { useState } from "react";

export default function QuizGate({ onNavigate }) {
  const [selectedGate, setSelectedGate] = useState("109");
  const [quizStep, setQuizStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const gates = [
    {
      id: "109",
      title: "Dynamic Programming — 0/1 Knapsack & State Transitions",
      unit: "Module 03 • Core Algorithmics",
      status: "Ready for Assessment",
      statusColor: "bg-secondary-fixed text-on-secondary-fixed",
      threshold: "> 3/5 Required (80%)",
      questionsCount: 5,
    },
    {
      id: "104",
      title: "Asymptotic Analysis & Recurrences",
      unit: "Module 01 • Fundamentals",
      status: "Mastered (5/5)",
      statusColor: "bg-tertiary-fixed text-on-tertiary-fixed",
      threshold: "Cleared Oct 28",
      questionsCount: 5,
    },
    {
      id: "108",
      title: "Divide & Conquer: Fast Fourier Transform",
      unit: "Module 02 • Polynomials",
      status: "Mastered (4/5)",
      statusColor: "bg-tertiary-fixed text-on-tertiary-fixed",
      threshold: "Cleared Oct 31",
      questionsCount: 5,
    },
    {
      id: "102",
      title: "Greedy Choice Property & Matroids",
      unit: "Module 02 • Greedy Systems",
      status: "Mastered (4/5)",
      statusColor: "bg-tertiary-fixed text-on-tertiary-fixed",
      threshold: "Cleared Nov 02",
      questionsCount: 5,
    },
  ];

  const questions = [
    {
      num: 1,
      topic: "Optimal Substructure Recurrence",
      prompt: "In the classical 0/1 Knapsack problem with items (vᵢ, wᵢ) and capacity W, what is the exact Bellman optimality relation for entry DP[i][w]?",
      options: [
        { id: "A", text: "DP[i][w] = DP[i-1][w] + vᵢ" },
        { id: "B", text: "DP[i][w] = max(DP[i-1][w], DP[i-1][w - wᵢ] + vᵢ), valid when w ≥ wᵢ", correct: true },
        { id: "C", text: "DP[i][w] = max(DP[i][w - 1], DP[i - 1][w] + wᵢ)" },
        { id: "D", text: "DP[i][w] = min(DP[i-1][w], DP[i][w - wᵢ] + vᵢ)" }
      ],
      citation: "Reference: CLRS §16.2 / Kleinberg-Tardos §6.4"
    },
    {
      num: 2,
      topic: "Space Complexity Optimization",
      prompt: "To compress the standard O(nW) 2D table to an O(W) 1D rolling array, in what direction MUST the capacity loop iterate to preserve 0/1 single-item constraints?",
      options: [
        { id: "A", text: "Forward from w = 0 to W, because subproblems depend only on lower weights." },
        { id: "B", text: "Reverse from w = W down to wᵢ, preventing an item from being chosen more than once in the same iteration.", correct: true },
        { id: "C", text: "Arbitrary random order via a min-heap priority queue." },
        { id: "D", text: "Bidirectionally starting from W/2 outward." }
      ],
      citation: "Proof: Rolling array overwriting invariants for single-choice state graphs."
    },
    {
      num: 3,
      topic: "Computational Complexity Class",
      prompt: "Why is the O(nW) dynamic programming solution considered pseudo-polynomial rather than strictly polynomial time?",
      options: [
        { id: "A", text: "Because capacity W is represented in binary using log₂(W) bits, making runtime exponential in input length.", correct: true },
        { id: "B", text: "Because sorting items by weight-to-value density requires Ω(n!) recursive operations." },
        { id: "C", text: "Because finding backpointers requires traversing an NP-Complete bipartite matching." },
        { id: "D", text: "Because topological DAG ordering has quadratic memory churn on modern L2 caches." }
      ],
      citation: "Complexity: Garey & Johnson NP-Completeness framework."
    },
    {
      num: 4,
      topic: "Subproblem DAG Ordering",
      prompt: "Dynamic programming over grid lattices is structurally equivalent to finding the longest path on which mathematical structure?",
      options: [
        { id: "A", text: "A directed acyclic graph (DAG) topologically sorted by step i and residual capacity w.", correct: true },
        { id: "B", text: "An undirected multigraph with strictly negative edge cycles." },
        { id: "C", text: "A complete Eulerian circuit without sink nodes." },
        { id: "D", text: "A matroid independent set with greedy replacement symmetry." }
      ],
      citation: "Theorem: DP Equivalence to DAG Single-Source Longest Path."
    },
    {
      num: 5,
      topic: "Certificate & Item Reconstruction",
      prompt: "Once the optimal value is computed at DP[n][W], what is the optimal asymptotic time to reconstruct the exact subset of selected items?",
      options: [
        { id: "A", text: "O(2ⁿ) by testing all power set combinations." },
        { id: "B", text: "O(n + W) using backward recurrence pointer checks from (n, W) down to base cases.", correct: true },
        { id: "C", text: "O(W log W) by applying fast Cooley-Tukey FFT decomposition." },
        { id: "D", text: "O(n²) by re-executing dynamic programming on every prefix." }
      ],
      citation: "Algorithm: Standard traceback using DP[i][w] ≠ DP[i-1][w] predicates."
    }
  ];

  const handleSelectAnswer = (qIndex, optionId) => {
    setUserAnswers({ ...userAnswers, [qIndex]: optionId });
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      const chosen = userAnswers[idx];
      const correctOpt = q.options.find((o) => o.correct);
      if (chosen === correctOpt?.id) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const passed = score >= 3;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-6 mb-8 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-label text-xs uppercase tracking-widest text-secondary font-semibold">
              Rigorous Assessment • Gate Verification
            </span>
            <span className="text-on-surface-variant font-label text-xs">•</span>
            <span className="font-label text-xs text-on-surface-variant uppercase">
              Automated Diagnostic Rubric
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-semibold tracking-tight">
            Academic Quiz Gate Console
          </h1>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate("study-kanban")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest text-primary hover:text-secondary font-label text-xs uppercase tracking-wider rounded-lg border border-outline-variant shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">view_kanban</span>
            <span>Return to Study Kanban</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left: Gate Selection List (4 Cols) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/40">
              <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Course Diagnostic Gates
              </span>
              <span className="font-label text-xs text-secondary font-bold">CS401</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {gates.map((gate) => (
                <button
                  key={gate.id}
                  type="button"
                  onClick={() => {
                    setSelectedGate(gate.id);
                    setQuizStep(0);
                    setIsSubmitted(false);
                    setUserAnswers({});
                  }}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all text-left cursor-pointer ${
                    selectedGate === gate.id
                      ? "bg-secondary-fixed/20 border-secondary ring-1 ring-secondary/30"
                      : "bg-surface-container-low border-outline-variant/60 hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-label text-[10px] uppercase font-bold text-secondary">
                      Gate #{gate.id}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-label text-[10px] uppercase font-semibold ${gate.statusColor}`}
                    >
                      {gate.status}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm text-primary font-semibold leading-snug mb-1">
                    {gate.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-body">
                    <span>{gate.unit}</span>
                    <span className="font-medium text-primary">{gate.threshold}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/60 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-base text-secondary">policy</span>
              <span className="font-label text-xs uppercase tracking-wider font-semibold">
                Mastery Rule Enforced
              </span>
            </div>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Every unit milestone requires scoring at least 80% (&gt; 3 out of 5) on theoretical
              proof derivations and algorithm correctness criteria to advance cards to &ldquo;Done&rdquo;.
            </p>
          </div>
        </div>

        {/* Right: Active Gate Assessment Runner (8 Cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded font-label text-[10px] uppercase font-bold tracking-wider bg-secondary-fixed text-on-secondary-fixed">
                    Gate #{selectedGate} Active
                  </span>
                  <span className="px-2 py-0.5 rounded font-label text-[10px] uppercase font-bold tracking-wider bg-tertiary-fixed text-on-tertiary-fixed">
                    Passing Criterion &gt; 3/5
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl text-primary font-semibold">
                  Dynamic Programming — 0/1 Knapsack &amp; State Transitions
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-highest/70 px-3 py-1 rounded-lg text-secondary font-label text-xs font-semibold">
                <span className="material-symbols-outlined text-base">timer</span>
                <span>Active Session</span>
              </div>
            </div>

            {/* Segmented Progress Tracker */}
            {!isSubmitted && (
              <div className="px-6 py-3 bg-[#F5F3EF] border-b border-outline-variant flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        i < quizStep
                          ? "bg-secondary"
                          : i === quizStep
                          ? "bg-secondary ring-2 ring-secondary/30"
                          : "bg-stone-300"
                      }`}
                    ></div>
                  ))}
                </div>
                <span className="font-label text-xs font-bold text-primary">
                  Question {quizStep + 1} of {questions.length}
                </span>
              </div>
            )}

            {/* Content Body */}
            {!isSubmitted ? (
              <>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-label text-[11px] uppercase tracking-wider text-secondary font-semibold bg-secondary-fixed/40 px-2 py-0.5 rounded">
                      {questions[quizStep].topic}
                    </span>
                    <span className="font-body text-xs text-on-surface-variant italic">
                      {questions[quizStep].citation}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl text-primary font-semibold mb-6 leading-snug">
                    {questions[quizStep].prompt}
                  </h3>

                  <div className="space-y-3">
                    {questions[quizStep].options.map((opt) => {
                      const isSelected = userAnswers[quizStep] === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-secondary-fixed/20 border-secondary ring-1 ring-secondary/40 text-primary shadow-xs"
                              : "bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low text-on-surface"
                          }`}
                        >
                          <div className="pt-0.5">
                            <input
                              type="radio"
                              name={`quiz_gate_q_${quizStep}`}
                              value={opt.id}
                              checked={isSelected}
                              onChange={() => handleSelectAnswer(quizStep, opt.id)}
                              className="w-4 h-4 text-secondary focus:ring-secondary border-stone-300"
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="font-label text-xs font-bold text-secondary mr-2">
                              [Option {opt.id}]
                            </span>
                            <span className="font-body text-sm sm:text-base leading-relaxed">
                              {opt.text}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={quizStep === 0}
                    onClick={() => setQuizStep(quizStep - 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-label text-xs font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (quizStep < questions.length - 1) {
                        setQuizStep(quizStep + 1);
                      } else {
                        setIsSubmitted(true);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary hover:bg-on-secondary-container text-on-secondary font-label text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <span>
                      {quizStep === questions.length - 1
                        ? "Verify Mastery Rubric"
                        : "Next Question"}
                    </span>
                    <span className="material-symbols-outlined text-base">
                      {quizStep === questions.length - 1 ? "verified" : "arrow_forward"}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              /* Results Screen */
              <div className="p-8 sm:p-10 flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm ${
                    passed
                      ? "bg-tertiary-fixed text-on-tertiary-fixed"
                      : "bg-error-container text-on-error-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl">
                    {passed ? "verified" : "warning"}
                  </span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full font-label text-xs font-bold uppercase tracking-wider mb-2 ${
                    passed
                      ? "bg-tertiary-fixed/60 text-on-tertiary-fixed-variant"
                      : "bg-error-container/60 text-on-error-container"
                  }`}
                >
                  {passed ? "Threshold Passed • Gate Cleared" : "Mastery Threshold Not Met"}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl text-primary font-semibold mb-2">
                  Score: {score}/5 ({Math.round((score / 5) * 100)}%) —{" "}
                  {passed ? "GATE CLEARED! 🎉" : "Review Recommended"}
                </h3>

                <p className="font-body text-sm text-on-surface-variant max-w-lg mb-6 leading-relaxed">
                  {passed
                    ? "Scholarly mastery of state reductions, space optimizations, and backpointer reconstruction verified according to academic standards."
                    : "The gate requires at least 4 out of 5 correct proofs to advance to verified status. Review notes and re-attempt."}
                </p>

                {/* Review breakdown */}
                <div className="w-full max-w-xl bg-surface-container-low rounded-xl p-4 border border-outline-variant shadow-xs text-left mb-6 space-y-2.5 font-label text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40 font-label text-on-surface-variant font-semibold">
                    <span>EVALUATION BREAKDOWN</span>
                    <span className="text-secondary font-bold">
                      {score} of {questions.length} Correct
                    </span>
                  </div>
                  {questions.map((q, idx) => {
                    const chosen = userAnswers[idx];
                    const correctOpt = q.options.find((o) => o.correct);
                    const isCorrect = chosen === correctOpt?.id;
                    return (
                      <div key={idx} className="flex items-center justify-between text-on-surface">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`material-symbols-outlined text-base ${
                              isCorrect ? "text-on-tertiary-container" : "text-error"
                            }`}
                          >
                            {isCorrect ? "check_circle" : "cancel"}
                          </span>
                          Q{idx + 1}: {q.topic}
                        </span>
                        <span
                          className={`font-semibold ${
                            isCorrect ? "text-on-tertiary-container" : "text-error"
                          }`}
                        >
                          {isCorrect ? "1/1" : "0/1"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate("study-kanban")}
                    className="px-6 py-3 bg-secondary hover:bg-on-secondary-container text-on-secondary font-label text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Go to Study Kanban Board
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizStep(0);
                      setIsSubmitted(false);
                      setUserAnswers({});
                    }}
                    className="px-5 py-3 border border-outline-variant font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                  >
                    Retake Assessment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
