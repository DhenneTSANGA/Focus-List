"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TaskCreateDialog from "@/components/task-create-dialog"

export default function CreateTaskButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle tâche
      </Button>
      <TaskCreateDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
