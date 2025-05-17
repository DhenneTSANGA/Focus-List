"use server"

import { revalidatePath } from "next/cache"
import type { Task } from "@/app/lib/definitions"
import { createTaskInDb, updateTaskInDb, deleteTaskFromDb, completeTaskInDb } from "@/app/lib/tasks"

export async function createTask(taskData: {
  title: string
  description: string
  priority: string
  dueDate: string
}) {
  const task = await createTaskInDb({
    ...taskData,
    completed: false,
  })

  revalidatePath("/dashboard")
  return task
}

export async function updateTask(task: Task) {
  const updatedTask = await updateTaskInDb(task)
  revalidatePath("/dashboard")
  return updatedTask
}

export async function deleteTask(taskId: string) {
  await deleteTaskFromDb(taskId)
  revalidatePath("/dashboard")
}

export async function completeTask(taskId: string, completed: boolean) {
  const updatedTask = await completeTaskInDb(taskId, completed)
  revalidatePath("/dashboard")
  return updatedTask
}
