import LayoutContent from '@/components/layout-content'
import { Card } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <LayoutContent>
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Conditions d&apos;utilisation</h1>
          <div className="space-y-4 text-muted-foreground text-base">
            <p>Bienvenue sur Focus-List. En utilisant ce site, vous acceptez les conditions suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vous êtes responsable de la confidentialité de votre compte et de vos informations.</li>
              <li>Vous ne devez pas utiliser l&apos;application à des fins illégales ou non autorisées.</li>
              <li>Focus-List ne pourra être tenu responsable de la perte de données ou de l&apos;inaccessibilité du service.</li>
              <li>Nous nous réservons le droit de modifier ces conditions à tout moment.</li>
            </ul>
            <p>Pour toute question, contactez-nous via la page de contact.</p>
          </div>
        </Card>
      </div>
    </LayoutContent>
  )
} 