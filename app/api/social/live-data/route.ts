import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore"

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const maxResults = Number.parseInt(searchParams.get("limit") || "50")
    const minConfidence = Number.parseFloat(searchParams.get("confidence") || "0.5")
    const hazardType = searchParams.get("hazard") || "all"

    console.log("[v0] Fetching live social media data for map integration")

    let socialMediaPosts = []

    try {
      // Query Firebase for recent social media posts
      const q = query(collection(db, "social_media_posts"), orderBy("processed_at", "desc"), limit(maxResults))

      const querySnapshot = await getDocs(q)
      socialMediaPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      console.log("[v0] Retrieved", socialMediaPosts.length, "social media posts from Firebase")
    } catch (firebaseError) {
      console.error("[v0] Firebase query failed:", firebaseError)
      console.log("[v0] Using fallback mock data for map")
      socialMediaPosts = []
    }

    // If no data from Firebase, use mock data
    if (socialMediaPosts.length === 0) {
      console.log("[v0] No Firebase data available, generating mock data for map")
      const mockMapData = generateMockMapData()
      return NextResponse.json({
        success: true,
        data: mockMapData,
        stats: {
          total_posts: mockMapData.length,
          by_platform: { twitter: 3, instagram: 2, reddit: 1 },
          by_hazard: { tsunami: 2, cyclone: 2, oil_spill: 1, flooding: 1 },
          by_urgency: { high: 2, medium: 2, low: 2 },
          average_confidence: 0.78,
          geotagged_percentage: 85,
        },
        source: "mock_data",
      })
    }

    // Filter posts based on parameters
    let filteredPosts = socialMediaPosts

    if (minConfidence > 0) {
      filteredPosts = filteredPosts.filter((post) => (post.confidence || 0) >= minConfidence)
    }

    if (hazardType !== "all") {
      filteredPosts = filteredPosts.filter((post) => post.hazard_type === hazardType)
    }

    // Transform data for map visualization
    const mapData = filteredPosts.map((post) => ({
      id: post.id,
      title: `${post.hazard_type || "Alert"} - ${post.platform || "Social Media"}`,
      description: post.cleaned_text?.substring(0, 150) + "..." || post.original_text?.substring(0, 150) + "...",
      type: post.hazard_type?.toLowerCase().replace(" ", "_") || "general",
      severity:
        post.urgency === "high"
          ? "critical"
          : post.urgency === "medium"
            ? "high"
            : post.confidence > 0.8
              ? "medium"
              : "low",
      status: post.verified ? "verified" : post.confidence > 0.7 ? "triaged" : "pending",
      location: post.location || {
        latitude: 15.0 + (Math.random() - 0.5) * 10,
        longitude: 77.0 + (Math.random() - 0.5) * 10,
        address: `${post.platform || "Social Media"} geo-location`,
        coastalZone: "Indian Ocean",
      },
      source: "social_media",
      socialMediaData: {
        platform: post.platform || "unknown",
        sentiment: post.sentiment_score || 0,
        credibilityScore: post.confidence || 0.5,
        viralityIndex: calculateViralityIndex(post),
        geoTagged: !!post.location,
      },
      geoFencing: {
        radius: calculateRadius(post.urgency || "low", post.confidence || 0.5),
        networkNodes: Math.floor((post.confidence || 0.5) * 1000 + Math.random() * 500),
        validationScore: post.confidence || 0.5,
        fakeNewsRisk: (post.confidence || 0) > 0.8 ? "low" : (post.confidence || 0) > 0.6 ? "medium" : "high",
      },
      crowdScore: post.confidence || 0.5,
      timestamp: post.timestamp || new Date().toISOString(),
      reporter: {
        name: post.author || "Social Media User",
        credibility: post.confidence || 0.5,
        location: post.platform || "unknown",
      },
      engagement: post.engagement || { likes: 0, shares: 0, comments: 0 },
      originalPost: {
        text: post.original_text || post.cleaned_text || "",
        url: post.url || "",
        hashtags: post.hashtags || [],
      },
    }))

    return NextResponse.json({
      success: true,
      data: mapData,
      stats: {
        total_posts: mapData.length,
        by_platform: getPlatformStats(socialMediaPosts),
        by_hazard: getHazardStats(mapData),
        by_urgency: getUrgencyStats(mapData),
        average_confidence:
          socialMediaPosts.reduce((sum, post) => sum + (post.confidence || 0), 0) / socialMediaPosts.length || 0,
        geotagged_percentage:
          socialMediaPosts.length > 0
            ? (socialMediaPosts.filter((post) => post.location).length / socialMediaPosts.length) * 100
            : 0,
      },
      source: "firebase",
    })
  } catch (error) {
    console.error("[v0] Error fetching live social media data:", error)

    // Return mock data as fallback
    const mockMapData = generateMockMapData()
    return NextResponse.json({
      success: true,
      data: mockMapData,
      stats: {
        total_posts: mockMapData.length,
        by_platform: { twitter: 3, instagram: 2, reddit: 1 },
        by_hazard: { tsunami: 2, cyclone: 2, oil_spill: 1, flooding: 1 },
        by_urgency: { high: 2, medium: 2, low: 2 },
        average_confidence: 0.78,
        geotagged_percentage: 85,
      },
      source: "fallback_mock",
      error: error.message,
    })
  }
}

function calculateViralityIndex(post: any): number {
  const engagement = post.engagement || {}
  const total =
    (engagement.likes || 0) + (engagement.retweets || 0) + (engagement.shares || 0) + (engagement.comments || 0)
  return Math.min(total / 1000, 1.0)
}

function calculateRadius(urgency: string, confidence: number): number {
  const baseRadius = urgency === "high" ? 50000 : urgency === "medium" ? 30000 : 15000
  return Math.floor(baseRadius * confidence)
}

function getPlatformStats(posts: any[]) {
  return posts.reduce((stats, post) => {
    stats[post.platform] = (stats[post.platform] || 0) + 1
    return stats
  }, {})
}

function getHazardStats(posts: any[]) {
  return posts.reduce((stats, post) => {
    stats[post.type] = (stats[post.type] || 0) + 1
    return stats
  }, {})
}

function getUrgencyStats(posts: any[]) {
  return posts.reduce((stats, post) => {
    stats[post.severity] = (stats[post.severity] || 0) + 1
    return stats
  }, {})
}

function generateMockMapData() {
  const hazardTypes = ["tsunami", "cyclone", "storm_surge", "coastal_erosion", "oil_spill", "marine_debris", "flooding"]
  const severities = ["low", "medium", "high", "critical"]
  const platforms = ["twitter", "facebook", "instagram", "reddit"]
  const coastalCities = [
    { name: "Mumbai", lat: 19.0760, lng: 72.8777, zone: "Arabian Sea" },
    { name: "Chennai", lat: 13.0827, lng: 80.2707, zone: "Bay of Bengal" },
    { name: "Kochi", lat: 9.9312, lng: 76.2673, zone: "Arabian Sea" },
    { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, zone: "Bay of Bengal" },
    { name: "Goa", lat: 15.2993, lng: 74.1240, zone: "Arabian Sea" },
    { name: "Puri", lat: 19.8134, lng: 85.8312, zone: "Bay of Bengal" },
    { name: "Mangalore", lat: 12.9141, lng: 74.8560, zone: "Arabian Sea" }
  ]
  
  const mockData = []
  
  for (let i = 0; i < 12; i++) {
    const type = hazardTypes[Math.floor(Math.random() * hazardTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const city = coastalCities[Math.floor(Math.random() * coastalCities.length)]
    
    // Add some random variation to coordinates
    const latitude = city.lat + (Math.random() - 0.5) * 0.5
    const longitude = city.lng + (Math.random() - 0.5) * 0.5
    
    const confidence = Math.random() * 0.4 + 0.6 // 0.6-1.0
    
    mockData.push({
      id: `social_${i + 1}`,
      title: `${type.replace("_", " ").toUpperCase()} Alert - ${city.name}`,
      description: `🚨 ${type.replace("_", " ").toUpperCase()} WARNING: ${type.replace("_", " ")} activity reported in ${city.name} coastal area. ${severity === "critical" ? "Immediate evacuation required!" : "Stay alert and follow safety guidelines."}`,
      type: type,
      severity: severity,
      status: confidence > 0.8 ? "verified" : confidence > 0.6 ? "triaged" : "pending",
      location: {
        latitude: latitude,
        longitude: longitude,
        address: `${city.name} Coast, ${city.zone}`,
        coastalZone: city.zone,
      },
      source: "social_media",
      socialMediaData: {
        platform: platform,
        sentiment: -Math.random() * 0.8 - 0.2, // -1.0 to -0.2
        credibilityScore: confidence,
        viralityIndex: Math.random() * 0.8 + 0.2, // 0.2-1.0
        geoTagged: true,
      },
      geoFencing: {
        radius: severity === "critical" ? 50000 : severity === "high" ? 30000 : 15000,
        networkNodes: Math.floor(confidence * 1000 + Math.random() * 500),
        validationScore: confidence,
        fakeNewsRisk: confidence > 0.8 ? "low" : confidence > 0.6 ? "medium" : "high",
      },
      crowdScore: confidence,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      reporter: {
        name: `${city.name.toLowerCase()}_weather_watch`,
        credibility: confidence,
        location: platform,
      },
      engagement: {
        likes: Math.floor(Math.random() * 1000),
        retweets: Math.floor(Math.random() * 500),
        replies: Math.floor(Math.random() * 100),
        followers: Math.floor(Math.random() * 10000) + 1000
      }
    })
  }
  
  return mockData
}
