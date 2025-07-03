import Link from "next/link";
import { Button } from "@/components/ui/button";
import LayoutContent from "@/components/layout-content";

export default function UnauthorizedPage() {
  return (
    <LayoutContent>
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <h1 className="text-2xl font-bold mb-4">Accès restreint</h1>
        <p className="text-muted-foreground mb-6">
          Vous devez être connecté pour accéder à cette page.
        </p>
        <Link href="/sign-in">
          <Button className="rounded-full px-8">Se connecter</Button>
        </Link>
      </div>
    </LayoutContent>
  );
} 