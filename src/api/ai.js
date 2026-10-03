/**
 * StudyGate – AI API Module
 *
 * This file contains every AI-related function the frontend needs.
 * It talks to the Gemini API via the @google/genai SDK and returns
 * plain JavaScript objects.  If VITE_USE_MOCK is "true" in .env,
 * all functions return hardcoded sample data so the rest of the
 * team can keep building without an API key.
 *
 * Exports: extractTopics, buildTasks, generateQuiz, parseJson
 */

import { GoogleGenAI } from "@google/genai";

// ──────────────────────────── config ────────────────────────────

/** Change the model name here only – every function reads this constant. */
const MODEL = "gemma-4-26b-a4b-it";

/** When true, functions return fake data instead of hitting the API. */
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" ||
  import.meta.env.USE_MOCK === "true";

/**
 * SDK client.  Created once on module load.
 * In mock mode the key might be empty – that's fine, we never call the API.
 */
const apiKey =
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.GEMINI_API_KEY ||
  "";

const ai = new GoogleGenAI({ apiKey });

// ──────────────────────────── helpers ───────────────────────────

/** Allowed image MIME types (the only formats we accept). */
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

/**
 * Read a browser File object and return a Part the SDK can send.
 * The Part uses inlineData with the base64-encoded file content.
 */
function fileToPart(file) {
  return new Promise((resolve, reject) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      reject(new Error("Please upload a PNG, JPEG or WebP image."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is "data:<mime>;base64,<data>" – we only need <data>
      const base64 = reader.result.split(",")[1];
      resolve({
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      });
    };
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Send a prompt (with optional image parts) to the model.
 * Returns the raw text string from the model's response.
 *
 * Handles two special error cases:
 *  - 401 → clear "key rejected" message, no retry
 *  - anything else → generic "could not reach" message
 */
async function callGemma(contents) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
    });
    return response.text;
  } catch (err) {
    if (String(err.message).includes("401")) {
      throw new Error(
        "Gemini API key was rejected (401). Check the key or try a new one."
      );
    }
    throw new Error("Could not reach the AI. Please try again.");
  }
}

/**
 * Simulate network latency in mock mode (≈800 ms).
 */
function mockDelay() {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

// ──────────────────────────── parseJson ─────────────────────────

/**
 * Strip markdown code fences and parse JSON.
 * Models often wrap their reply in ```json ... ``` – this handles that.
 *
 * @param {string} text  Raw text from the model.
 * @returns {object}     Parsed JavaScript object.
 * @throws {Error}       If the text is not valid JSON after cleaning.
 */
export function parseJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("The AI returned an invalid answer. Please try again.");
  }
}

// ──────────────────────────── mock data ─────────────────────────

const MOCK_SUBJECTS = {
  subjects: [
    {
      subject: "Data Structures",
      topics: [
        "Arrays and Linked Lists",
        "Stacks and Queues",
        "Trees",
        "Graphs",
        "Hash Tables",
      ],
    },
    {
      subject: "Operating Systems",
      topics: [
        "Process Management",
        "Memory Management",
        "File Systems",
        "Deadlocks",
      ],
    },
  ],
};

const MOCK_QUIZ = {
  questions: [
    {
      question: "What is the time complexity of searching in a balanced BST?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      answer_index: 1,
      explanation:
        "A balanced BST halves the search space at each level, giving O(log n).",
    },
    {
      question: "Which traversal visits the root node first?",
      options: ["Inorder", "Preorder", "Postorder", "Level-order"],
      answer_index: 1,
      explanation: "Preorder visits root, then left subtree, then right subtree.",
    },
    {
      question: "A full binary tree with n internal nodes has how many leaves?",
      options: ["n", "n + 1", "2n", "n - 1"],
      answer_index: 1,
      explanation: "A full binary tree always has exactly n + 1 leaf nodes.",
    },
    {
      question: "What data structure is used in BFS?",
      options: ["Stack", "Queue", "Priority Queue", "Deque"],
      answer_index: 1,
      explanation: "BFS uses a queue to process nodes level by level.",
    },
    {
      question: "Which tree property ensures O(log n) height?",
      options: [
        "Complete",
        "Balanced (AVL / Red-Black)",
        "Full",
        "Perfect",
      ],
      answer_index: 1,
      explanation:
        "Balanced trees like AVL and Red-Black guarantee O(log n) height.",
    },
  ],
};

// ──────────────────────────── prompts ───────────────────────────

const EXTRACTION_PROMPT = `You are helping a university student plan exam preparation.
Look at the attached syllabus image and extract the study topics for each subject.

Return ONLY valid JSON, with no extra text and no markdown fences, in exactly this format:
{"subjects":[{"subject":"Subject name","topics":["Topic 1","Topic 2"]}]}

Rules:
- Group topics under the correct subject.
- Use short topic names (under 60 characters).
- Merge very small sub-topics into one topic.
- Use between 1 and 12 topics per subject.
- If the image is unreadable or is not a syllabus, return {"subjects":[]}.`;

function quizPrompt(subject, topic) {
  return `You are an exam question writer for university students.
Write 5 multiple-choice questions on this topic.

Subject: ${subject}
Topic: ${topic}

Return ONLY valid JSON, with no extra text and no markdown fences, in exactly this format:
{"questions":[{"question":"...","options":["A","B","C","D"],"answer_index":0,"explanation":"one short sentence"}]}

Rules:
- Exactly 5 questions, each with exactly 4 options.
- Exactly one option is correct. answer_index is the position (0 to 3) of the correct option.
- Vary the position of the correct answer across questions.
- University exam difficulty, mix of concept and application questions.
- The wrong options must be plausible, not silly.
- Do not use "all of the above" or "none of the above".`;
}

// ──────────────────────────── validation ────────────────────────

/**
 * Check that a quiz object matches the expected shape:
 *   - exactly 5 questions
 *   - each has 4 non-empty string options
 *   - answer_index is 0–3
 *   - question and explanation are non-empty strings
 *
 * @returns {boolean} true if valid
 */
function isValidQuiz(quiz) {
  if (!quiz || !Array.isArray(quiz.questions)) return false;
  if (quiz.questions.length !== 5) return false;

  return quiz.questions.every((q) => {
    if (typeof q.question !== "string" || q.question.trim() === "") return false;
    if (!Array.isArray(q.options) || q.options.length !== 4) return false;
    if (q.options.some((o) => typeof o !== "string" || o.trim() === ""))
      return false;
    if (!Number.isInteger(q.answer_index) || q.answer_index < 0 || q.answer_index > 3)
      return false;
    if (typeof q.explanation !== "string" || q.explanation.trim() === "")
      return false;
    return true;
  });
}

// ──────────────────────── exported functions ────────────────────

/**
 * 1. extractTopics(syllabusFile)
 *
 * Takes a File object (image) from an <input type="file">,
 * sends it to the model with the extraction prompt,
 * and returns { subjects: [...] }.
 *
 * @param {File} syllabusFile  PNG, JPEG or WebP image of a syllabus.
 * @returns {Promise<{subjects: Array}>}
 */
export async function extractTopics(syllabusFile) {
  // --- mock mode ---
  if (USE_MOCK) {
    await mockDelay();
    return structuredClone(MOCK_SUBJECTS);
  }

  // Convert the image file to a Part the SDK understands
  const imagePart = await fileToPart(syllabusFile);

  // First attempt
  let text = await callGemma([imagePart, EXTRACTION_PROMPT]);
  let result;

  try {
    result = parseJson(text);
  } catch {
    // Retry once if JSON was bad
    text = await callGemma([imagePart, EXTRACTION_PROMPT]);
    result = parseJson(text); // throws if still bad
  }

  // Empty subjects means the image wasn't a recognisable syllabus
  if (
    !result.subjects ||
    !Array.isArray(result.subjects) ||
    result.subjects.length === 0
  ) {
    throw new Error(
      "Couldn't find a syllabus in that image. Try a clearer photo."
    );
  }

  return result;
}

/**
 * 2. buildTasks(subjectsWithDates)
 *
 * Pure date-spreading logic – no API call.
 * Distributes topics evenly from today up to two days before the exam,
 * then adds one "revision" task the day before the exam.
 *
 * @param {Array<{subject:string, exam_date:string, topics:string[]}>} subjectsWithDates
 * @returns {Array<{title:string, subject:string, study_date:string, exam_date:string, type:string}>}
 */
export function buildTasks(subjectsWithDates) {
  const tasks = [];

  // "today" in YYYY-MM-DD, using local time
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const entry of subjectsWithDates) {
    const { subject, exam_date, topics } = entry;
    if (!topics || topics.length === 0) continue;

    const exam = new Date(exam_date + "T00:00:00");

    // Last study day is 2 days before the exam; revision is 1 day before.
    const revisionDay = new Date(exam);
    revisionDay.setDate(revisionDay.getDate() - 1);

    const lastStudyDay = new Date(exam);
    lastStudyDay.setDate(lastStudyDay.getDate() - 2);

    // If the exam is today or in the past, everything goes on today
    const start = new Date(today);
    const end =
      lastStudyDay >= today ? lastStudyDay : new Date(today);

    // Count how many study days are available (inclusive)
    const availableDays = Math.max(
      1,
      Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
    );

    // Spread topics across the available days
    for (let i = 0; i < topics.length; i++) {
      // Map topic index to a day index (wraps when more topics than days)
      const dayOffset = Math.floor((i * availableDays) / topics.length);
      const studyDate = new Date(start);
      studyDate.setDate(studyDate.getDate() + dayOffset);

      tasks.push({
        title: topics[i],
        subject,
        study_date: formatDate(studyDate),
        exam_date,
        type: "study",
      });
    }

    // Revision task: day before the exam (or today if exam is today/past)
    const revisionDate =
      revisionDay >= today ? revisionDay : new Date(today);

    tasks.push({
      title: `Revision – ${subject}`,
      subject,
      study_date: formatDate(revisionDate),
      exam_date,
      type: "revision",
    });
  }

  return tasks;
}

/**
 * 3. generateQuiz(subject, topic)
 *
 * Asks the model for 5 MCQ questions on the given topic.
 * Validates the response shape and retries once on failure.
 *
 * @param {string} subject  e.g. "Data Structures"
 * @param {string} topic    e.g. "Trees"
 * @returns {Promise<{questions: Array}>}
 */
export async function generateQuiz(subject, topic) {
  // --- mock mode ---
  if (USE_MOCK) {
    await mockDelay();
    return structuredClone(MOCK_QUIZ);
  }

  const prompt = quizPrompt(subject, topic);

  // First attempt
  let text = await callGemma(prompt);
  let quiz;

  try {
    quiz = parseJson(text);
  } catch {
    // Bad JSON – retry once
    text = await callGemma(prompt);
    quiz = parseJson(text); // throws if still bad
  }

  if (isValidQuiz(quiz)) return quiz;

  // Validation failed – retry once with same prompt
  text = await callGemma(prompt);
  quiz = parseJson(text);

  if (isValidQuiz(quiz)) return quiz;

  throw new Error("The AI returned an invalid answer. Please try again.");
}

// ──────────────────────────── date util ─────────────────────────

/**
 * Format a Date object as YYYY-MM-DD using local time.
 * @param {Date} d
 * @returns {string}
 */
function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
