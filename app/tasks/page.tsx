'use client'

import TaskList from "@/components/dashboard/task-list"
import TaskForm from "@/app/components/TaskForm"
import { useTasks } from "@/app/hooks/useTasks"
import LayoutContent from "@/components/layout-content"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

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
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground gap-2">
              <ArrowLeft className="h-5 w-5" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Mes tâches</h1>
        </div>
        
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