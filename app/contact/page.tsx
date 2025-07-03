"use client";
import LayoutContent from '@/components/layout-content'
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ContactPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/unauthorized");
    }
  }, [isLoaded, isSignedIn, router]);
  if (!isLoaded || !isSignedIn) {
    return null;
  }
  return (
    <LayoutContent>
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Contact</h1>
        <form className="space-y-6 bg-background rounded-lg shadow p-6 border border-border/50">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Nom</label>
            <input id="name" name="name" type="text" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" name="email" type="email" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea id="message" name="message" rows={5} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
          </div>
          <button type="submit" className="w-full rounded-full bg-primary text-primary-foreground py-2 font-semibold shadow hover:bg-primary/90 transition-colors">Envoyer</button>
        </form>
      </div>
    </LayoutContent>
  )
} 