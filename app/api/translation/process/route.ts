import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json()

    // Mock translation service
    const translations = {
      "es-en": {
        "tsunami en la costa": "tsunami on the coast",
        "evacuación inmediata": "immediate evacuation",
        "peligro en el puerto": "danger at the harbor",
      },
      "fr-en": {
        "tsunami sur la côte": "tsunami on the coast",
        "évacuation immédiate": "immediate evacuation",
        "danger au port": "danger at the harbor",
      },
    }

    const translationKey = `${sourceLanguage}-${targetLanguage}`
    const translatedText = translations[translationKey]?.[text.toLowerCase()] || text

    const result = {
      originalText: text,
      translatedText,
      sourceLanguage,
      targetLanguage,
      confidence: 0.89,
      detectedLanguage: sourceLanguage,
      alternativeTranslations: [translatedText, `${translatedText} (alternative)`, `${translatedText} (formal)`],
    }

    return NextResponse.json({
      success: true,
      translation: result,
      processedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Translation failed" }, { status: 500 })
  }
}
