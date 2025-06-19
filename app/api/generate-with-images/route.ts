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

async function generateImage(prompt: string) {
  try {
    // Using Fal AI for image generation
    const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: "landscape_4_3",
        num_inference_steps: 4,
        num_images: 1,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate image")
    }

    const data = await response.json()
    return data.images[0].url
  } catch (error) {
    console.error("Error generating image:", error)
    // Fallback to placeholder
    return `https://placeholder.pics/svg/800x400/000000/FFFFFF/${encodeURIComponent(prompt.slice(0, 20))}`
  }
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt manquant" }, { status: 400 })
    }

    // Generate images for different sections
    const heroImagePrompt = `Professional hero image for ${prompt}, modern, clean, high quality`
    const expertImagePrompt = `Professional headshot of an expert teacher, confident, modern lighting`

    const [heroImage, expertImage] = await Promise.all([
      generateImage(heroImagePrompt),
      generateImage(expertImagePrompt),
    ])

    const systemPrompt = `Tu es un expert du copywriting et du design de pages de vente. Génére une **page HTML/CSS complète** ultra percutante qui suit **exactement la structure de cette page : https://maelguilminglm.systeme.io/blueprint**

🔴 Le style doit être :
- Fond noir
- Texte blanc
- Détails en couleur (vert, violet ou bleu en fonction du produit)
- Halo lumineux, visuel minimaliste comme https://lovable.dev
- Responsive

Le contenu doit inclure :
1. Une **phrase d'accroche** personnalisée (petit texte)
2. Un **titre fort** avec mots-clés colorés
3. Une **image hero** - utilise cette URL : ${heroImage}
4. Un bouton "Acheter maintenant"
5. Une section avec **3 bénéfices visuels** (icone + phrase)
6. Une **description persuasive**
7. Une section avec le prix barré, prix promo, et bouton
8. Une section "Ce que tu vas débloquer" avec 3 colonnes détaillées
9. Une section "Organiser ton agence pour scaler"
10. Des **avis clients** (générés) avec photos placeholder : https://placeholder.pics/svg/80x80/333333/FFFFFF/User
11. Une **biographie** du formateur avec photo : ${expertImage}
12. Une section **bonus exclusifs**
13. Une section **satisfait ou remboursé**
14. Une section **FAQ**
15. Un dernier call-to-action avec bouton

⚠️ La page doit être **renvoyée comme du code HTML complet**, sans explication autour.

Produit : "${prompt}"`

    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: systemPrompt,
      temperature: 0.7,
    })

    // Extract title from HTML for slug generation
    const titleMatch = text.match(/<h1[^>]*>(.*?)<\/h1>/i)
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, "") : prompt

    // Generate slug from title
    const slug = slugify(title) + "-" + Date.now()

    // Store the tunnel data locally
    const tunnelData = {
      slug,
      html: text,
      title: title,
      heroImage,
      expertImage,
      createdAt: new Date().toISOString(),
      prompt: prompt,
    }

    tunnels.set(slug, tunnelData)
    console.log(`Stored tunnel with slug: ${slug}`)

    return NextResponse.json({ html: text, slug, title, heroImage, expertImage })
  } catch (error) {
    console.error("Erreur API:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
