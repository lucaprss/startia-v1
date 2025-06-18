import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { NextResponse } from "next/server"
import { tunnels } from "@/lib/storage"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim()
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt manquant" }, { status: 400 })
    }

    const systemPrompt = `
Tu es un expert en landing pages qui génère une page de vente esthétique, impactante et complète.

À partir de cette demande d'un utilisateur :
"${prompt}"

Retourne-moi uniquement un JSON strictement valide avec ces clés :

- title : titre principal accrocheur (ex: "Lance ton agence OFM")
- tagline : phrase courte qui décrit un problème (ex: "Marre d'être fauché, perdu, et de galérer avec des business qui ne marchent pas ?")
- keywordHighlights : 2 ou 3 mots clés du titre à mettre en couleur (ex: "OFM", "10 000€/mois")
- visualImageUrl : une idée d'image à générer pour illustrer le produit (ex: "Un jeune entrepreneur confiant avec un ordi dans un fond sombre lumineux")
- features : 3 blocs avec { title, iconSuggestion, description } (ex: "Accès à vie", "Méthode claire", "Résultats concrets")
- story : 3-5 paragraphes de storytelling comme dans une vraie page de vente (avec promesse, preuve, plan)
- offer : un objet avec { label, price, oldPrice, cta } (ex: "Blueprint Academy", 596€, 1296€, "Accéder maintenant")
- unlockables : liste de sections à débloquer (ex: "MARKETER COMME UN PRO" avec 4 bullets chacun)
- bonus : liste de bonus exclusifs
- guarantee : description de la garantie satisfait ou remboursé
- finalCallToAction : texte de fin très persuasif pour déclencher l'achat
- faq : liste de { question, answer }
- author : courte bio inspirante du créateur

Retourne uniquement un JSON sans explication, ni texte avant ou après.
`

    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: systemPrompt,
      temperature: 0.7,
    })

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: "L'IA n'a pas renvoyé un JSON valide." }, { status: 500 })
    }

    // Validation des clés requises
    const requiredKeys = [
      "title",
      "tagline",
      "keywordHighlights",
      "visualImageUrl",
      "features",
      "story",
      "offer",
      "unlockables",
      "bonus",
      "guarantee",
      "finalCallToAction",
      "faq",
      "author",
    ]
    const missingKeys = requiredKeys.filter((key) => !data[key])

    if (missingKeys.length > 0) {
      return NextResponse.json({ error: `Clés manquantes: ${missingKeys.join(", ")}` }, { status: 500 })
    }

    // Generate slug from title
    const slug = slugify(data.title) + "-" + Date.now()

    // Store the tunnel data locally
    const tunnelData = {
      slug,
      ...data,
      createdAt: new Date().toISOString(),
      prompt: prompt,
    }

    tunnels.set(slug, tunnelData)
    console.log(`Stored tunnel with slug: ${slug}`)

    return NextResponse.json({ ...data, slug })
  } catch (error) {
    console.error("Erreur API:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Méthode non autorisée. Utilisez POST." }, { status: 405 })
}
