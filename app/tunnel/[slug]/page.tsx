"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import TunnelPage from "@/components/tunnel-page"

export default function TunnelPageWrapper({ params }: { params: { slug: string } }) {
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black py-4 px-6 relative z-50">
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

      {/* Tunnel Content */}
      <TunnelPage data={data} />
    </div>
  )
}
