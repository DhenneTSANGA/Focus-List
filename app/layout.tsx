import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Focus-List - Gestion de tâches",
  description: "Application de gestion de tâches personnelles avec authentification sécurisée",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
