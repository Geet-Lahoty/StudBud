/**
 * SyllabusUpload – Image upload → AI extraction → exam dates → generate tasks.
 *
 * Props:
 *   onDone – called after tasks are saved to Supabase
 */
import { useState, useRef } from "react";
import { extractTopics, buildTasks } from "../api/ai";
import { addTasks } from "../api/tasks";
import { compressImage } from "../utils/image";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function SyllabusUpload({ onDone }) {
  // Step: "pick" → "review" → "saving"
  const [step, setStep] = useState("pick");

  // Image pick
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  // AI extraction result
  const [subjects, setSubjects] = useState([]);
  const [examDates, setExamDates] = useState({});

  // Loading / error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Pick image ──
  const handleFile = async (picked) => {
    if (!picked) return;
    if (!ALLOWED_TYPES.includes(picked.type)) {
      setError("Please upload a PNG, JPEG or WebP image.");
      return;
    }
    setError(null);

    // Compress
    let compressed;
    try {
      compressed = await compressImage(picked);
    } catch {
      compressed = picked; // fallback to original
    }

    setFile(compressed);
    setPreview(URL.createObjectURL(compressed));
  };

  // ── Extract topics ──
  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await extractTopics(file);
      setSubjects(result.subjects);
      // Initialize exam dates (empty)
      const dates = {};
      result.subjects.forEach((s) => {
        dates[s.subject] = "";
      });
      setExamDates(dates);
      setStep("review");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Edit topics ──
  const removeTopic = (subjectIdx, topicIdx) => {
    setSubjects((prev) => {
      const copy = structuredClone(prev);
      copy[subjectIdx].topics.splice(topicIdx, 1);
      if (copy[subjectIdx].topics.length === 0) {
        copy.splice(subjectIdx, 1);
      }
      return copy;
    });
  };

  // ── Generate & save tasks ──
  const handleGeneratePlan = async () => {
    // Validate all exam dates are set
    for (const s of subjects) {
      if (!examDates[s.subject]) {
        setError(`Please set an exam date for "${s.subject}".`);
        return;
      }
    }
    setError(null);
    setLoading(true);
    setStep("saving");

    try {
      const input = subjects.map((s) => ({
        subject: s.subject,
        exam_date: examDates[s.subject],
        topics: s.topics,
      }));
      const taskList = buildTasks(input);
      await addTasks(taskList);
      onDone();
    } catch (err) {
      setError(err.message);
      setStep("review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-primary font-bold">
          Upload Syllabus
        </h1>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Take a photo of your syllabus. AI will extract topics per subject.
        </p>
      </div>

      {/* Error box */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="font-label text-xs font-semibold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Step 1: Pick image */}
      {step === "pick" && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 sm:p-8">
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              className="group cursor-pointer p-10 rounded-lg bg-surface-container-low border-2 border-dashed border-outline-variant hover:border-secondary transition-all flex flex-col items-center justify-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center mb-4 text-secondary">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <p className="font-serif text-lg text-primary font-semibold mb-1">
                Choose a syllabus image
              </p>
              <p className="font-body text-sm text-on-surface-variant mb-3">
                PNG, JPEG, or WebP — click or drag to upload
              </p>
              <span className="px-3 py-1 bg-surface-container text-on-surface-variant font-label text-xs rounded uppercase">
                PNG · JPEG · WebP
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low">
                <img
                  src={preview}
                  alt="Syllabus preview"
                  className="w-full max-h-80 object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-surface-container-lowest/80 rounded-lg text-on-surface-variant hover:text-error cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleExtract}
                disabled={loading}
                className="w-full py-3.5 bg-primary text-on-primary rounded-lg font-label text-xs uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">
                      progress_activity
                    </span>
                    Extracting topics…
                  </>
                ) : (
                  <>
                    Extract Topics with AI
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Review subjects & set exam dates */}
      {step === "review" && (
        <div className="flex flex-col gap-6">
          {subjects.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 text-center">
              <p className="font-body text-sm text-on-surface-variant">
                No subjects found. Try a different image.
              </p>
              <button
                type="button"
                onClick={() => setStep("pick")}
                className="mt-4 px-4 py-2 bg-primary text-on-primary font-label text-xs uppercase rounded-lg cursor-pointer"
              >
                Upload another image
              </button>
            </div>
          ) : (
            <>
              {subjects.map((s, si) => (
                <div
                  key={s.subject}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-lg text-primary font-semibold">
                      {s.subject}
                    </h3>
                    <span className="font-label text-xs text-on-surface-variant">
                      {s.topics.length} topics
                    </span>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {s.topics.map((topic, ti) => (
                      <div
                        key={ti}
                        className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full border border-outline-variant/60"
                      >
                        <span className="font-body text-sm text-on-surface">
                          {topic}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTopic(si, ti)}
                          className="text-on-surface-variant hover:text-error cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Exam date */}
                  <div className="flex items-center gap-3">
                    <label className="font-label text-xs uppercase tracking-wider text-on-surface font-semibold shrink-0">
                      Exam date
                    </label>
                    <input
                      type="date"
                      required
                      value={examDates[s.subject] || ""}
                      onChange={(e) =>
                        setExamDates({ ...examDates, [s.subject]: e.target.value })
                      }
                      className="flex-1 max-w-xs bg-surface-container-low px-3 py-2 text-primary font-body text-sm rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("pick")}
                  className="px-4 py-3 border border-outline-variant rounded-lg font-label text-xs uppercase text-on-surface-variant cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  disabled={loading}
                  className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-label text-xs uppercase tracking-wider font-semibold hover:bg-primary-container shadow-sm disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">
                        progress_activity
                      </span>
                      Saving tasks…
                    </>
                  ) : (
                    <>
                      Generate Study Plan
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Saving feedback */}
      {step === "saving" && loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="material-symbols-outlined text-4xl text-secondary animate-spin">
            progress_activity
          </span>
          <span className="font-label text-sm text-on-surface-variant">
            Building your study plan…
          </span>
        </div>
      )}
    </div>
  );
}
