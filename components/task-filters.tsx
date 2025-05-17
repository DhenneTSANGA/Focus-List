"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function TaskFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [priority, setPriority] = useState(searchParams.get("priority") || "all")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "dueDate")

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (status !== "all") params.set("status", status)
    if (priority !== "all") params.set("priority", priority)
    if (sortBy !== "dueDate") params.set("sortBy", sortBy)

    router.push(`/dashboard?${params.toString()}`)
  }

  const resetFilters = () => {
    setStatus("all")
    setPriority("all")
    setSortBy("dueDate")
    router.push("/dashboard")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Statut</Label>
          <RadioGroup value={status} onValueChange={setStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Tous</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed">Terminées</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="pending" />
              <Label htmlFor="pending">En cours</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Priorité</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les priorités" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Trier par</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Date d'échéance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Date d'échéance</SelectItem>
              <SelectItem value="priority">Priorité</SelectItem>
              <SelectItem value="title">Titre</SelectItem>
              <SelectItem value="createdAt">Date de création</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2 pt-2">
          <Button onClick={applyFilters}>Appliquer les filtres</Button>
          <Button variant="outline" onClick={resetFilters}>
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
