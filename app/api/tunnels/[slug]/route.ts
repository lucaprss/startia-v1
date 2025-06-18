import { NextResponse } from "next/server"
import { tunnels } from "@/lib/storage"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params
    console.log(`Looking for tunnel with slug: ${slug}`)
    console.log(`Available tunnels: ${Array.from(tunnels.keys()).join(", ")}`)

    const tunnel = tunnels.get(slug)

    if (!tunnel) {
      console.log(`Tunnel not found: ${slug}`)
      return NextResponse.json({ error: "Tunnel non trouvé" }, { status: 404 })
    }

    console.log(`Found tunnel: ${tunnel.title}`)
    return NextResponse.json(tunnel)
  } catch (error) {
    console.error("Erreur API:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
