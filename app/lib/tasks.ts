import type { Task } from "./definitions"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

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
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Non autorisé")
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return tasks
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Non autorisé")
  }

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
      userId: userId
    }
  })

  return task
}

export async function createTaskInDb(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Non autorisé")
  }

  const newTask = await prisma.task.create({
    data: {
      ...task,
      userId
    }
  })

  return newTask
}

export async function updateTaskInDb(task: Task): Promise<Task> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Non autorisé")
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: task.id,
      userId: userId
    },
    data: {
      ...task,
      updatedAt: new Date()
    }
  })

  return updatedTask
}

export async function deleteTaskFromDb(taskId: string): Promise<void> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Non autorisé")
  }

  await prisma.task.delete({
    where: {
      id: taskId,
      userId: userId
    }
  })
}

export async function completeTaskInDb(taskId: string, completed: boolean): Promise<Task> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Non autorisé")
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
      userId: userId
    },
    data: {
      completed,
      updatedAt: new Date()
    }
  })

  return updatedTask
}
