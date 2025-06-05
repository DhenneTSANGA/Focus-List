"use client"

import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  const { signOut } = useClerk()
  const { isSignedIn, user } = useUser()

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
                    <Link href="/user-profile">Profil</Link>
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