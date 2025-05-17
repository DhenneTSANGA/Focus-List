import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/tasks/[taskId] - Récupérer une tâche spécifique
export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const task = await prisma.task.findUnique({
      where: {
        id: params.taskId,
        userId: userId
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Tâche non trouvée' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH /api/tasks/[taskId] - Mettre à jour une tâche
export async function PATCH(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const taskId = params.taskId
    const updates = await request.json()

    console.log('Mise à jour de la tâche:', { taskId, updates, userId })

    // Vérifier que la tâche appartient à l'utilisateur
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: userId
      }
    })

    if (!existingTask) {
      console.log('Tâche non trouvée:', { taskId, userId })
      return NextResponse.json({ error: 'Tâche non trouvée' }, { status: 404 })
    }

    // Préparer les données de mise à jour
    const updateData = {
      ...updates,
      ...(updates.dueDate && { dueDate: new Date(updates.dueDate) })
    }

    console.log('Données de mise à jour:', updateData)

    // Mettre à jour la tâche
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        userId: userId // S'assurer que l'utilisateur est propriétaire
      },
      data: updateData
    })

    console.log('Tâche mise à jour avec succès:', updatedTask)
    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la tâche' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[taskId] - Supprimer une tâche
export async function DELETE(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const taskId = params.taskId

    // Vérifier que la tâche appartient à l'utilisateur
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: userId
      }
    })

    if (!existingTask) {
      return NextResponse.json({ error: 'Tâche non trouvée' }, { status: 404 })
    }

    // Supprimer la tâche
    await prisma.task.delete({
      where: {
        id: taskId,
        userId: userId // S'assurer que l'utilisateur est propriétaire
      }
    })

    return NextResponse.json({ message: 'Tâche supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la tâche' },
      { status: 500 }
    )
  }
} 