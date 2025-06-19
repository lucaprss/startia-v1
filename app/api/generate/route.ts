import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { NextResponse } from "next/server"
import { tunnels } from "@/lib/storage"
import { getThemeColor } from "@/lib/theme-colors"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim()
}

async function generateImageWithFal(prompt: string, themeColor: string) {
  // For now, use high-quality placeholder images until Fal AI is properly configured
  console.log("Generating image for:", prompt)

  try {
    // Check if FAL_KEY is available
    if (!process.env.FAL_KEY) {
      console.log("FAL_KEY not configured, using placeholder")
      return generatePlaceholderImage(prompt, themeColor)
    }

    const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Professional hero image for ${prompt}, modern, clean, high quality, ${themeColor} accent colors, minimalist design`,
        image_size: "landscape_4_3",
        num_inference_steps: 4,
        num_images: 1,
      }),
    })

    if (!response.ok) {
      console.error("Fal AI API error:", response.status, response.statusText)
      return generatePlaceholderImage(prompt, themeColor)
    }

    const data = await response.json()
    console.log("Successfully generated image with Fal AI")
    return data.images[0].url
  } catch (error) {
    console.error("Error generating image with Fal AI:", error)
    return generatePlaceholderImage(prompt, themeColor)
  }
}

function generatePlaceholderImage(prompt: string, themeColor: string) {
  // Create a more sophisticated placeholder based on the prompt
  const keywords = prompt.toLowerCase()
  let category = "business"

  if (keywords.includes("food") || keywords.includes("cuisine") || keywords.includes("recipe")) {
    category = "food"
  } else if (keywords.includes("tech") || keywords.includes("app") || keywords.includes("digital")) {
    category = "tech"
  } else if (keywords.includes("fitness") || keywords.includes("sport") || keywords.includes("health")) {
    category = "fitness"
  } else if (keywords.includes("travel") || keywords.includes("voyage")) {
    category = "travel"
  } else if (keywords.includes("fashion") || keywords.includes("mode")) {
    category = "fashion"
  }

  // Use Unsplash for high-quality themed images
  const unsplashCategories = {
    business: "business-work",
    food: "food-drink",
    tech: "technology",
    fitness: "health-fitness",
    travel: "travel",
    fashion: "fashion",
  }

  const unsplashCategory = unsplashCategories[category] || "business-work"
  const imageUrl = `https://source.unsplash.com/800x450/?${unsplashCategory}&${Date.now()}`

  console.log(`Using Unsplash placeholder for category: ${category}`)
  return imageUrl
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt manquant" }, { status: 400 })
    }

    console.log("Processing prompt:", prompt)

    const themeColor = getThemeColor(prompt)
    console.log("Theme color selected:", themeColor.name, themeColor.primary)

    const imageUrl = await generateImageWithFal(prompt, themeColor.name)
    console.log("Image URL generated:", imageUrl)

    const systemPrompt = `Tu es un expert en copywriting et tunnels de vente. Génère un JSON structuré pour créer une page de vente complète basée sur ce produit : "${prompt}"

Le JSON doit contenir EXACTEMENT cette structure :

{
  "title": "TITRE ULTRA ACCROCHEUR DE MAX 40 CARACTÈRES EN MAJUSCULES",
  "tagline": "Petite phrase d'accroche au-dessus du titre",
  "image_url": "${imageUrl}",
  "color": "${themeColor.primary}",
  "story": "Histoire captivante en 2-3 paragraphes qui explique le problème et la solution",
  "benefits": [
    {
      "title": "Bénéfice 1",
      "description": "Description courte",
      "icon": "Sparkles"
    },
    {
      "title": "Bénéfice 2", 
      "description": "Description courte",
      "icon": "ShieldCheck"
    },
    {
      "title": "Bénéfice 3",
      "description": "Description courte", 
      "icon": "Rocket"
    }
  ],
  "description": "Description détaillée du produit en 2-3 paragraphes",
  "offer": {
    "title": "Nom de l'offre",
    "original_price": "197€",
    "current_price": "97€",
    "cta": "Acheter maintenant"
  },
  "bonus": [
    {
      "title": "Bonus 1",
      "description": "Description du bonus",
      "value": "Valeur 47€"
    },
    {
      "title": "Bonus 2", 
      "description": "Description du bonus",
      "value": "Valeur 67€"
    }
  ],
  "testimonials": [
    {
      "name": "Marie L.",
      "text": "Témoignage authentique et détaillé",
      "result": "Résultat obtenu"
    },
    {
      "name": "Thomas K.",
      "text": "Témoignage authentique et détaillé", 
      "result": "Résultat obtenu"
    }
  ],
  "bio": {
    "name": "Nom de l'expert",
    "title": "Titre/expertise",
    "description": "Biographie crédible en 2-3 phrases",
    "achievements": ["Réalisation 1", "Réalisation 2", "Réalisation 3"]
  },
  "guarantee": {
    "title": "Garantie satisfait ou remboursé 30 jours",
    "description": "Explication de la garantie"
  },
  "faq": [
    {
      "question": "Question fréquente 1",
      "answer": "Réponse détaillée"
    },
    {
      "question": "Question fréquente 2",
      "answer": "Réponse détaillée"
    },
    {
      "question": "Question fréquente 3", 
      "answer": "Réponse détaillée"
    }
  ]
}

IMPORTANT pour le titre : 
- Maximum 40 caractères
- Tout en majuscules si possible
- Ultra accrocheur et percutant
- Doit inclure le bénéfice principal
- Exemples : "GAGNE 5000€/MOIS AVEC TON BLOG", "MAIGRIS EN 30 JOURS GARANTIS"

IMPORTANT : Renvoie UNIQUEMENT le JSON, sans explication ni texte autour. Le contenu doit être persuasif, authentique et adapté au produit "${prompt}".`

    console.log("Generating content with Grok...")

    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: systemPrompt,
      temperature: 0.7,
    })

    console.log("Content generated, parsing JSON...")

    // Parse the JSON response
    let tunnelData
    try {
      // Clean the text in case there are extra characters
      const cleanedText = text
        .trim()
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "")
      tunnelData = JSON.parse(cleanedText)
    } catch (error) {
      console.error("Error parsing JSON:", error)
      console.error("Raw text:", text)
      return NextResponse.json({ error: "Erreur de génération du contenu" }, { status: 500 })
    }

    // Generate slug from title
    const slug = slugify(tunnelData.title) + "-" + Date.now()

    // Store the tunnel data locally
    const storedData = {
      slug,
      ...tunnelData,
      createdAt: new Date().toISOString(),
      prompt: prompt,
    }

    tunnels.set(slug, storedData)
    console.log(`Successfully stored tunnel with slug: ${slug}`)

    return NextResponse.json({
      slug,
      ...tunnelData,
    })
  } catch (error) {
    console.error("Erreur API complète:", error)
    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Méthode non autorisée. Utilisez POST." }, { status: 405 })
}
