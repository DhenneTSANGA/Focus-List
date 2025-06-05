"use client"

import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"

// Définition de l'interface Task (à adapter si vos tâches ont plus de propriétés)
interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

// Définition de l'interface NotificationItem
interface NotificationItem {
  id: string;
  title: string;
  type: 'missed' | 'upcoming';
}

export default function Navbar() {
  const { signOut } = useClerk()
  const { isSignedIn, user } = useUser()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const fetchAndProcessNotifications = async () => {
      if (!isSignedIn) {
        setNotifications([])
        setNotificationCount(0)
        return
      }

      try {
        const response = await fetch('/api/tasks') 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const tasks: Task[] = await response.json()

        const now = new Date()
        const upcoming: NotificationItem[] = []
        const missed: NotificationItem[] = []

        tasks.forEach((task: Task) => {
          const dueDate = new Date(task.dueDate)
          if (!task.completed) {
            if (dueDate < now) {
              missed.push({ id: task.id, title: task.title, type: 'missed' })
            } else {
              const sevenDaysFromNow = new Date()
              sevenDaysFromNow.setDate(now.getDate() + 7)
              if (dueDate <= sevenDaysFromNow) {
                upcoming.push({ id: task.id, title: task.title, type: 'upcoming' })
              }
            }
          }
        })

        const allNotifications = [...missed, ...upcoming]
        setNotifications(allNotifications)
        setNotificationCount(allNotifications.length)

      } catch (error) {
        console.error("Failed to fetch notifications:", error)
        setNotifications([])
        setNotificationCount(0)
      }
    }

    fetchAndProcessNotifications()
  }, [isSignedIn])

  return (
    <header className="container relative z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex h-16 items-center justify-between py-4">

        {/* Section gauche: Nom de l'application */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="font-bold text-base sm:text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500 whitespace-nowrap">
            Focus-List
          </span>
        </Link>

        {/* Section centrale: Bouton "Mes tâches" (visible sur desktop, centré) */}
        {isSignedIn && (
          <div className="flex-grow flex justify-center hidden md:flex">
            <Link 
              href="/tasks" 
              className="font-bold text-lg text-primary hover:text-violet-500 transition-colors whitespace-nowrap"
            >
              Mes tâches
            </Link>
          </div>
        )}

        {/* Section droite: Authentification et Thème (et bouton mobile "Mes tâches" ici) */}
        <nav className="flex items-center gap-6">
          {isSignedIn && (
            <Link 
              href="/tasks" 
              className="font-bold text-sm sm:text-base text-primary hover:text-violet-500 transition-colors whitespace-nowrap md:hidden ml-auto mr-4"
            >
              Mes tâches
            </Link>
          )}
          {!isSignedIn ? (
            <>
              <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
                Se connecter
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" className="rounded-full shadow-sm hover:shadow-md transition-all">
                  S'inscrire
                </Button>
              </Link>
              <ThemeToggle />
            </>
          ) : (
            <>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Notifications ({notificationCount})</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notificationCount === 0 ? (
                    <DropdownMenuItem>
                      Aucune nouvelle notification
                    </DropdownMenuItem>
                  ) : (
                    notifications.map((notif) => (
                      <DropdownMenuItem key={notif.id} className="flex flex-col items-start space-y-1">
                        <span className="font-semibold">{notif.title}</span>
                        <span className={`text-xs ${notif.type === 'missed' ? 'text-red-500' : 'text-yellow-500'}`}>
                          {notif.type === 'missed' ? 'Tâche manquée' : 'Tâche à venir'}
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || "Avatar"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Tableau de bord</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>
      </div>
    </header>
  )
} 