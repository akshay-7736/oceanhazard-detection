import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keywords = searchParams.get("keywords") || "tsunami,flood,earthquake,storm"
    const platform = searchParams.get("platform") || "all"

    // Mock social media data with NLP processing
    const mockSocialData = [
      {
        id: "tw-001",
        platform: "twitter",
        content: "Massive waves hitting the coast! Everyone evacuate now! #tsunami #emergency",
        author: "@coastwatcher",
        timestamp: new Date().toISOString(),
        location: { lat: 40.7128, lng: -74.006 },
        nlp: {
          sentiment: "negative",
          urgency: "high",
          hazardType: "tsunami",
          keywords: ["waves", "evacuate", "emergency"],
          confidence: 0.92,
        },
        verified: false,
      },
      {
        id: "fb-002",
        platform: "facebook",
        content: "Storm surge warning for harbor area. Boats should seek shelter immediately.",
        author: "Harbor Authority",
        timestamp: new Date().toISOString(),
        location: { lat: 40.7589, lng: -73.9851 },
        nlp: {
          sentiment: "neutral",
          urgency: "medium",
          hazardType: "storm",
          keywords: ["storm surge", "warning", "shelter"],
          confidence: 0.87,
        },
        verified: true,
      },
    ]

    // Filter by platform if specified
    const filteredData =
      platform === "all" ? mockSocialData : mockSocialData.filter((post) => post.platform === platform)

    return NextResponse.json({
      success: true,
      posts: filteredData,
      totalCount: filteredData.length,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Social monitoring failed" }, { status: 500 })
  }
}
