import type { Task } from "./definitions"

// Mock database for tasks (replace with actual database in production)
let tasks: Task[] = [
  {
    id: "1",
    title: "Créer une présentation",
    description: "Préparer une présentation pour la réunion de lundi",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Répondre aux emails",
    description: "Traiter les emails en attente dans la boîte de réception",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Planifier la réunion d'équipe",
    description: "Organiser la réunion hebdomadaire et préparer l'ordre du jour",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "low",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function getTasks(): Promise<Task[]> {
  // In a real app, you would query your database
  return tasks
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const task = tasks.find((t) => t.id === taskId)
  return task || null
}

export async function createTaskInDb(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
  const newTask: Task = {
    ...task,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  tasks.push(newTask)
  return newTask
}

export async function updateTaskInDb(task: Task): Promise<Task> {
  const index = tasks.findIndex((t) => t.id === task.id)

  if (index === -1) {
    throw new Error("Task not found")
  }

  const updatedTask = {
    ...task,
    updatedAt: new Date().toISOString(),
  }

  tasks[index] = updatedTask
  return updatedTask
}

export async function deleteTaskFromDb(taskId: string): Promise<void> {
  tasks = tasks.filter((task) => task.id !== taskId)
}

export async function completeTaskInDb(taskId: string, completed: boolean): Promise<Task> {
  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    throw new Error("Task not found")
  }

  const updatedTask = {
    ...task,
    completed,
    updatedAt: new Date().toISOString(),
  }

  return updateTaskInDb(updatedTask)
}
