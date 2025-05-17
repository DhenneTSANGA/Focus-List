"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTask } from "@/app/actions/tasks"
import type { Task } from "@/app/lib/definitions"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TaskEditDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdated: (task: Task) => void
}

export default function TaskEditDialog({ task, open, onOpenChange, onTaskUpdated }: TaskEditDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [priority, setPriority] = useState(task.priority)
  const [dueDate, setDueDate] = useState<Date>(new Date(task.dueDate))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dueDate) return

    setLoading(true)
    try {
      const updatedTask = await updateTask({
        id: task.id,
        title,
        description,
        priority,
        dueDate: dueDate.toISOString(),
        completed: task.completed,
        userId: task.userId,
        createdAt: task.createdAt,
        updatedAt: new Date().toISOString(),
      })

      onTaskUpdated(updatedTask)
      router.refresh()
    } catch (error) {
      console.error("Failed to update task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl">
        <div className="h-2 bg-gradient-to-r from-primary to-violet-500"></div>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-xl">Modifier la tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la tâche"
                className="rounded-lg"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la tâche"
                className="rounded-lg"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority" className="rounded-lg">
                    <SelectValue placeholder="Sélectionner une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Date d'échéance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-lg",
                        !dueDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 bg-muted/30">
            <Button type="button" variant="outline" className="rounded-lg" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90"
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
