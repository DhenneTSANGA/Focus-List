"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement du profil...</p>
      </div>
    )
  }

  return (
    <section className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Mon profil : </h1>
      <Card className="w-full max-w-2xl mx-auto mb-6">
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {user.imageUrl && (
              <div className="flex-shrink-0">
                <img src={user.imageUrl} alt="Profile" className="w-32 h-32 lg:w-48 lg:h-48 rounded-full object-cover shadow-lg border-2 border-primary/20" />
              </div>
            )}
            <div className="grid gap-2 text-center md:text-left">
              <p className="text-xl font-bold">
                {user.fullName || "N/A"}
              </p>
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold">Nom d'utilisateur:</span> {user.username || "N/A"}
              </p>
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold">Email:</span> {user.emailAddresses[0]?.emailAddress || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">ID Utilisateur:</span> {user.id}
              </p>
              {/* Vous pouvez ajouter d'autres informations ici */}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </section>
  )
} 