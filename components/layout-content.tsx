'use client'

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {!isDashboard && <Navbar />}
      {children}
    </ThemeProvider>
  )
} 