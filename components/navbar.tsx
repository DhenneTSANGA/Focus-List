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
    <header className="container z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
            Focus-List
          </span>
        </Link>

        {/* Navigation centrale */}
        {isSignedIn && (
          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link 
              href="/tasks" 
              className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500 hover:opacity-80 transition-opacity px-4 py-2"
            >
              Mes tâches
            </Link>
          </nav>
        )}

        <nav className="flex items-center gap-6">
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
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || "Avatar"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.firstName?.[0] || user.emailAddresses[0].emailAddress[0].toUpperCase()}
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
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
} 