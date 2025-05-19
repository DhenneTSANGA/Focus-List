'use client'

import TaskList from "@/components/dashboard/task-list"
import TaskForm from "@/app/components/TaskForm"
import { useTasks } from "@/app/hooks/useTasks"
import LayoutContent from "@/components/layout-content"

export default function TasksPage() {
  const { tasks, isLoading } = useTasks()

  if (isLoading) {
    return (
      <LayoutContent>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">Chargement...</div>
        </div>
      </LayoutContent>
    )
  }

  return (
    <LayoutContent>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Mes tâches</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Nouvelle tâche</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <TaskForm />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Liste des tâches</h2>
          <TaskList tasks={tasks} />
        </div>
      </div>
    </LayoutContent>
  )
} 