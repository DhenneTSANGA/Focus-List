import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import LayoutContent from "@/components/layout-content"

export default function Home() {
  return (
    <LayoutContent>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
        <main className="flex-1">
          <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
            {/* Cercles décoratifs en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-background via-background/80 to-background/20"></div>
            </div>

            <div className="container relative z-10 px-4 md:px-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Contenu texte */}
                <div className="flex flex-col space-y-8 text-center lg:text-left">
                  <div className="space-y-6">
                    <div className="inline-block animate-fade-in">
                      <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-primary/20">
                        ✨ Découvrez la nouvelle version
                      </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-pink-500">
                        Organisez votre vie,
                      </span>
                      <br />
                      simplifiez votre quotidien
                    </h1>
                    
                    <p className="text-xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
                      Une application intuitive et élégante pour gérer vos tâches, atteindre vos objectifs et rester
                      productif. Commencez dès aujourd'hui.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link href="/tasks">
                      <Button
                        size="lg"
                        className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90"
                      >
                        Commencer gratuitement
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Statistiques */}
                  <div className="grid grid-cols-3 gap-8 pt-8 mt-4 border-t border-border/50">
                    <div className="text-center lg:text-left">
                      <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">10k+</div>
                      <div className="text-sm text-muted-foreground mt-1">Utilisateurs actifs</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500">1M+</div>
                      <div className="text-sm text-muted-foreground mt-1">Tâches créées</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-primary">99%</div>
                      <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
                    </div>
                  </div>
                </div>

                {/* Image d'illustration */}
                <div className="relative lg:ml-auto">
                  <div className="relative w-full max-w-[600px] mx-auto aspect-square">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-violet-500/20 rounded-full blur-3xl"></div>
                    <div className="relative bg-gradient-to-b from-background to-background/5 rounded-3xl p-4 backdrop-blur-sm border border-border/50">
                      <Image
                        src="/pic1.avif"
                        alt="Illustration de l'application de gestion de tâches"
                        width={600}
                        height={600}
                        className="w-full h-auto rounded-2xl shadow-2xl"
                        priority
                      />
                      {/* Éléments décoratifs flottants */}
                      <div className="absolute -top-8 -right-8 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-border/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-border/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-violet-500"
                        >
                          <path d="M12 8v4l2 2" />
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background z-0"></div>
            <div className="container relative z-10 px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-3 items-stretch">
                <div className="flex flex-col h-full p-6 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all border border-border/50">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Créez et organisez</h3>
                  <p className="text-muted-foreground flex-1">
                    Ajoutez facilement de nouvelles tâches avec titre, description, date d'échéance et priorité.
                    Organisez-les selon vos besoins.
                  </p>
                </div>
                <div className="flex flex-col h-full p-6 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all border border-border/50">
                  <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-violet-500"
                    >
                      <path d="M2 20h20" />
                      <path d="M5 4v6" />
                      <path d="M5 14v2" />
                      <path d="M12 4v4" />
                      <path d="M12 12v6" />
                      <path d="M19 4v2" />
                      <path d="M19 10v10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Suivez votre progression</h3>
                  <p className="text-muted-foreground flex-1">
                    Visualisez votre productivité avec des statistiques claires et des graphiques intuitifs. Restez motivé
                    en voyant vos accomplissements.
                  </p>
                </div>
                <div className="flex flex-col h-full p-6 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all border border-border/50">
                  <div className="h-12 w-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-pink-500"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M12 8v4l2 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ne manquez aucune échéance</h3>
                  <p className="text-muted-foreground flex-1">
                    Recevez des rappels pour vos tâches importantes et gardez une vue d'ensemble de vos échéances à venir.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-muted/30 to-background z-0"></div>
            <div className="container relative z-10 px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Une interface intuitive et élégante</h2>
                <p className="text-muted-foreground mt-4 max-w-[700px] mx-auto">
                  Conçue pour vous offrir la meilleure expérience utilisateur possible
                </p>
              </div>
              <div className="relative mx-auto max-w-6xl">
                <div className="rounded-xl overflow-hidden shadow-2xl border border-border/50">
                  <div className="aspect-[16/9] bg-muted/30 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full max-w-5xl bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-border/50">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold">
                              T
                            </div>
                            <span className="font-bold text-lg">Focus-List</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-foreground"
                              >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          <div className="col-span-1">
                            <div className="bg-muted/50 rounded-lg p-4 h-48">
                              <Image
                                src="/pic4.avif"
                                alt="Interface de gestion de tâches"
                                width={300}
                                height={300}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="bg-muted/50 rounded-lg p-6 h-48">
                              <h3 className="text-xl font-semibold mb-3">Gérez vos tâches efficacement</h3>
                              <p className="text-base text-muted-foreground">
                                Une interface claire et organisée pour suivre vos projets et atteindre vos objectifs. 
                                Visualisez vos progrès et restez productif.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 -z-10 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 blur-3xl"></div>
                <div className="absolute -top-6 -left-6 -z-10 h-40 w-40 rounded-full bg-gradient-to-br from-pink-500/20 to-primary/20 blur-3xl"></div>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container px-4 md:px-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Prêt à commencer?</h2>
                <p className="text-muted-foreground mb-8 max-w-[600px] mx-auto">
                  Rejoignez des milliers d'utilisateurs qui organisent déjà leur vie avec Focus-List
                </p>
                <Link href="/tasks">
                  <Button
                    size="lg"
                    className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90"
                  >
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <footer className="border-t bg-muted/20 backdrop-blur-sm">
          <div className="container flex flex-col md:flex-row py-8 items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="font-bold text-lg">Focus-List</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Focus-List. Tous droits réservés.</p>
            <nav className="flex gap-6">
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
                Conditions d'utilisation
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
                Politique de confidentialité
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
                Contact
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </LayoutContent>
  )
}
