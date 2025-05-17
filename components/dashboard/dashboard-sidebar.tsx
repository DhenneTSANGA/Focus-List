"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, Settings, PlusCircle } from "lucide-react"
import { useState } from "react"
import TaskCreateDialog from "@/components/task-create-dialog"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)

  const routes = [
    {
      name: "Tableau de bord",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tâches",
      href: "/dashboard/tasks",
      icon: CheckSquare,
    },
    {
      name: "Calendrier",
      href: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      name: "Statistiques",
      href: "/dashboard/stats",
      icon: BarChart3,
    },
    {
      name: "Paramètres",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-screen sticky top-0">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
              Trello
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6 px-4">
          <Button
            className="w-full mb-6 rounded-full shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90"
            onClick={() => setIsCreateTaskOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>

          <nav className="space-y-1.5">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start rounded-lg", pathname === route.href && "bg-muted font-medium")}
                >
                  <route.icon className="mr-2 h-5 w-5" />
                  {route.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-1">Besoin d'aide?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Consultez notre centre d'aide pour des conseils et astuces.
            </p>
            <Button variant="outline" size="sm" className="w-full rounded-lg">
              Centre d'aide
            </Button>
          </div>
        </div>
      </aside>

      <TaskCreateDialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} />
    </>
  )
}
