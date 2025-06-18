"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Star, Shield, User } from "lucide-react"
import Link from "next/link"

function highlightKeywords(title: string, keywords: string[]) {
  if (!keywords || keywords.length === 0) return title

  let highlightedTitle = title
  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, "gi")
    highlightedTitle = highlightedTitle.replace(regex, '<span class="text-green-400 font-bold">$1</span>')
  })

  return <span dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
}

function renderStory(story: string | string[]) {
  if (!story) return null

  if (Array.isArray(story)) {
    return story.map((paragraph, index) => (
      <p key={index} className="text-lg text-gray-300 leading-relaxed mb-6">
        {paragraph}
      </p>
    ))
  }

  if (typeof story === "string") {
    return story.split("\n\n").map((paragraph, index) => (
      <p key={index} className="text-lg text-gray-300 leading-relaxed mb-6">
        {paragraph}
      </p>
    ))
  }

  return <p className="text-lg text-gray-300 leading-relaxed mb-6">{String(story)}</p>
}

export default function TunnelPage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchTunnel() {
      try {
        const response = await fetch(`/api/tunnels/${params.slug}`)

        if (!response.ok) {
          setError(true)
          setLoading(false)
          return
        }

        const tunnelData = await response.json()
        setData(tunnelData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching tunnel:", err)
        setError(true)
        setLoading(false)
      }
    }

    fetchTunnel()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du tunnel...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tunnel non trouvé</h1>
          <p className="text-gray-400 mb-6">Ce tunnel n'existe pas ou a expiré.</p>
          <Link href="/">
            <Button className="bg-green-500 hover:bg-green-400 text-black">Retour à STARTIA</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-green-400">
              <ArrowLeft className="h-4 w-4" />
              Retour à STARTIA
            </Button>
          </Link>
          <span className="text-sm text-gray-400">Généré par STARTIA</span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen bg-black text-white px-6 py-16">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-600 opacity-10 rounded-full blur-3xl"></div>

        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <p className="text-sm text-gray-400">{data.tagline}</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {highlightKeywords(data.title, data.keywordHighlights)}
          </h1>

          {/* Visual placeholder */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl mx-auto shadow-lg mt-6 h-64 flex items-center justify-center">
            <span className="text-gray-400 text-sm text-center px-4">{data.visualImageUrl}</span>
          </div>

          <a
            href="#buy"
            className="mt-4 inline-block bg-green-500 text-black font-semibold py-3 px-6 rounded-full hover:bg-green-400 transition-colors"
          >
            {data.offer?.cta || "Commencer maintenant"}
          </a>
        </div>
      </div>

      {/* Features Section */}
      {data.features && (
        <section className="py-16 px-6 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {data.features.map((feature, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-400 text-sm">{feature.iconSuggestion}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Story Section */}
      {data.story && (
        <section className="py-16 px-6 bg-black">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">{renderStory(data.story)}</div>
          </div>
        </section>
      )}

      {/* Offer Section */}
      {data.offer && (
        <section id="buy" className="py-16 px-6 bg-gray-900">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800 border border-green-500/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 text-white">{data.offer.label}</h2>
              <div className="mb-6">
                <span className="text-5xl font-bold text-green-400">{data.offer.price}</span>
                {data.offer.oldPrice && (
                  <span className="text-xl text-gray-500 line-through ml-3">{data.offer.oldPrice}</span>
                )}
              </div>
              <button className="bg-green-500 text-black font-semibold py-4 px-8 rounded-full text-lg w-full hover:bg-green-400 transition-colors">
                {data.offer.cta}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Unlockables Section */}
      {data.unlockables && (
        <section className="py-16 px-6 bg-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Ce que vous allez débloquer</h2>
            <div className="space-y-6">
              {data.unlockables.map((section, index) => (
                <div key={index} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-green-400">
                    {typeof section === "object" ? section.title : section}
                  </h3>
                  {typeof section === "object" && section.bullets && (
                    <ul className="space-y-3">
                      {section.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bonus Section */}
      {data.bonus && (
        <section className="py-16 px-6 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Bonus exclusifs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.bonus.map((bonus, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-500/30 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="h-6 w-6 text-green-400" />
                    <span className="font-semibold text-green-400">Bonus {index + 1}</span>
                  </div>
                  <p className="text-gray-300">{typeof bonus === "object" ? bonus.title : bonus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guarantee Section */}
      {data.guarantee && (
        <section className="py-16 px-6 bg-black">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-6 text-white">Garantie satisfait ou remboursé</h2>
              <p className="text-lg text-gray-300">{data.guarantee}</p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {data.faq && (
        <section className="py-16 px-6 bg-gray-900">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Questions fréquentes</h2>
            <div className="space-y-4">
              {data.faq.map((item, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold mb-3 text-green-400">{item.question}</h3>
                  <p className="text-gray-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      {data.finalCallToAction && (
        <section className="py-16 px-6 bg-gradient-to-r from-green-900 to-green-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Prêt à commencer ?</h2>
            <p className="text-xl mb-8 text-green-100">{data.finalCallToAction}</p>
            <button className="bg-white text-green-800 font-semibold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors">
              {data.offer?.cta || "Accéder maintenant"}
            </button>
          </div>
        </section>
      )}

      {/* Author Section */}
      {data.author && (
        <section className="py-16 px-6 bg-black">
          <div className="max-w-3xl mx-auto text-center">
            <User className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-6 text-white">À propos de l'auteur</h2>
            <p className="text-gray-300 leading-relaxed">{data.author}</p>
          </div>
        </section>
      )}
    </main>
  )
}
