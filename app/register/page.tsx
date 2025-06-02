"use client"

import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container flex justify-between items-center py-4">
        <Link href="/" className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">Retour à l'accueil</span>
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <Card className="w-full max-w-md border-border/50 shadow-xl p-4">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90 transition-all",
                card: "bg-transparent shadow-none border-0",
                headerTitle: "text-2xl font-bold",
                headerSubtitle: "text-muted-foreground"
              }
            }}
            redirectUrl="/dashboard"
          />
        </Card>
      </div>
    </div>
  )
}
