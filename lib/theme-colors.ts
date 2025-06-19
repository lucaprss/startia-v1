export function getThemeColor(prompt: string): { primary: string; primaryRgb: string; name: string } {
  const lowerPrompt = prompt.toLowerCase()

  // Technologie & Digital
  if (
    lowerPrompt.includes("tech") ||
    lowerPrompt.includes("digital") ||
    lowerPrompt.includes("app") ||
    lowerPrompt.includes("logiciel")
  ) {
    return { primary: "#3B82F6", primaryRgb: "59, 130, 246", name: "blue" }
  }

  // E-commerce & Vente
  if (
    lowerPrompt.includes("vinted") ||
    lowerPrompt.includes("vente") ||
    lowerPrompt.includes("e-commerce") ||
    lowerPrompt.includes("boutique")
  ) {
    return { primary: "#06B6D4", primaryRgb: "6, 182, 212", name: "cyan" }
  }

  // Santé & Bien-être
  if (
    lowerPrompt.includes("santé") ||
    lowerPrompt.includes("fitness") ||
    lowerPrompt.includes("sport") ||
    lowerPrompt.includes("médical") ||
    lowerPrompt.includes("alimentation") ||
    lowerPrompt.includes("nutrition")
  ) {
    return { primary: "#10B981", primaryRgb: "16, 185, 129", name: "emerald" }
  }

  // Finance & Crypto
  if (
    lowerPrompt.includes("finance") ||
    lowerPrompt.includes("crypto") ||
    lowerPrompt.includes("bitcoin") ||
    lowerPrompt.includes("investissement") ||
    lowerPrompt.includes("trading")
  ) {
    return { primary: "#F59E0B", primaryRgb: "245, 158, 11", name: "amber" }
  }

  // Éducation & Formation
  if (
    lowerPrompt.includes("formation") ||
    lowerPrompt.includes("cours") ||
    lowerPrompt.includes("éducation") ||
    lowerPrompt.includes("apprentissage") ||
    lowerPrompt.includes("ebook")
  ) {
    return { primary: "#8B5CF6", primaryRgb: "139, 92, 246", name: "violet" }
  }

  // Voyage & Tourisme
  if (
    lowerPrompt.includes("voyage") ||
    lowerPrompt.includes("italie") ||
    lowerPrompt.includes("tourisme") ||
    lowerPrompt.includes("vacances")
  ) {
    return { primary: "#059669", primaryRgb: "5, 150, 105", name: "green" }
  }

  // Mode & Beauté
  if (
    lowerPrompt.includes("mode") ||
    lowerPrompt.includes("beauté") ||
    lowerPrompt.includes("cosmétique") ||
    lowerPrompt.includes("style")
  ) {
    return { primary: "#EC4899", primaryRgb: "236, 72, 153", name: "pink" }
  }

  // Immobilier
  if (lowerPrompt.includes("immobilier") || lowerPrompt.includes("maison") || lowerPrompt.includes("appartement")) {
    return { primary: "#DC2626", primaryRgb: "220, 38, 38", name: "red" }
  }

  // Art & Créativité
  if (
    lowerPrompt.includes("art") ||
    lowerPrompt.includes("design") ||
    lowerPrompt.includes("créatif") ||
    lowerPrompt.includes("photo")
  ) {
    return { primary: "#7C3AED", primaryRgb: "124, 58, 237", name: "purple" }
  }

  // Gaming
  if (lowerPrompt.includes("gaming") || lowerPrompt.includes("jeu") || lowerPrompt.includes("esport")) {
    return { primary: "#EF4444", primaryRgb: "239, 68, 68", name: "red" }
  }

  // Par défaut - vert moderne
  return { primary: "#10B981", primaryRgb: "16, 185, 129", name: "emerald" }
}
