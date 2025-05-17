"use client"

import { useState } from "react"
import type { Task } from "@/app/lib/definitions"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { formatDate } from "@/app/lib/utils"
import TaskEditDialog from "@/components/task-edit-dialog"
import TaskDeleteDialog from "@/components/task-delete-dialog"
import { completeTask } from "@/app/actions/tasks"
import { Checkbox } from "@/components/ui/checkbox"

interface TaskListProps {
  initialTasks: Task[]
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)

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
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">Aucune tâche trouvée. Créez votre première tâche!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card key={task.id} className={task.completed ? "opacity-70" : ""}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className={`text-lg ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </CardTitle>
              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.description}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Échéance: {formatDate(task.dueDate)}</p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={(checked) => handleTaskCompleted(task.id, checked === true)}
              />
              <label
                htmlFor={`task-${task.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {task.completed ? "Terminée" : "Marquer comme terminée"}
              </label>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setEditTask(task)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteTask(task)}>
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
