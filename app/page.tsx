"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Mail, Facebook, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StartiaLanding() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleGenerate() {
    if (!prompt) return alert("Écris un prompt")

    setLoading(true)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) throw new Error("Erreur génération")

      const data = await res.json()
      setResult(data)

      // Add navigation logic here
      if (data.slug) {
        router.push(`/tunnel/${data.slug}`)
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Fond dégradé flou animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-purple-200/30 via-pink-200/30 to-orange-200/30 blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-8 pb-4">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">STARTIA</h1>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Crée ton tunnel de vente complet en{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                1 prompt
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Décris ton produit digital, STARTIA s'occupe du reste.
            </p>

            {/* Input Section */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                <Input
                  type="text"
                  placeholder="Je veux vendre un ebook sur l'alimentation anti-acné"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  {loading ? "Génération..." : "Générer"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Preview Section - Résultats dynamiques */}
            {result && (
              <div className="max-w-6xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">Voici ce que STARTIA a généré pour vous</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Landing Page Preview */}
                  <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Globe className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-800">Landing Page</h3>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-200">
                        <h4 className="font-bold text-lg mb-2 text-gray-900">{result.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{result.story}</p>
                        <div className="text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: result.html }} />
                      </div>

                      <p className="text-xs text-gray-500">Page de vente générée automatiquement</p>
                    </CardContent>
                  </Card>

                  {/* Email Preview */}
                  <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Email Marketing</h3>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                        <h4 className="font-bold text-sm mb-2 text-blue-900">
                          {result.email?.subject || "Email généré"}
                        </h4>
                        <p className="text-xs text-blue-800">{result.email?.body || result.email}</p>
                      </div>

                      <p className="text-xs text-gray-500">Email personnalisé et persuasif</p>
                    </CardContent>
                  </Card>

                  {/* Facebook Ad Preview */}
                  <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 md:col-span-2 lg:col-span-1">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Facebook className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Publicité Facebook</h3>
                      </div>

                      <div className="bg-gray-100 rounded-lg p-3 mb-4">
                        <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-md h-24 mb-3 flex items-center justify-center">
                          <span className="text-xs text-gray-600">Visuel accrocheur</span>
                        </div>
                        <p className="text-xs font-medium text-gray-800 mb-1">{result.ad}</p>
                      </div>

                      <p className="text-xs text-gray-500">Publicité optimisée pour Facebook</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Preview Section - Exemples statiques */}
            {!result && (
              <div className="max-w-6xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                  Voici ce que STARTIA peut générer pour vous
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Landing Page Preview */}
                  <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Globe className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-800">Landing Page</h3>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-200">
                        <h4 className="font-bold text-lg mb-2 text-gray-900">🌟 Peau Parfaite en 30 Jours</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Découvrez les secrets d'une alimentation qui transforme votre peau. Fini l'acné, bonjour la
                          confiance ! Plus de 10 000 personnes ont déjà retrouvé une peau éclatante grâce à nos méthodes
                          naturelles.
                        </p>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
                          Acheter maintenant - 29€
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500">
                        Page de vente optimisée avec storytelling et call-to-action
                      </p>
                    </CardContent>
                  </Card>

                  {/* Email Preview */}
                  <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Email Marketing</h3>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                        <h4 className="font-bold text-sm mb-2 text-blue-900">✨ Sarah, votre peau vous remerciera</h4>
                        <p className="text-xs text-blue-800 mb-2">
                          Imaginez-vous dans 30 jours avec une peau rayonnante, sans imperfections. Notre guide révèle
                          les aliments secrets qui éliminent l'acné naturellement.
                        </p>
                        <p className="text-xs text-blue-700">Offre limitée : -40% jusqu'à minuit !</p>
                      </div>

                      <p className="text-xs text-gray-500">Séquence d'emails personnalisés et persuasifs</p>
                    </CardContent>
                  </Card>

                  {/* Facebook Ad Preview */}
                  <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 md:col-span-2 lg:col-span-1">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Facebook className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Publicité Facebook</h3>
                      </div>

                      <div className="bg-gray-100 rounded-lg p-3 mb-4">
                        <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-md h-24 mb-3 flex items-center justify-center">
                          <span className="text-xs text-gray-600">Visuel accrocheur</span>
                        </div>
                        <p className="text-xs font-medium text-gray-800 mb-1">
                          🔥 STOP à l'acné ! Cette méthode naturelle fait des miracles
                        </p>
                        <p className="text-xs text-gray-600">
                          Découvrez comment Marie a éliminé son acné en changeant simplement son alimentation. Résultats
                          garantis ou remboursé !
                        </p>
                      </div>

                      <p className="text-xs text-gray-500">Publicités ciblées avec visuels et copy optimisés</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-gray-500 text-sm">Made by STARTIA</p>
        </footer>
      </div>
    </div>
  )
}
