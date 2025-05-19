'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTasks } from '@/app/hooks/useTasks'

export default function TaskForm() {
  const { isLoaded, isSignedIn } = useAuth()
  const { createTask, isCreating } = useTasks()
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !isSignedIn || !date) return

    setError(null)

    try {
      await createTask({
        ...formData,
        dueDate: date,
      })

      // Réinitialiser le formulaire
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM'
      })
      setDate(undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Titre de la tâche"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Description (optionnelle)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP', { locale: fr }) : 'Sélectionner une date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Select
          value={formData.priority}
          onValueChange={(value: 'LOW' | 'MEDIUM' | 'HIGH') =>
            setFormData({ ...formData, priority: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Basse</SelectItem>
            <SelectItem value="MEDIUM">Moyenne</SelectItem>
            <SelectItem value="HIGH">Haute</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button type="submit" disabled={isCreating}>
        {isCreating ? 'Création...' : 'Créer la tâche'}
      </Button>
    </form>
  )
} 