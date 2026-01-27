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

// Reddit-specific classification with subreddit context
function classifyRedditPost(title: string, selftext: string, subreddit: string) {
  const hazardSubreddits = {
    weather: 0.8,
    naturaldisasters: 0.9,
    tsunami: 1.0,
    hurricane: 0.9,
    flooding: 0.8,
    environment: 0.6,
    india: 0.5,
    mumbai: 0.6,
    chennai: 0.6,
    kerala: 0.6,
  }

  const combinedText = `${title} ${selftext}`.toLowerCase()
  const subredditWeight = hazardSubreddits[subreddit.toLowerCase()] || 0.3

  const hazardKeywords = {
    Tsunami: ["tsunami", "seismic wave", "underwater earthquake", "tidal wave"],
    Cyclone: ["cyclone", "hurricane", "typhoon", "storm", "landfall"],
    Flooding: ["flood", "flooding", "storm surge", "inundation", "waterlogging"],
    "Oil Spill": ["oil spill", "marine pollution", "tanker", "crude oil leak"],
    "Coastal Erosion": ["erosion", "coastal damage", "shoreline", "beach erosion"],
  }

  let bestMatch = { type: "General", confidence: 0, urgency: "low" }

  for (const [hazardType, keywords] of Object.entries(hazardKeywords)) {
    const matches = keywords.filter((keyword) => combinedText.includes(keyword)).length
    const confidence = Math.min(matches * 0.25 + subredditWeight * 0.5, 1.0)

    if (confidence > bestMatch.confidence) {
      const urgency =
        combinedText.includes("emergency") || combinedText.includes("breaking")
          ? "high"
          : combinedText.includes("warning") || combinedText.includes("alert")
            ? "medium"
            : "low"
      bestMatch = { type: hazardType, confidence, urgency }
    }
  }

  return bestMatch
}

// Mock Reddit data (replace with actual Reddit API)
async function fetchRedditData(query: string, maxResults = 10) {
  const mockPosts = [
    {
      id: `reddit_${Date.now()}_1`,
      title: "Breaking: Major tsunami warning issued for Indian Ocean after 8.1 magnitude earthquake",
      selftext:
        "Just received official warning from Indian Meteorological Department. Earthquake epicenter 200km southwest of Sumatra. Coastal areas of Tamil Nadu, Andhra Pradesh, and Kerala should evacuate immediately. Estimated wave arrival in 3-4 hours.",
      subreddit: "naturaldisasters",
      author: "IndianWeatherAlert",
      created_utc: Math.floor(Date.now() / 1000),
      score: 2847,
      num_comments: 156,
      url: "https://reddit.com/r/naturaldisasters/tsunami_warning",
    },
    {
      id: `reddit_${Date.now()}_2`,
      title: "Cyclone Michaung update: Now Category 4, expected landfall near Chennai tomorrow",
      selftext:
        "Latest satellite imagery shows rapid intensification. Wind speeds now 220 kmph. Storm surge of 3-4 meters expected. Chennai airport closed, trains cancelled. If you're in coastal Tamil Nadu, please evacuate to higher ground immediately.",
      subreddit: "weather",
      author: "ChennaiStormTracker",
      created_utc: Math.floor((Date.now() - 3600000) / 1000),
      score: 1923,
      num_comments: 89,
      url: "https://reddit.com/r/weather/cyclone_michaung",
    },
    {
      id: `reddit_${Date.now()}_3`,
      title: "Massive oil spill off Mumbai coast - 3000 tons leaked, marine life in danger",
      selftext:
        "Tanker collision 20km from Mumbai harbor has caused one of the worst oil spills in recent years. Coast Guard rescue operations ongoing. Beaches from Bandra to Juhu affected. Volunteers needed for cleanup. Wildlife rescue centers overwhelmed.",
      subreddit: "mumbai",
      author: "MumbaiEnvironment",
      created_utc: Math.floor((Date.now() - 7200000) / 1000),
      score: 1456,
      num_comments: 234,
      url: "https://reddit.com/r/mumbai/oil_spill_crisis",
    },
  ]

  return mockPosts.map((post) => {
    const classification = classifyRedditPost(post.title, post.selftext, post.subreddit)

    return {
      id: post.id,
      platform: "reddit",
      original_text: `${post.title}\n\n${post.selftext}`,
      cleaned_text: `${post.title} ${post.selftext}`.replace(/\n+/g, " ").trim(),
      author: post.author,
      timestamp: new Date(post.created_utc * 1000).toISOString(),
      subreddit: post.subreddit,
      url: post.url,
      location: null,
      hazard_type: classification.type,
      confidence: classification.confidence,
      urgency: classification.urgency,
      engagement: {
        upvotes: post.score,
        comments: post.num_comments,
        awards: Math.floor(post.score / 100),
      },
      verified: classification.confidence > 0.7,
      sentiment_score: calculateSentiment(post.selftext),
    }
  })
}

function calculateSentiment(text: string): number {
  const positiveWords = ["safe", "help", "support", "recovery", "relief", "rescued", "update"]
  const negativeWords = ["danger", "emergency", "disaster", "damage", "destroy", "crisis", "breaking"]

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

    console.log("[v0] Starting Reddit extraction with query:", query)

    const redditData = await fetchRedditData(query, maxResults)

    console.log("[v0] Processed", redditData.length, "Reddit posts with ML classification")

    // Store in Firebase asynchronously
    const storePromises = redditData.map(async (post) => {
      try {
        const docRef = await addDoc(collection(db, "social_media_posts"), {
          ...post,
          created_at: serverTimestamp(),
          processed_at: serverTimestamp(),
        })
        return docRef.id
      } catch (error) {
        console.error("[v0] Firebase storage error for Reddit post:", post.id, error)
        return null
      }
    })

    Promise.all(storePromises)
      .then((results) => {
        const successCount = results.filter((id) => id !== null).length
        console.log("[v0] Successfully stored", successCount, "Reddit posts in Firebase")
      })
      .catch((error) => {
        console.error("[v0] Reddit Firebase batch storage error:", error)
      })

    return NextResponse.json({
      success: true,
      data: redditData,
      stats: {
        total_posts: redditData.length,
        hazard_posts: redditData.filter((p) => p.confidence > 0.5).length,
        high_confidence: redditData.filter((p) => p.confidence > 0.7).length,
        subreddits: [...new Set(redditData.map((p) => p.subreddit))].length,
      },
    })
  } catch (error) {
    console.error("[v0] Reddit extraction error:", error)
    return NextResponse.json({ success: false, error: "Failed to extract Reddit data" }, { status: 500 })
  }
}
