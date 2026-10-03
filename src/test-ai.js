/**
 * StudyGate – AI Module Test Script
 *
 * Run this file by importing it in a temp page served by Vite,
 * or open test-ai.html in the browser while `npm run dev` is running.
 *
 * This is NOT part of the final app — delete before shipping.
 */

import { extractTopics, buildTasks, generateQuiz, parseJson } from "./api/ai";

// ────── Utility ──────

function log(label, data) {
  console.log(`\n✅ ${label}`);
  console.log(JSON.stringify(data, null, 2));
}

function fail(label, err) {
  console.error(`\n❌ ${label}: ${err.message}`);
}

// ────── parseJson tests ──────

function testParseJson() {
  console.group("parseJson tests");

  // Normal JSON
  const a = parseJson('{"foo":1}');
  console.assert(a.foo === 1, "plain JSON");

  // Fenced JSON
  const b = parseJson('```json\n{"bar":2}\n```');
  console.assert(b.bar === 2, "fenced JSON");

  // Bad JSON should throw
  try {
    parseJson("not json at all");
    console.error("FAIL: should have thrown");
  } catch (e) {
    console.assert(
      e.message === "The AI returned an invalid answer. Please try again.",
      "correct error message"
    );
  }

  console.log("parseJson ✅ all passed");
  console.groupEnd();
}

// ────── buildTasks tests ──────

function testBuildTasks() {
  console.group("buildTasks tests");

  // Normal case: exam in the future
  const future = buildTasks([
    {
      subject: "Data Structures",
      exam_date: "2026-11-15",
      topics: ["Arrays", "Trees", "Graphs"],
    },
  ]);
  log("Future exam tasks", future);
  console.assert(future.length === 4, "3 study + 1 revision = 4 tasks");
  console.assert(
    future.filter((t) => t.type === "revision").length === 1,
    "exactly 1 revision"
  );
  console.assert(
    future.every((t) => t.exam_date === "2026-11-15"),
    "exam_date preserved"
  );
  console.assert(
    future.filter((t) => t.type === "study").every((t) => !t.title.startsWith("Revision")),
    "study tasks are not labelled revision"
  );

  // Past exam: everything on today
  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const past = buildTasks([
    {
      subject: "OS",
      exam_date: "2020-01-01",
      topics: ["Processes", "Memory"],
    },
  ]);
  log("Past exam tasks", past);
  console.assert(
    past.every((t) => t.study_date === todayStr),
    "past exam: all dates are today"
  );

  // Multiple subjects
  const multi = buildTasks([
    {
      subject: "A",
      exam_date: "2026-12-01",
      topics: ["T1", "T2"],
    },
    {
      subject: "B",
      exam_date: "2026-12-10",
      topics: ["X1"],
    },
  ]);
  log("Multi-subject tasks", multi);
  console.assert(multi.length === 5, "2+1 + 1+1 = 5 tasks");

  console.log("buildTasks ✅ all passed");
  console.groupEnd();
}

// ────── extractTopics test (mock mode) ──────

async function testExtractTopicsMock() {
  console.group("extractTopics (mock mode)");
  try {
    // Create a fake File for mock mode (content doesn't matter)
    const blob = new Blob(["fake"], { type: "image/png" });
    const file = new File([blob], "syllabus.png", { type: "image/png" });

    const result = await extractTopics(file);
    log("Mock extractTopics", result);
    console.assert(Array.isArray(result.subjects), "subjects is an array");
    console.assert(result.subjects.length > 0, "at least one subject");
    console.assert(
      result.subjects[0].topics.length > 0,
      "at least one topic"
    );
    console.log("extractTopics (mock) ✅ passed");
  } catch (e) {
    fail("extractTopics mock", e);
  }
  console.groupEnd();
}

// ────── generateQuiz test (mock mode) ──────

async function testGenerateQuizMock() {
  console.group("generateQuiz (mock mode)");
  try {
    const quiz = await generateQuiz("Data Structures", "Trees");
    log("Mock generateQuiz", quiz);
    console.assert(quiz.questions.length === 5, "exactly 5 questions");
    console.assert(
      quiz.questions.every((q) => q.options.length === 4),
      "4 options each"
    );
    console.assert(
      quiz.questions.every(
        (q) => Number.isInteger(q.answer_index) && q.answer_index >= 0 && q.answer_index <= 3
      ),
      "answer_index 0-3"
    );
    console.log("generateQuiz (mock) ✅ passed");
  } catch (e) {
    fail("generateQuiz mock", e);
  }
  console.groupEnd();
}

// ────── Run all ──────

async function runAll() {
  console.log("═══════════════════════════════════════");
  console.log("  StudyGate AI Module – Test Suite");
  console.log("═══════════════════════════════════════");

  testParseJson();
  testBuildTasks();
  await testExtractTopicsMock();
  await testGenerateQuizMock();

  console.log("\n🎉 All tests finished. Check results above.");
}

runAll();
