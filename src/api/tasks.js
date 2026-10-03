/**
 * StudyGate – Data Layer
 *
 * Every Supabase call for the tasks and quiz_attempts tables
 * goes through this file. Components import from here and
 * never talk to Supabase directly (except auth).
 */

import { supabase } from "../supabase";

/** Load all tasks for the current user, ordered by study_date. */
export async function loadTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("study_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Insert multiple tasks at once.
 * The array should NOT include id, user_id, status, or quiz_score —
 * Supabase defaults handle those.
 */
export async function addTasks(tasks) {
  const { data, error } = await supabase
    .from("tasks")
    .insert(tasks)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

/** Update only the status column of one task. */
export async function updateTaskStatus(id, status) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Save a quiz attempt row. */
export async function saveQuizAttempt(taskId, score, total, passed) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({ task_id: taskId, score, total, passed })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Mark a task as done with its quiz score.
 * Called after a quiz is passed (score >= 4).
 */
export async function markTaskDone(id, score) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status: "done", quiz_score: score })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
