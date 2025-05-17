'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Trash2, Edit, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import TaskEditDialog from '@/components/task-edit-dialog'

interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  completed: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
}

const priorityLabels = {
  LOW: 'Basse',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute',
}

export default function TaskList() {
  const { isLoaded, isSignedIn } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editTask, setEditTask] = useState<Task | null>(null)

  const fetchTasks = async () => {
    if (!isLoaded || !isSignedIn) return

    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des tâches')
      }
      
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      console.error('Erreur fetchTasks:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [isLoaded, isSignedIn])

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const updateData = { completed: !completed }
      console.log('Tentative de mise à jour de la tâche:', {
        taskId,
        updateData,
        currentState: tasks.find(t => t.id === taskId)
      })
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      const responseData = await response.json()
      console.log('Réponse du serveur:', {
        status: response.status,
        ok: response.ok,
        data: responseData
      })

      if (!response.ok) {
        throw new Error(responseData.error || 'Erreur lors de la mise à jour de la tâche')
      }

      // Mettre à jour la liste localement avec la réponse du serveur
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? responseData : task
        )
      )
      console.log('État mis à jour avec succès')
    } catch (err) {
      console.error('Erreur toggleTaskCompletion:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
    setEditTask(null)
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression de la tâche')
      }
      
      // Mettre à jour la liste localement
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (err) {
      console.error('Erreur deleteTask:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  if (!isLoaded || !isSignedIn) {
    return null
  }

  if (isLoading) {
    return <div>Chargement des tâches...</div>
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Erreur: {error}</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => {
            setError(null)
            fetchTasks()
          }}
        >
          Réessayer
        </Button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return <div className="text-center text-gray-500">Aucune tâche pour le moment</div>
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className={task.completed ? 'opacity-75' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className={task.completed ? 'line-through' : ''}>
                  {task.title}
                </CardTitle>
                <CardDescription>
                  Échéance : {format(new Date(task.dueDate), 'PPP', { locale: fr })}
                </CardDescription>
              </div>
              <Badge className={priorityColors[task.priority]}>
                {priorityLabels[task.priority]}
              </Badge>
            </div>
          </CardHeader>
          
          {task.description && (
            <CardContent>
              <p className="text-sm text-gray-600">{task.description}</p>
            </CardContent>
          )}
          
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleTaskCompletion(task.id, task.completed)}
            >
              <CheckCircle2 className={cn(
                "h-5 w-5",
                task.completed ? "text-green-500" : "text-gray-400"
              )} />
            </Button>
            
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setEditTask(task)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}

      {editTask && (
        <TaskEditDialog
          task={editTask}
          open={!!editTask}
          onOpenChange={() => setEditTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  )
} 