"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerUser } from "@/app/actions/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { AtSign, KeyRound, ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    try {
      const result = await registerUser(email, password)
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Une erreur est survenue lors de l'inscription")
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

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
        <Card className="w-full max-w-md border-border/50 shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold text-xl">
                T
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
            <CardDescription className="text-center">
              Entrez vos informations pour créer un compte Focus-List
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-in fade-in-50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemple@email.com"
                    className="pl-10 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" name="password" type="password" className="pl-10 rounded-lg" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="pl-10 rounded-lg"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90 transition-all"
                disabled={loading}
              >
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
              <div className="text-center text-sm">
                Vous avez déjà un compte?{" "}
                <Link href="/login" className="text-primary hover:underline underline-offset-4 font-medium">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
