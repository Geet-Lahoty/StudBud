import { supabase } from '../lib/supabase'

export async function getTasks(projectId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('position', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export async function createTask({
  projectId,
  title,
  description = null,
  dueDate = null,
  position = 0,
}) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      project_id: projectId,
      title,
      description,
      due_date: dueDate,
      status: 'todo',
      position,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateTask(taskId, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function moveTask(taskId, status, position) {
  return updateTask(taskId, {
    status,
    position,
  })
}

export async function deleteTask(taskId) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) {
    throw error
  }
}