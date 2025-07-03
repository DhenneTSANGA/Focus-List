import LayoutContent from '@/components/layout-content'
import { Card } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <LayoutContent>
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
          <div className="space-y-4 text-muted-foreground text-base">
            <p>Votre vie privée est importante pour nous. Voici comment nous traitons vos données :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Les informations personnelles sont utilisées uniquement pour fournir et améliorer le service.</li>
              <li>Nous ne partageons pas vos données avec des tiers sans votre consentement.</li>
              <li>Vous pouvez demander la suppression de votre compte et de vos données à tout moment.</li>
              <li>Des cookies peuvent être utilisés pour améliorer l&apos;expérience utilisateur.</li>
            </ul>
            <p>Pour toute question concernant la confidentialité, contactez-nous via la page de contact.</p>
          </div>
        </Card>
      </div>
    </LayoutContent>
  )
} 