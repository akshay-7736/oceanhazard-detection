import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

// Instagram-specific ML classification
function classifyInstagramPost(text: string, hashtags: string[]) {
  const hazardKeywords = {
    Tsunami: ["tsunami", "seismic", "wave", "earthquake"],
    Cyclone: ["cyclone", "hurricane", "storm", "winds"],
    Flooding: ["flood", "water", "inundation", "surge"],
    "Oil Spill": ["oil", "spill", "pollution", "contamination"],
    "Coastal Erosion": ["erosion", "beach", "shoreline", "damage"],
  }

  const combinedText = `${text} ${hashtags.join(" ")}`.toLowerCase()
  let bestMatch = { type: "General", confidence: 0, urgency: "low" }

  for (const [hazardType, keywords] of Object.entries(hazardKeywords)) {
    const matches = keywords.filter((keyword) => combinedText.includes(keyword)).length
    const confidence = Math.min(matches * 0.3, 1.0)

    if (confidence > bestMatch.confidence) {
      const urgency =
        combinedText.includes("emergency") || combinedText.includes("urgent")
          ? "high"
          : combinedText.includes("warning") || combinedText.includes("alert")
            ? "medium"
            : "low"
      bestMatch = { type: hazardType, confidence, urgency }
    }
  }

  return bestMatch
}

// Mock Instagram data (replace with actual Instagram Basic Display API)
async function fetchInstagramData(query: string, maxResults = 15) {
  const mockPosts = [
    {
      id: `ig_${Date.now()}_1`,
      caption:
        "Devastating cyclone damage at Marina Beach Chennai. Never seen waves this high! Stay safe everyone 🌊⚠️ #CycloneDamage #ChennaiFloods #StaySafe #MarinaBreach",
      media_type: "IMAGE",
      media_url: "/cyclone-damage-beach.jpg",
      timestamp: new Date().toISOString(),
      username: "chennai_weather_watch",
      like_count: 892,
      comments_count: 156,
      hashtags: ["CycloneDamage", "ChennaiFloods", "StaySafe", "MarinaBreach"],
    },
    {
      id: `ig_${Date.now()}_2`,
      caption:
        "Oil spill cleanup volunteers needed at Juhu Beach Mumbai. Marine life severely affected. Please share and help! 🐢💔 #OilSpillCleanup #SaveMarineLife #MumbaiBeaches #VolunteerNeeded",
      media_type: "CAROUSEL_ALBUM",
      media_url: "/placeholder-v0ht9.png",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      username: "mumbai_ocean_guardians",
      like_count: 1247,
      comments_count: 89,
      hashtags: ["OilSpillCleanup", "SaveMarineLife", "MumbaiBeaches", "VolunteerNeeded"],
    },
    {
      id: `ig_${Date.now()}_3`,
      caption:
        "Tsunami warning sirens testing in Puducherry today. Coastal residents please participate in evacuation drill 🚨 #TsunamiDrill #PuducherryAlert #CoastalSafety #EmergencyPrep",
      media_type: "VIDEO",
      media_url: "/placeholder-jminn.png",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      username: "puducherry_disaster_mgmt",
      like_count: 445,
      comments_count: 67,
      hashtags: ["TsunamiDrill", "PuducherryAlert", "CoastalSafety", "EmergencyPrep"],
    },
  ]

  return mockPosts.map((post) => {
    const classification = classifyInstagramPost(post.caption, post.hashtags)

    return {
      id: post.id,
      platform: "instagram",
      original_text: post.caption,
      cleaned_text: post.caption.replace(/[🌊⚠️🐢💔🚨]/gu, "").trim(),
      author: post.username,
      timestamp: post.timestamp,
      media_url: post.media_url,
      media_type: post.media_type,
      location: null, // Instagram location would require additional API calls
      hazard_type: classification.type,
      confidence: classification.confidence,
      urgency: classification.urgency,
      engagement: {
        likes: post.like_count,
        comments: post.comments_count,
        shares: Math.floor(post.like_count * 0.1),
      },
      hashtags: post.hashtags,
      verified: classification.confidence > 0.6,
      sentiment_score: calculateSentiment(post.caption),
    }
  })
}

function calculateSentiment(text: string): number {
  const positiveWords = ["safe", "help", "support", "recovery", "relief", "rescued"]
  const negativeWords = ["danger", "emergency", "disaster", "damage", "destroy", "devastating"]

  const words = text.toLowerCase().split(/\s+/)
  let score = 0

  words.forEach((word) => {
    if (positiveWords.includes(word)) score += 1
    if (negativeWords.includes(word)) score -= 1
  })

  return Math.max(-1, Math.min(1, (score / words.length) * 10))
}

export async function POST(request: NextRequest) {
  try {
    const { query, maxResults } = await request.json()

    console.log("[v0] Starting Instagram extraction with query:", query)

    const instagramData = await fetchInstagramData(query, maxResults)

    console.log("[v0] Processed", instagramData.length, "Instagram posts with ML classification")

    // Store in Firebase asynchronously
    const storePromises = instagramData.map(async (post) => {
      try {
        const docRef = await addDoc(collection(db, "social_media_posts"), {
          ...post,
          created_at: serverTimestamp(),
          processed_at: serverTimestamp(),
        })
        return docRef.id
      } catch (error) {
        console.error("[v0] Firebase storage error for Instagram post:", post.id, error)
        return null
      }
    })

    Promise.all(storePromises)
      .then((results) => {
        const successCount = results.filter((id) => id !== null).length
        console.log("[v0] Successfully stored", successCount, "Instagram posts in Firebase")
      })
      .catch((error) => {
        console.error("[v0] Instagram Firebase batch storage error:", error)
      })

    return NextResponse.json({
      success: true,
      data: instagramData,
      stats: {
        total_posts: instagramData.length,
        hazard_posts: instagramData.filter((p) => p.confidence > 0.5).length,
        high_confidence: instagramData.filter((p) => p.confidence > 0.7).length,
        with_media: instagramData.filter((p) => p.media_url).length,
      },
    })
  } catch (error) {
    console.error("[v0] Instagram extraction error:", error)
    return NextResponse.json({ success: false, error: "Failed to extract Instagram data" }, { status: 500 })
  }
}
