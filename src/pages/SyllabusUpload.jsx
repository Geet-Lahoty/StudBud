import { useState } from "react";

export default function SyllabusUpload({ onNavigate }) {
  const [file, setFile] = useState({
    name: "CS401_Algorithms_Midterm_Syllabus.pdf",
    size: "2.4 MB",
    detail: "Extracted 14 Topics across 4 Modules • OCR Verified",
  });
  const [startDate, setStartDate] = useState("2025-10-28");
  const [examDate, setExamDate] = useState("2025-11-15");
  const [studyHours, setStudyHours] = useState(4.5);
  const [priorityTopics, setPriorityTopics] = useState([
    "Dynamic Programming",
    "Graph Theory (Dijkstra & BFS)",
    "NP-Completeness",
  ]);
  const [newTopic, setNewTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const uploaded = e.target.files[0];
      setFile({
        name: uploaded.name,
        size: (uploaded.size / (1024 * 1024)).toFixed(1) + " MB",
        detail: "Extracted structure • Text heuristics synced",
      });
      showToast(`Ingested: ${uploaded.name}`);
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setPriorityTopics([...priorityTopics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (indexToRemove) => {
    setPriorityTopics(priorityTopics.filter((_, i) => i !== indexToRemove));
  };

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast("Study Folio Generated! Redirecting to Kanban...");
      setTimeout(() => {
        if (onNavigate) onNavigate("study-kanban");
      }, 1000);
    }, 1200);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded shadow-xl flex items-center gap-2 font-label text-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-lg text-on-tertiary-container">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Editorial Header & Monograph Meta */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-6 mb-8 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-label text-xs uppercase tracking-widest text-secondary font-semibold">
              Folio Volume IV • Curriculum Ingestion
            </span>
            <span className="text-on-surface-variant font-label text-xs">•</span>
            <span className="font-label text-xs text-on-surface-variant uppercase">
              Syllabus Synthesis Protocol
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-semibold tracking-tight">
            Syllabus Ingestion &amp; Plan Synthesizer
          </h1>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="flex flex-col text-left md:text-right">
            <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
              Active Term Registry
            </span>
            <span className="font-body text-base text-primary font-medium">
              Fall 2025 • Department of Computer Science
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace: Asymmetric Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dropzone & Synthesis Configuration (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-8">
          {/* SECTION 1: Tactile Syllabus Dropzone */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 shadow-sm rounded-lg border border-outline-variant/60 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg text-primary font-semibold">
                  01 / Curricular Document Ingestion
                </span>
              </div>
              <span className="px-2.5 py-1 bg-surface-container text-on-surface-variant font-label text-xs rounded uppercase tracking-wider font-semibold">
                Direct Parser Active
              </span>
            </div>

            {/* Upload Drop Box */}
            <div className="group relative cursor-pointer p-8 rounded-lg bg-surface-container-low border border-dashed border-outline-variant hover:border-secondary transition-all duration-300 hover:bg-surface-container flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center mb-4 text-secondary group-hover:scale-105 transition-transform duration-200">
                <span className="material-symbols-outlined text-3xl">file_upload</span>
              </div>
              <p className="font-serif text-lg text-primary font-semibold mb-1">
                Deposit Course Syllabus, Slide Decks, or Outline
              </p>
              <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-lg mb-4">
                Drag and drop your syllabus PDF, DOCX, or lecture slides here or click to browse files
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant font-label text-xs rounded uppercase font-semibold">
                  PDF • DOCX • TXT
                </span>
                <span className="font-body text-xs text-on-surface-variant">
                  Maximum File Payload: 25 MB
                </span>
              </div>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Upload syllabus file"
              />
            </div>

            {/* Recently Parsed / Current Artifact Banner */}
            {file && (
              <div className="mt-6 p-4 bg-surface-container-low rounded-lg border border-outline-variant/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">description</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label text-sm font-semibold text-primary">
                        {file.name}
                      </span>
                      <span className="inline-block w-2 h-2 rounded-full bg-on-tertiary-container"></span>
                    </div>
                    <span className="font-body text-xs text-on-surface-variant">
                      {file.size} • {file.detail}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="px-2 py-0.5 bg-surface-container-highest text-primary font-label text-xs rounded uppercase font-semibold">
                    Ready
                  </span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1 text-on-surface-variant hover:text-error transition-colors"
                    title="Remove Artifact"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 2: Plan Synthesizer Configuration */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 shadow-sm rounded-lg border border-outline-variant/60 flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg text-primary font-semibold">
                  02 / Temporal Horizons &amp; Focus Directives
                </span>
              </div>
              <span className="font-body text-xs text-on-surface-variant">
                Deterministic Scheduling
              </span>
            </div>

            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              {/* Dates Row: Target Start & Exam Deadlines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Daily Study Date / Target Start Date */}
                <div className="flex flex-col gap-1 bg-surface-container-low p-4 rounded-lg border border-outline-variant/60">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="study-start-date"
                      className="font-label text-xs uppercase tracking-wider text-primary font-semibold"
                    >
                      Daily Study Start Date
                    </label>
                    <span className="material-symbols-outlined text-base text-on-surface-variant">
                      event_available
                    </span>
                  </div>
                  <div className="relative mt-1">
                    <input
                      id="study-start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-surface-container-lowest px-3 py-2 text-primary font-body text-base rounded border border-outline-variant/80 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-shadow"
                    />
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant mt-1">
                    <span className="font-body text-xs">Term Sabbatical Week 8</span>
                    <span className="font-label text-xs text-primary font-medium">
                      Active Cohort
                    </span>
                  </div>
                </div>

                {/* Exam Date */}
                <div className="flex flex-col gap-1 bg-surface-container-low p-4 rounded-lg border border-outline-variant/60">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="exam-date"
                      className="font-label text-xs uppercase tracking-wider text-primary font-semibold"
                    >
                      Exam Date Target
                    </label>
                    <span className="material-symbols-outlined text-base text-secondary">
                      event
                    </span>
                  </div>
                  <div className="relative mt-1">
                    <input
                      id="exam-date"
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full bg-surface-container-lowest px-3 py-2 text-primary font-body text-base rounded border border-outline-variant/80 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-shadow"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-body text-xs text-on-surface-variant">
                      Final Hall Examination
                    </span>
                    <span className="font-label text-xs px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded font-semibold uppercase">
                      18 Days Remaining
                    </span>
                  </div>
                </div>
              </div>

              {/* Daily Study Hours Allocation */}
              <div className="flex flex-col gap-1 bg-surface-container-low p-4 rounded-lg border border-outline-variant/60">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-label text-xs uppercase tracking-wider text-primary font-semibold block">
                      Daily Study Allocation
                    </span>
                    <span className="font-body text-xs text-on-surface-variant">
                      Dedicated review and recall block length
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 bg-surface-container-lowest px-3 py-1 rounded shadow-xs border border-outline-variant/60">
                    <span className="font-serif text-xl text-primary font-bold">
                      {studyHours}
                    </span>
                    <span className="font-label text-xs text-on-surface-variant uppercase">
                      hrs/day
                    </span>
                  </div>
                </div>
                <div className="pt-3 pb-1">
                  <input
                    id="study-hours-slider"
                    type="range"
                    min="1.0"
                    max="8.0"
                    step="0.5"
                    value={studyHours}
                    onChange={(e) => setStudyHours(parseFloat(e.target.value))}
                    className="w-full accent-secondary h-2 bg-surface-container-highest rounded cursor-pointer"
                  />
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-label text-xs">
                  <span>1.0 hr (Light Retention)</span>
                  <span>4.5 hrs (Recommended Cohort Pace)</span>
                  <span>8.0 hrs (Immersive Intensive)</span>
                </div>
              </div>

              {/* Priority Topics */}
              <div className="flex flex-col gap-2 bg-surface-container-low p-4 rounded-lg border border-outline-variant/60">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-label text-xs uppercase tracking-wider text-primary font-semibold block">
                      Priority Weighting Topics
                    </label>
                    <span className="font-body text-xs text-on-surface-variant">
                      Tagged subjects receive automated diagnostic gates and extra review intervals
                    </span>
                  </div>
                  <span className="font-label text-xs text-secondary font-semibold uppercase">
                    {priorityTopics.length} Designated
                  </span>
                </div>

                {/* Tag Cloud Container */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {priorityTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-surface-container-lowest text-primary px-3 py-1 rounded shadow-xs border border-outline-variant/60"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      <span className="font-body text-sm font-medium">{topic}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(idx)}
                        className="text-on-surface-variant hover:text-error flex items-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Topic Input Bar */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                    placeholder="+ Add Priority Topic (e.g., Amortized Analysis, Red-Black Trees)..."
                    className="w-full bg-surface-container-lowest px-3 py-2 text-primary font-body text-sm rounded border border-outline-variant/80 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="px-4 py-2 bg-primary text-on-primary font-label text-xs uppercase tracking-wider rounded font-semibold hover:bg-primary-container transition-colors shrink-0 shadow-xs"
                  >
                    + Add Focus
                  </button>
                </div>
              </div>

              {/* Primary Synthesis Action */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  id="generate-plan-button"
                  disabled={isGenerating}
                  onClick={handleGeneratePlan}
                  className="w-full py-3.5 px-6 bg-primary text-on-primary rounded font-label text-xs uppercase tracking-widest font-semibold hover:bg-black active:translate-y-px transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <span className="material-symbols-outlined text-xl animate-spin">
                        refresh
                      </span>
                      <span>Synthesizing Academic Plan...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Study Plan</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-on-surface-variant text-center pt-1">
                  <span className="material-symbols-outlined text-sm text-on-tertiary-container">
                    sync_alt
                  </span>
                  <span className="font-body text-xs">
                    Synthesizes timetable, kanban milestones, and diagnostic quiz gates
                  </span>
                </div>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Live Extraction Preview & Pedagogical Breakdown (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-8">
          {/* Curricular Structural Analysis Pane */}
          <section className="bg-surface-container-lowest p-6 sm:p-8 shadow-sm rounded-lg border border-outline-variant/60 flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/40">
              <div>
                <span className="font-label text-xs uppercase text-secondary font-semibold tracking-wider">
                  Structural Ledger
                </span>
                <h2 className="font-serif text-xl text-primary font-semibold">
                  Curriculum Breakdown Preview
                </h2>
              </div>
              <div className="px-3 py-1 bg-surface-container-high rounded text-primary font-label text-xs font-semibold">
                4 Units • 13 Days Planned
              </div>
            </div>

            <p className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed">
              Extracted through contextual heuristics from{" "}
              <strong className="text-primary font-medium">
                {file ? file.name : "Curriculum Document"}
              </strong>
              . Allocation adjusted for estimated cognitive density.
            </p>

            {/* Timeline Unit Ledger Cards */}
            <div className="flex flex-col gap-4">
              {/* Unit 1 */}
              <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/50 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-label text-xs text-on-surface-variant uppercase font-semibold">
                        Unit 01
                      </span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="font-body text-xs text-on-surface-variant">
                        Core Foundation
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-primary font-semibold leading-tight">
                      Foundations &amp; Asymptotics
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-label text-sm font-semibold text-primary">2 Days</span>
                    <span className="block font-body text-xs text-on-surface-variant">
                      9.0 hrs total
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label text-xs rounded">
                    Big-O Formalism
                  </span>
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label text-xs rounded">
                    Recurrence Relations
                  </span>
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label text-xs rounded">
                    Master Theorem
                  </span>
                </div>
              </div>

              {/* Unit 2 */}
              <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/50 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-label text-xs text-on-surface-variant uppercase font-semibold">
                        Unit 02
                      </span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="font-body text-xs text-on-surface-variant">
                        Algorithmic Paradigms
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-primary font-semibold leading-tight">
                      Divide &amp; Conquer
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-label text-sm font-semibold text-primary">3 Days</span>
                    <span className="block font-body text-xs text-on-surface-variant">
                      13.5 hrs total
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label text-xs rounded">
                    MergeSort &amp; QuickSort
                  </span>
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label text-xs rounded">
                    Strassen's Matrix Multi.
                  </span>
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label text-xs rounded">
                    Median Finding
                  </span>
                </div>
              </div>

              {/* Unit 3 (Priority Flagged) */}
              <div className="p-4 bg-surface-container-low rounded-lg border border-secondary/40 relative overflow-hidden transition-transform hover:-translate-y-0.5 shadow-xs">
                <div className="absolute top-0 right-0 left-0 h-1 bg-secondary"></div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-label text-xs text-secondary uppercase font-semibold">
                        Unit 03
                      </span>
                      <span className="px-1.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-label text-[10px] rounded font-bold uppercase">
                        High Priority
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-primary font-semibold leading-tight">
                      Dynamic Programming
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-label text-sm font-semibold text-secondary">4 Days</span>
                    <span className="block font-body text-xs text-on-surface-variant">
                      18.0 hrs total
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-surface-container-highest text-primary font-label text-xs rounded">
                    Optimal Substructure
                  </span>
                  <span className="px-2 py-0.5 bg-surface-container-highest text-primary font-label text-xs rounded">
                    Knapsack &amp; Subset Sum
                  </span>
                  <span className="px-2 py-0.5 bg-surface-container-highest text-primary font-label text-xs rounded">
                    Sequence Alignment
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant font-body text-xs">
                  <span className="flex items-center gap-1 text-secondary font-medium">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    3 Gate Quizzes Programmed
                  </span>
                  <span>Active Mastery Gate: 85%</span>
                </div>
              </div>

              {/* Unit 4 (Priority Flagged) */}
              <div className="p-4 bg-surface-container-low rounded-lg border border-secondary/40 relative overflow-hidden transition-transform hover:-translate-y-0.5 shadow-xs">
                <div className="absolute top-0 right-0 left-0 h-1 bg-secondary"></div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-label text-xs text-secondary uppercase font-semibold">
                        Unit 04
                      </span>
                      <span className="px-1.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-label text-[10px] rounded font-bold uppercase">
                        High Priority
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-primary font-semibold leading-tight">
                      Graph Algorithms
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-label text-sm font-semibold text-secondary">4 Days</span>
                    <span className="block font-body text-xs text-on-surface-variant">
                      18.0 hrs total
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-surface-container-highest text-primary font-label text-xs rounded">
                    Shortest Paths (Dijkstra)
                  </span>
                  <span className="px-2 py-0.5 bg-surface-container-highest text-primary font-label text-xs rounded">
                    Minimum Spanning Trees
                  </span>
                  <span className="px-2 py-0.5 bg-surface-container-highest text-primary font-label text-xs rounded">
                    Bellman-Ford
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant font-body text-xs">
                  <span className="flex items-center gap-1 text-secondary font-medium">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    2 Gate Quizzes Programmed
                  </span>
                  <span>Active Mastery Gate: 80%</span>
                </div>
              </div>
            </div>

            {/* Cumulative Readiness */}
            <div className="mt-6 p-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-on-tertiary-fixed-variant">
                  task_alt
                </span>
                <div>
                  <span className="font-label text-sm font-semibold block leading-tight">
                    Syllabus Breakdown Ready
                  </span>
                  <span className="font-body text-xs text-on-tertiary-fixed-variant">
                    13 Core Days + 5 Days Buffer remaining before Nov 15
                  </span>
                </div>
              </div>
              <span className="font-label text-xs px-2.5 py-1 bg-surface-container-lowest text-on-tertiary-fixed-variant font-bold rounded uppercase">
                100% Synced
              </span>
            </div>
          </section>

          {/* Academic Folio Reference Artifact / Marginalia */}
          <aside className="p-6 bg-surface-container-low rounded-lg border border-outline-variant/60 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-base">history_edu</span>
              <span className="font-label text-xs uppercase tracking-wider font-semibold">
                Pedagogical Apparatus Note
              </span>
            </div>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Units tagged with <em className="font-serif">High Priority</em> automatically configure
              diagnostic checkpoints (&ldquo;Quiz Gates&rdquo;) in the StudyGate pipeline. Scholars must
              achieve the target threshold prior to unlocking subsequent downstream review modules.
            </p>
            <div className="pt-2 flex items-center gap-3 text-on-surface-variant font-body text-xs border-t border-outline-variant/30">
              <span>Buffer Margin: +5 Days for Mock Expository</span>
              <span>•</span>
              <span className="text-secondary font-medium cursor-pointer hover:underline">
                Inspect Rubric Source
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
