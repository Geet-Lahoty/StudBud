import { useState } from "react";

export default function StudyKanban({ onOpenQuizGate }) {
  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("CS401: Advanced Algorithms");

  // Topic filter
  const [selectedTopic, setSelectedTopic] = useState("All Topics (8)");
  const [searchQuery, setSearchQuery] = useState("");

  // Column focus pop-out state
  const [focusedCol, setFocusedCol] = useState(null);

  // Kanban tasks state
  const [doingTasks, setDoingTasks] = useState([
    {
      id: "knapsack",
      title: "0/1 Knapsack & State Transitions",
      mod: "Module 03 • Core Algorithmics",
      desc: "Bellman optimality equations, topological ordering over grid DAGs, and rolling-array space compression from O(nW) to O(W).",
      progress: 80,
      gateId: "109",
      isReady: true,
      timeElapsed: "44:22 elapsed",
    },
    {
      id: "dijkstra",
      title: "Graph Shortest Paths (Dijkstra)",
      mod: "Mod 04 • Graphs",
      desc: "Fibonacci heap optimization, non-negative edge constraints, and Bellman-Ford negative cycle detection.",
      progress: 45,
      isPaused: true,
      gateLocked: true,
    },
  ]);

  const [doneTasks, setDoneTasks] = useState([
    {
      id: "asymptotic",
      title: "Asymptotic Analysis & Recurrences",
      mod: "Mod 01 • Fundamentals",
      desc: "Master Theorem (Cases 1–3), Akra-Bazzi intuition, and Big-O / Omega / Theta formal epsilon bounds.",
      score: "5/5 (100%)",
      clearedDate: "Cleared Oct 28",
      gate: "104",
      hours: "5.2 hrs",
    },
    {
      id: "fft",
      title: "Divide & Conquer: Fast Fourier Transform (FFT)",
      mod: "Mod 02 • Polynomials",
      desc: "Roots of unity butterfly networks, polynomial multiplication in O(n log n), and Cooley-Tukey bit reversal permutations.",
      score: "4/5 (80%)",
      clearedDate: "Cleared Oct 31",
      gate: "108",
      hours: "6.8 hrs",
    },
    {
      id: "greedy",
      title: "Greedy Choice Property & Matroids",
      mod: "Mod 02 • Greedy Systems",
      desc: "Hereditary systems, independent set exchange properties, Kruskal's spanning forest correctness via matroid basis theorem.",
      score: "4/5 (80%)",
      clearedDate: "Cleared Nov 02",
      gate: "102",
      hours: "4.1 hrs",
    },
  ]);

  // Telemetry metrics
  const [gatesCleared, setGatesCleared] = useState(6);
  const [masteryHealth, setMasteryHealth] = useState(94);

  // Local Quiz Gate Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({ 0: "B", 1: "B", 2: "C", 3: "A", 4: "B" });
  const [quizSubmitted, setQuizSubmitted] = useState(false);

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

  const handleOpenGate = () => {
    setModalOpen(true);
    setQuizStep(0);
    setQuizSubmitted(false);
  };

  const handleAdvanceToDone = () => {
    // Remove knapsack from doing
    setDoingTasks((prev) => prev.filter((t) => t.id !== "knapsack"));
    // Add to done
    setDoneTasks((prev) => [
      {
        id: "knapsack",
        title: "0/1 Knapsack & State Transitions",
        mod: "Mod 03 • Core Algorithmics",
        desc: "Bellman optimality equations, topological ordering over grid DAGs, and rolling-array space compression from O(nW) to O(W).",
        score: "4/5 (80%)",
        clearedDate: "Cleared Just Now",
        gate: "109",
        hours: "0.75 hrs",
      },
      ...prev,
    ]);
    setGatesCleared(7);
    setMasteryHealth(97);
    setModalOpen(false);
  };

  const toggleColumnFocus = (colName) => {
    setFocusedCol(focusedCol === colName ? null : colName);
  };

  const getColElevationClass = (colName) => {
    if (focusedCol === colName) {
      return "-translate-y-2 shadow-2xl border-stone-500 ring-2 ring-secondary/40";
    }
    return "hover:-translate-y-1 hover:shadow-xl hover:border-stone-400";
  };

  return (
    <div className="w-full flex flex-col bg-surface min-h-[calc(100vh-4rem)]">
      {/* Top Command & Executive Foliage Bar */}
      <section className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-4 bg-surface-container-low border-b border-outline-variant/60 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Subject Selector Dropdown System */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <label className="block font-label text-xs text-on-surface-variant uppercase mb-1 tracking-wider">
                Academic Syllabus
              </label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="group flex items-center gap-3 px-4 py-2 bg-surface-container-lowest rounded-lg border border-outline-variant/80 shadow-xs hover:shadow transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-label text-sm font-semibold">
                  CS
                </div>
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base text-primary leading-tight font-medium">
                      {selectedSubject}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-label bg-secondary-fixed text-on-secondary-fixed tracking-wide font-semibold">
                      Active Syllabus
                    </span>
                  </div>
                  <span className="font-body text-xs text-on-surface-variant truncate">
                    Mastery Sprints • Prof. V. Ramanujan • Fall Folio
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-on-surface-variant text-xl transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu Sheet */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-surface-container-lowest rounded-xl shadow-xl z-30 p-2 border border-outline-variant animate-in fade-in duration-150">
                  <div className="p-2 font-label text-xs text-on-surface-variant uppercase tracking-wider">
                    Enrolled Syllabi (Semester VII)
                  </div>
                  <div className="space-y-1 mt-1">
                    {[
                      {
                        title: "CS401: Advanced Algorithms",
                        sub: "Complexity Classes, Flow Networks & Gate Cleared 75%",
                        badge: "Sprint Active",
                      },
                      {
                        title: "CS201: Data Structures & Systems",
                        sub: "B-Trees, RB Balancing, Memory Allocation",
                        badge: "92% Done",
                      },
                      {
                        title: "MATH302: Discrete Probability",
                        sub: "Markov Chains, Random Walks, Tail Bounds",
                        badge: "Next Sprint",
                      },
                      {
                        title: "EE210: Digital Logic & Architecture",
                        sub: "Pipelining, Hazard Resolution, Microcode",
                        badge: "Archived",
                      },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedSubject(item.title);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors ${
                          selectedSubject === item.title
                            ? "bg-surface-container text-on-surface"
                            : "hover:bg-surface-container-low text-on-surface"
                        }`}
                      >
                        <span className="material-symbols-outlined text-secondary text-lg mt-0.5">
                          {selectedSubject === item.title ? "check_circle" : "menu_book"}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-sm text-primary font-semibold">
                              {item.title}
                            </span>
                            <span className="font-label text-xs text-secondary font-medium">
                              {item.badge}
                            </span>
                          </div>
                          <span className="font-body text-xs text-on-surface-variant">
                            {item.sub}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Academic Gate Velocity Telemetry */}
            <div className="flex items-center gap-6 pl-0 sm:pl-4 border-l border-outline-variant/60">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    Gate Clearance
                  </span>
                  <span className="font-label text-xs text-secondary font-bold">
                    {Math.round((gatesCleared / 8) * 100)}% Velocity
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-36 h-2 bg-surface-container-highest rounded-full overflow-hidden flex">
                    <div
                      className="bg-secondary h-full rounded-full transition-all duration-500"
                      style={{ width: `${(gatesCleared / 8) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-label text-xs text-primary font-semibold">
                    {gatesCleared} of 8 Gates Cleared
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col pl-4 border-l border-outline-variant/60">
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Exam Readiness
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container animate-pulse"></span>
                  <span className="font-body text-sm text-primary font-semibold">
                    Mastery Health {masteryHealth}%
                  </span>
                  <span className="font-body text-xs text-on-surface-variant">
                    (Target: &gt;80%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="flex items-center gap-2 self-end xl:self-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest text-on-surface hover:text-primary font-label text-xs uppercase tracking-wider rounded-lg border border-outline-variant shadow-xs hover:shadow transition-all"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Filter View</span>
            </button>
          </div>
        </div>

        {/* Topics Filter Bar & Search Sub-strip */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-outline-variant/40">
          {/* Topic Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {[
              "All Topics (8)",
              "Dynamic Programming",
              "Graph Theory",
              "NP-Completeness",
              "Divide & Conquer",
              "Approximation",
            ].map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1 rounded-full font-label text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTopic === topic
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-base">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search theorems, proofs, concepts..."
              className="w-full pl-9 pr-12 py-1.5 bg-surface-container-lowest text-on-surface font-label text-xs rounded-lg border border-outline-variant shadow-inner focus:outline-none focus:ring-1 focus:ring-secondary placeholder:text-on-surface-variant/70"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="px-1.5 py-0.5 font-label text-[10px] text-on-surface-variant bg-surface-container-high rounded shadow-xs">
                ⌘F
              </kbd>
            </div>
          </div>
        </div>
      </section>

      {/* Primary 3-Column Kanban Board Engine */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-8 flex-1 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ============================================== */}
          {/* COLUMN 1: TO-DO                                */}
          {/* ============================================== */}
          <div
            onClick={() => toggleColumnFocus("todo")}
            className={`kanban-column flex flex-col bg-surface-container-low rounded-2xl p-5 xl:p-6 shadow-sm border border-outline-variant/80 transition-all duration-300 ease-out cursor-default ${getColElevationClass(
              "todo"
            )}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
                <h2 className="font-serif text-lg text-primary font-semibold">To-Do</h2>
                <span className="px-2 py-0.5 rounded-full font-label text-xs bg-surface-container-highest text-on-surface-variant font-medium">
                  3 Modules
                </span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant font-label text-xs">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>11.5 hrs total</span>
              </div>
            </div>

            {/* Cards Container */}
            <div className="flex flex-col gap-4">
              {/* Card 1.1: NP-Completeness */}
              <article className="bg-surface-container-lowest p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between border border-outline-variant/60">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-1.5 py-0.5 rounded font-label text-[11px] bg-surface-container-high text-on-surface-variant font-semibold uppercase">
                      Mod 06 • Complexity
                    </span>
                    <span className="font-label text-xs text-secondary font-medium flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">hourglass_top</span>
                      4.5 hrs
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-primary font-medium group-hover:text-secondary transition-colors mb-1">
                    NP-Completeness &amp; Cook-Levin Theorem
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant line-clamp-2 mb-3">
                    Formal reductions from 3-SAT to CLIQUE and SUBSET-SUM. Polynomial-time verification engines and deterministic Turing bounds.
                  </p>
                  <div className="p-2 bg-surface-container-low rounded-lg mb-3 flex items-center justify-between text-xs font-label">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">menu_book</span>
                      <span>CLRS Chapter 34.1–34.4</span>
                    </span>
                    <span className="text-on-secondary-container bg-secondary-fixed/50 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                      High Yield
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-body text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-on-tertiary-container text-sm">
                      check_circle
                    </span>
                    <span>Prereq: P vs NP Foundation (Passed)</span>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-outline-variant/40 flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    <span className="w-6 h-6 rounded-full bg-surface-container-highest text-[10px] font-label flex items-center justify-center font-bold text-on-surface">
                      P1
                    </span>
                    <span className="w-6 h-6 rounded-full bg-surface-container-high text-[10px] font-label flex items-center justify-center text-on-surface-variant">
                      P2
                    </span>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-label text-xs text-primary hover:text-secondary font-semibold transition-colors cursor-pointer"
                  >
                    <span>Start Study</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </article>

              {/* Card 1.2: Approximation Algorithms */}
              <article className="bg-surface-container-lowest p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between border border-outline-variant/60">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-1.5 py-0.5 rounded font-label text-[11px] bg-surface-container-high text-on-surface-variant font-semibold uppercase">
                      Mod 07 • Optimization
                    </span>
                    <span className="font-label text-xs text-on-surface-variant font-medium flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">hourglass_top</span>
                      3.0 hrs
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-primary font-medium group-hover:text-secondary transition-colors mb-1">
                    Approximation Algorithms &amp; LP Relaxations
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant line-clamp-2 mb-3">
                    2-approximation bounds for Vertex Cover, Metric TSP triangle inequality shortcuts, and primal-dual complementary slackness.
                  </p>
                  <div className="p-2 bg-surface-container-low rounded-lg mb-3 flex items-center justify-between text-xs font-label">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">edit_note</span>
                      <span>4 Practice Proof Sets Included</span>
                    </span>
                    <span className="text-on-surface-variant font-body text-xs">
                      Vazirani Ch. 1
                    </span>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-outline-variant/40 flex items-center justify-between">
                  <span className="font-body text-xs text-on-surface-variant">Ready to queue</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-label text-xs text-primary hover:text-secondary font-semibold transition-colors cursor-pointer"
                  >
                    <span>Start Study</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </article>

              {/* Card 1.3: Network Flow */}
              <article className="bg-surface-container-lowest p-4 rounded-xl shadow-xs opacity-90 group flex flex-col justify-between border border-outline-variant/60">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-1.5 py-0.5 rounded font-label text-[11px] bg-surface-container-high text-on-surface-variant font-semibold uppercase">
                      Mod 05 • Graphs
                    </span>
                    <span className="font-label text-xs text-on-surface-variant font-medium flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">lock</span>
                      4.0 hrs
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-primary/80 font-medium mb-1">
                    Network Flow &amp; Ford-Fulkerson Cut
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant/80 line-clamp-2 mb-3">
                    Max-Flow Min-Cut equivalence theorem, Edmonds-Karp augmentation paths, and capacity scaling bounds.
                  </p>
                  <div className="px-2 py-1 bg-surface-container rounded font-label text-[11px] text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-error">lock</span>
                    <span>Requires completion of Dijkstra Shortest Paths</span>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-outline-variant/40 flex items-center justify-between">
                  <span className="font-body text-xs text-on-surface-variant italic">
                    Locked by prerequisite
                  </span>
                  <span className="material-symbols-outlined text-outline-variant text-base">
                    lock_clock
                  </span>
                </div>
              </article>
            </div>
          </div>

          {/* ============================================== */}
          {/* COLUMN 2: DOING (STUDY IN PROGRESS)            */}
          {/* ============================================== */}
          <div
            onClick={() => toggleColumnFocus("doing")}
            className={`kanban-column flex flex-col bg-surface-container rounded-2xl p-5 xl:p-6 shadow-md border border-outline-variant transition-all duration-300 ease-out cursor-default ${getColElevationClass(
              "doing"
            )}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
                <h2 className="font-serif text-lg text-primary font-semibold">Doing</h2>
                <span className="px-2 py-0.5 rounded-full font-label text-xs bg-secondary-fixed text-on-secondary-fixed font-bold">
                  {doingTasks.length} Active
                </span>
              </div>
              <div className="flex items-center gap-1 text-secondary font-label text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">timer</span>
                <span>Focus Mode</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {doingTasks.map((task) => (
                <article
                  key={task.id}
                  className="bg-surface-container-lowest p-4 rounded-xl shadow-md border border-outline-variant/60"
                >
                  {task.isReady ? (
                    <>
                      {/* Active Focus Badge & Timer */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-label text-[11px] bg-secondary text-on-secondary font-semibold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          In Focus Now
                        </span>
                        <div className="flex items-center gap-1 font-label text-xs text-secondary font-bold bg-secondary-fixed/40 px-2 py-0.5 rounded">
                          <span className="material-symbols-outlined text-sm">timer</span>
                          <span>{task.timeElapsed}</span>
                        </div>
                      </div>
                      <div className="mb-1">
                        <span className="font-label text-[11px] text-on-surface-variant uppercase tracking-wider">
                          {task.mod}
                        </span>
                        <h3 className="font-serif text-base text-primary font-semibold mt-0.5">
                          {task.title}
                        </h3>
                      </div>
                      <p className="font-body text-xs text-on-surface mb-3 leading-relaxed">
                        {task.desc}
                      </p>

                      {/* Progress bar */}
                      <div className="p-3 bg-surface-container-low rounded-lg mb-3 border border-outline-variant/40">
                        <div className="flex items-center justify-between text-xs font-label mb-1.5">
                          <span className="text-on-surface font-medium">Submodule Reading Progress</span>
                          <span className="text-secondary font-bold">{task.progress}% Complete</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="bg-secondary h-full rounded-full transition-all duration-500"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between font-body text-xs text-on-surface-variant mt-1.5">
                          <span>4 of 5 Core Proof Notes Synthesized</span>
                          <span className="text-on-tertiary-container font-semibold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">check</span> Ready
                            for Assessment
                          </span>
                        </div>
                      </div>

                      {/* QUIZ GATE ACTION CALLOUT */}
                      <div className="p-3 bg-surface-container-lowest rounded-xl shadow-inner mb-3 border border-outline-variant">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 text-primary font-serif text-sm font-bold">
                            <span className="material-symbols-outlined text-secondary text-base">
                              gate
                            </span>
                            <span>Mastery Gate #{task.gateId} Ready</span>
                          </div>
                          <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-label uppercase font-bold rounded">
                            Criterion &gt; 3/5
                          </span>
                        </div>
                        <p className="font-body text-xs text-on-surface-variant mb-3 leading-snug">
                          You must earn at least 4/5 (80%) on the dynamic state-space verification quiz to advance this card to <strong>Done</strong>.
                        </p>
                        <button
                          type="button"
                          onClick={handleOpenGate}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-on-secondary font-label text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm hover:bg-on-secondary-container transition-all text-center cursor-pointer hover:shadow-md"
                        >
                          <span className="material-symbols-outlined text-base">school</span>
                          <span>Enter Quiz Gate (Ready)</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          className="font-label text-xs text-on-surface-variant hover:text-on-surface flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">pause_circle</span>
                          <span>Pause Session</span>
                        </button>
                        <button
                          type="button"
                          className="font-label text-xs text-primary hover:text-secondary flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">menu_book</span>
                          <span>Study Notes (4/5)</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Paused task */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-1.5 py-0.5 rounded font-label text-[11px] bg-surface-container-high text-on-surface-variant font-semibold uppercase">
                          {task.mod}
                        </span>
                        <span className="font-label text-xs text-on-surface-variant font-medium">
                          Session Paused
                        </span>
                      </div>
                      <h3 className="font-serif text-base text-primary font-medium mb-1">
                        {task.title}
                      </h3>
                      <p className="font-body text-xs text-on-surface-variant line-clamp-2 mb-3">
                        {task.desc}
                      </p>
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-xs font-label text-on-surface-variant">
                          <span>Reading &amp; Syntax Lemmas</span>
                          <span className="font-semibold text-primary">{task.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="bg-on-surface-variant h-full rounded-full"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="px-3 py-2 bg-surface-container-low rounded-lg mb-3 flex items-center gap-2 text-xs font-label text-on-surface-variant border border-outline-variant/40">
                        <span className="material-symbols-outlined text-base text-outline">lock</span>
                        <div className="flex-1">
                          <span className="font-semibold text-on-surface block">Quiz Gate Locked</span>
                          <span className="font-body text-xs text-on-surface-variant">
                            Complete remaining 3 proofs before assessment
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 font-label text-xs text-secondary font-semibold hover:underline cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">play_arrow</span>
                          <span>Resume Focus</span>
                        </button>
                        <button
                          type="button"
                          className="font-label text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
                        >
                          Inspect Folio
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* ============================================== */}
          {/* COLUMN 3: DONE (VERIFIED & MASTERED)           */}
          {/* ============================================== */}
          <div
            onClick={() => toggleColumnFocus("done")}
            className={`kanban-column flex flex-col bg-surface-container-low rounded-2xl p-5 xl:p-6 shadow-sm border border-outline-variant/80 transition-all duration-300 ease-out cursor-default ${getColElevationClass(
              "done"
            )}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-on-tertiary-container"></span>
                <h2 className="font-serif text-lg text-primary font-semibold">Done</h2>
                <span className="px-2 py-0.5 rounded-full font-label text-xs bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                  {doneTasks.length} Mastered
                </span>
              </div>
              <div className="flex items-center gap-1 text-on-tertiary-container font-label text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>Verified Folio</span>
              </div>
            </div>

            {/* Academic Rule Explanation Pill */}
            <div className="p-2.5 bg-surface-container-lowest rounded-lg mb-4 shadow-xs flex items-start gap-2 border border-outline-variant/60">
              <span className="material-symbols-outlined text-secondary text-base mt-0.5">
                policy
              </span>
              <span className="font-body text-xs text-on-surface-variant leading-snug">
                <strong>Mastery Rule Enforced:</strong> All items below have passed automated Quiz Gates with scores &gt; 3/5.
              </span>
            </div>

            {/* Done Cards */}
            <div className="flex flex-col gap-4">
              {doneTasks.map((task) => (
                <article
                  key={task.id}
                  className="bg-surface-container-lowest p-4 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden border border-outline-variant/60 animate-in fade-in duration-300"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                    <div className="bg-tertiary-fixed text-on-tertiary-fixed text-[9px] font-bold font-label py-0.5 text-center transform rotate-45 translate-x-4 translate-y-2 uppercase shadow-xs">
                      Pass
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-1.5 pr-6">
                    <span className="px-1.5 py-0.5 rounded font-label text-[11px] bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-semibold uppercase">
                      {task.mod}
                    </span>
                    <span className="font-body text-xs text-on-surface-variant">
                      {task.clearedDate}
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-primary font-medium mb-1">
                    {task.title}
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
                    {task.desc}
                  </p>

                  {/* Verification Badge */}
                  <div className="p-3 bg-surface-container-low rounded-lg mb-3 border border-outline-variant/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-on-tertiary-container text-base">
                          verified
                        </span>
                        <span className="font-label text-xs font-semibold text-primary">
                          Quiz Gate #{task.gate} Cleared
                        </span>
                      </div>
                      <span className="font-label text-xs font-bold text-on-tertiary-fixed-variant bg-tertiary-fixed px-2 py-0.5 rounded">
                        Score: {task.score}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between font-body text-xs text-on-surface-variant">
                      <span>Pass Standard: Score &gt; 3/5 Required</span>
                      <span className="text-on-surface font-medium">Attempt #1 (Passed)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-label text-xs text-on-surface-variant">
                      Time spent: {task.hours}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-label text-xs text-primary hover:text-secondary font-semibold transition-colors cursor-pointer"
                    >
                      <span>Review Quiz Folio</span>
                      <span className="material-symbols-outlined text-sm">arrow_outward</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ============================================== */}
      {/* INTERACTIVE QUIZ GATE MODAL DIALOG OVERLAY     */}
      {/* ============================================== */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Top Archival Header */}
            <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center font-serif shadow-xs shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded font-label text-[10px] uppercase font-bold tracking-wider bg-secondary-fixed text-on-secondary-fixed">
                      Gate #109 Verification
                    </span>
                    <span className="px-2 py-0.5 rounded font-label text-[10px] uppercase font-bold tracking-wider bg-tertiary-fixed text-on-tertiary-fixed">
                      Criterion &gt; 3/5 Required
                    </span>
                  </div>
                  <h2 className="font-serif text-lg text-primary font-semibold leading-snug">
                    Dynamic Programming — 0/1 Knapsack &amp; State Transitions
                  </h2>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">
                    Passage into <span className="font-semibold text-primary">Done</span> requires proving optimal substructure, DAG topologically sorted transitions, and space recurrence bounds.
                  </p>
                </div>
              </div>

              {/* Timer & Close */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-highest/70 rounded-lg text-secondary font-label text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm">hourglass_bottom</span>
                  <span>12:45</span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                  aria-label="Close Quiz Gate"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
            </div>

            {/* Segmented Step Progress Bar */}
            {!quizSubmitted && (
              <div className="px-6 py-3 bg-[#F5F3EF] border-b border-outline-variant flex items-center justify-between gap-2">
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
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-label text-xs font-bold text-primary">
                    Question {quizStep + 1} of {questions.length}
                  </span>
                  <span className="font-body text-xs text-on-surface-variant hidden md:inline">
                    • 80% passing threshold
                  </span>
                </div>
              </div>
            )}

            {/* Dynamic Question Container or Results */}
            {!quizSubmitted ? (
              <>
                <div className="p-6 md:p-8 overflow-y-auto flex-1 text-on-surface">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-label text-[11px] uppercase tracking-wider text-secondary font-semibold bg-secondary-fixed/40 px-2 py-0.5 rounded">
                        {questions[quizStep].topic}
                      </span>
                      <span className="font-body text-xs text-on-surface-variant italic">
                        {questions[quizStep].citation}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-primary font-semibold leading-snug mb-5 text-left">
                      {questions[quizStep].prompt}
                    </h3>
                    <div className="space-y-3">
                      {questions[quizStep].options.map((opt) => {
                        const isSelected = userAnswers[quizStep] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-secondary-fixed/20 border-secondary ring-1 ring-secondary/40 text-primary shadow-xs"
                                : "bg-surface-container-lowest border-outline-variant/80 hover:bg-surface-container-low hover:border-stone-400 text-on-surface"
                            }`}
                          >
                            <div className="pt-0.5">
                              <input
                                type="radio"
                                name={`quiz_q_${quizStep}`}
                                value={opt.id}
                                checked={isSelected}
                                onChange={() =>
                                  setUserAnswers({ ...userAnswers, [quizStep]: opt.id })
                                }
                                className="w-4 h-4 text-secondary focus:ring-secondary border-stone-300"
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <span className="font-label text-xs font-bold text-secondary mr-1.5">
                                [Option {opt.id}]
                              </span>
                              <span className="font-body text-sm leading-relaxed">{opt.text}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={quizStep === 0}
                    onClick={() => setQuizStep(quizStep - 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-label text-xs font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    <span>Previous Question</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (quizStep < questions.length - 1) {
                          setQuizStep(quizStep + 1);
                        } else {
                          setQuizSubmitted(true);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-on-secondary-container text-on-secondary font-label text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <span>
                        {quizStep === questions.length - 1
                          ? "Submit Quiz for Gate Verification"
                          : "Save & Next Question"}
                      </span>
                      <span className="material-symbols-outlined text-base">
                        {quizStep === questions.length - 1 ? "verified" : "arrow_forward"}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Gate Result View */
              <div className="flex flex-col p-6 md:p-8 overflow-y-auto flex-1 items-center text-center">
                <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-4xl">verified</span>
                </div>
                <span className="px-3 py-1 rounded-full font-label text-xs font-bold uppercase tracking-wider bg-tertiary-fixed/60 text-on-tertiary-fixed-variant mb-2">
                  Threshold Passed • Score &gt; 3/5 Required
                </span>
                <h3 className="font-serif text-2xl text-primary font-semibold mb-1">
                  Score: 4/5 (80%) — GATE CLEARED! 🎉
                </h3>
                <p className="font-body text-sm text-on-surface-variant max-w-lg mb-6 leading-relaxed">
                  Exceptional theoretical mastery of state reductions, space optimizations, and backpointer reconstruction. The mastery rule criterion has been satisfied.
                </p>

                {/* Breakdown review strip */}
                <div className="w-full max-w-xl bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-xs text-left mb-6 space-y-2.5 font-label text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40 font-label text-on-surface-variant font-semibold">
                    <span>ASSESSMENT BREAKDOWN</span>
                    <span className="text-secondary font-bold">1 Attempt • 4 Correct</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-on-tertiary-container">
                        check_circle
                      </span>{" "}
                      Q1: Bellman Recurrence Substructure
                    </span>
                    <span className="text-on-tertiary-container font-semibold">Correct (1/1)</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-on-tertiary-container">
                        check_circle
                      </span>{" "}
                      Q2: Reverse Capacity 1D Space Compaction
                    </span>
                    <span className="text-on-tertiary-container font-semibold">Correct (1/1)</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-error">cancel</span>{" "}
                      Q3: Pseudo-Polynomial Bit Complexity
                    </span>
                    <span className="text-error font-semibold">Incorrect (0/1)</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-on-tertiary-container">
                        check_circle
                      </span>{" "}
                      Q4: DAG Topological Ordering Validity
                    </span>
                    <span className="text-on-tertiary-container font-semibold">Correct (1/1)</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-on-tertiary-container">
                        check_circle
                      </span>{" "}
                      Q5: O(n) Backpointer Item Reconstruction
                    </span>
                    <span className="text-on-tertiary-container font-semibold">Correct (1/1)</span>
                  </div>
                </div>

                {/* Primary Gate Action */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                  <button
                    type="button"
                    onClick={handleAdvanceToDone}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-on-secondary-container text-on-secondary font-label text-xs uppercase tracking-wider font-semibold rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
                    <span>Advance Card to &ldquo;Done&rdquo; Column</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-3 rounded-lg border border-outline-variant font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    Keep in Kanban
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
