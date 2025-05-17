import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// GET /api/tasks - Récupérer toutes les tâches de l'utilisateur
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/tasks - Créer une nouvelle tâche
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { title, description, dueDate, priority } = await request.json()

    if (!title || !dueDate) {
      return NextResponse.json({ error: 'Titre et date requise' }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        userId
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 