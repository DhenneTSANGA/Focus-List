import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trello - Gestion de tâches",
  description: "Application de gestion de tâches personnelles avec authentification sécurisée",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navbar />
            <main>
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
