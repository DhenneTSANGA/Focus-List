"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteTask } from "@/app/actions/tasks"
import type { Task } from "@/app/lib/definitions"
import { AlertTriangle } from "lucide-react"

interface TaskDeleteDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskDeleted: (taskId: string) => void
}

export default function TaskDeleteDialog({ task, open, onOpenChange, onTaskDeleted }: TaskDeleteDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteTask(task.id)
      onTaskDeleted(task.id)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-xl">
        <div className="h-2 bg-red-500"></div>
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <DialogTitle className="text-xl">Supprimer la tâche</DialogTitle>
          </div>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette tâche? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="font-medium">{task.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          </div>
        </div>
        <DialogFooter className="px-6 py-4 bg-muted/30">
          <Button type="button" variant="outline" className="rounded-lg" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-lg">
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
