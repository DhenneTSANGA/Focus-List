import type { Task } from "./definitions"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function getTasks(): Promise<Task[]> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Non autorisé")
  }

  console.log("Fetching tasks for user:", userId)

  const tasks = await prisma.task.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  console.log("Found tasks:", tasks)

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
