import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task } from '@/app/lib/definitions'

async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks')
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des tâches')
  }
  return response.json()
}

async function createTask(taskData: {
  title: string
  description: string
  priority: string
  dueDate: Date
}): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la création de la tâche')
  }

  return response.json()
}

export function useTasks() {
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  })

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // Mettre à jour le cache immédiatement avec la nouvelle tâche
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => [...oldTasks, newTask])
    },
  })

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
  }
} 