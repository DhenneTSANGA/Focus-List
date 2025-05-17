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
import { completeTask } from "@/app/actions/tasks"
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

interface TaskListProps {
  initialTasks: Task[]
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dueDate")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditTask(null)
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    setDeleteTask(null)
  }

  const handleTaskCompleted = async (taskId: string, completed: boolean) => {
    try {
      const updatedTask = await completeTask(taskId, completed)
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed } : task)))
    } catch (error) {
      console.error("Failed to update task status:", error)
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

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Filter by status
      if (filterStatus === "completed" && !task.completed) return false
      if (filterStatus === "pending" && task.completed) return false

      // Filter by priority
      if (filterPriority !== "all" && task.priority !== filterPriority) return false

      // Filter by search query
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false

      return true
    })
    .sort((a, b) => {
      // Sort by selected field
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "priority":
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return (
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder]
          )
        case "title":
          return a.title.localeCompare(b.title)
        case "createdAt":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        default:
          return 0
      }
    })

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/30">
        <p className="text-muted-foreground">Aucune tâche trouvée. Créez votre première tâche!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Input
            placeholder="Rechercher une tâche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-lg"
          />
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px] rounded-lg">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="pending">En cours</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[130px] rounded-lg">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-lg">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Trier
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Trier par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
                Date d'échéance {sortBy === "dueDate" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("priority")}>
                Priorité {sortBy === "priority" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title")}>Titre {sortBy === "title" && "✓"}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
                Date de création {sortBy === "createdAt" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className={`border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden ${task.completed ? "opacity-70" : ""}`}
          >
            <div
              className={`h-1 w-full ${
                task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-amber-500" : "bg-green-500"
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
