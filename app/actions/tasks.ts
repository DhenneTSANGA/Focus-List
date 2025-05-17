"use server"

import { revalidatePath } from "next/cache"
import type { Task } from "@/app/lib/definitions"
import { createTaskInDb, updateTaskInDb, deleteTaskFromDb, completeTaskInDb } from "@/app/lib/tasks"
import { headers } from "next/headers"
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export async function createTask(taskData: {
  title: string
  description: string
  priority: string
  dueDate: string
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Non autorisé');
  }

  const task = await prisma.task.create({
    data: {
      ...taskData,
      completed: false,
      userId: userId
    }
  });

  revalidatePath("/dashboard")
  return task
}

export async function updateTask(task: Task) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Non autorisé');
    }

    // Vérifier que la tâche appartient à l'utilisateur
    const existingTask = await prisma.task.findFirst({
      where: {
        id: task.id,
        userId: userId
      }
    });

    if (!existingTask) {
      throw new Error('Tâche non trouvée');
    }

    // Mettre à jour la tâche
    const updatedTask = await prisma.task.update({
      where: {
        id: task.id,
        userId: userId
      },
      data: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: new Date(task.dueDate),
        completed: task.completed,
      }
    });

    revalidatePath("/dashboard");
    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTask(taskId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Non autorisé');
  }

  await prisma.task.delete({
    where: {
      id: taskId,
      userId: userId
    }
  });

  revalidatePath("/dashboard")
}

export async function completeTask(taskId: string, completed: boolean) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Non autorisé');
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
      userId: userId
    },
    data: {
      completed
    }
  });

  revalidatePath("/dashboard")
  return updatedTask
}
