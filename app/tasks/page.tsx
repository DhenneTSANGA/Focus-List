'use client'

import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { useState } from 'react'

export default function TasksPage() {
  const [key, setKey] = useState(0)

  const handleTaskCreated = () => {
    setKey(prev => prev + 1) // Force la mise à jour de la liste
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Mes tâches</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Nouvelle tâche</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <TaskForm onTaskCreated={handleTaskCreated} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Liste des tâches</h2>
        <TaskList key={key} />
      </div>
    </div>
  )
} 