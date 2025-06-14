"use client"

import { useState } from "react"
import type { Task } from "@/app/lib/definitions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Filter, ArrowUpDown } from "lucide-react"
import { formatDate } from "@/app/lib/utils"
import TaskEditDialog from "@/components/task-edit-dialog"
import TaskDeleteDialog from "@/components/task-delete-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface TaskListProps {
  tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dueDate")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleTaskUpdated = (updatedTask: Task) => {
    queryClient.setQueryData(['tasks'], (oldData: Task[] | undefined) => {
      if (!oldData) return [updatedTask]
      return oldData.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    })
    setEditTask(null)
  }

  const handleTaskDeleted = (taskId: string) => {
    queryClient.setQueryData(['tasks'], (oldData: Task[] | undefined) => {
      if (!oldData) return []
      return oldData.filter((task) => task.id !== taskId)
    })
    setDeleteTask(null)
  }

  const handleTaskCompleted = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la tâche')
      }

      const updatedTask = await response.json()
      queryClient.setQueryData(['tasks'], (oldData: Task[] | undefined) => {
        if (!oldData) return []
        return oldData.map((task) => (task.id === taskId ? updatedTask : task))
      })

      toast({
        title: "Tâche mise à jour",
        description: "Le statut de la tâche a été mis à jour avec succès.",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to update task status:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la tâche.",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "medium":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  // Filtrer les tâches
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed)
    
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesPriority && matchesSearch
  })

  // Trier les tâches
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case "priority":
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      case "title":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">Aucune tâche trouvée. Créez votre première tâche!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Rechercher une tâche..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="pending">En cours</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les priorités</SelectItem>
              <SelectItem value="HIGH">Haute</SelectItem>
              <SelectItem value="MEDIUM">Moyenne</SelectItem>
              <SelectItem value="LOW">Basse</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Date d'échéance</SelectItem>
              <SelectItem value="priority">Priorité</SelectItem>
              <SelectItem value="title">Titre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedTasks.map((task) => (
          <Card
            key={task.id}
            className={`border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden ${task.completed ? "opacity-70" : ""}`}
          >
            <div
              className={`h-1 w-full ${
                task.priority === "HIGH" ? "bg-red-500" : task.priority === "MEDIUM" ? "bg-amber-500" : "bg-green-500"
              }`}
            />
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskCompleted(task.id, checked === true)}
                    className="h-5 w-5"
                  />
                  <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </h3>
                </div>
                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
              </div>
              <p className={`text-sm mb-3 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.description}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Échéance: {formatDate(task.dueDate)}</p>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                    onClick={() => setEditTask(task)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                    onClick={() => setDeleteTask(task)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editTask && (
        <TaskEditDialog
          task={editTask}
          open={!!editTask}
          onOpenChange={() => setEditTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {deleteTask && (
        <TaskDeleteDialog
          task={deleteTask}
          open={!!deleteTask}
          onOpenChange={() => setDeleteTask(null)}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </div>
  )
}
