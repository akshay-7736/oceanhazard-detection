export interface HazardReport {
  id: string
  title: string
  description: string
  type: "cyclone" | "tsunami" | "oil_spill" | "marine_debris" | "weather" | "other"
  severity: "low" | "medium" | "high" | "critical"
  status: "pending" | "verified" | "triaged" | "escalated"
  location: {
    latitude: number
    longitude: number
    address: string
  }
  source: "citizen" | "social_media" | "sensor" | "satellite" | "official"
  timestamp: string
  reporter: {
    name: string
    credibility: number
    location: string
  }
  media?: Array<{
    id: string
    type: "image" | "video"
    url: string
    thumbnail?: string
  }>
}

export interface CoastalHazardReport extends HazardReport {
  type: "tsunami" | "cyclone" | "storm_surge" | "coastal_erosion" | "oil_spill" | "marine_debris"
  location: {
    latitude: number
    longitude: number
    address: string
    coastalZone: string
  }
  socialMediaData?: {
    platform: string
    sentiment: number
    credibilityScore: number
    viralityIndex: number
    geoTagged: boolean
  }
  geoFencing: {
    radius: number
    networkNodes: number
    validationScore: number
    fakeNewsRisk: "low" | "medium" | "high"
  }
  crowdScore: number
}

export interface SocialMediaPost {
  id: string
  platform: "twitter" | "facebook" | "instagram" | "tiktok"
  content: string
  author: {
    username: string
    verified: boolean
    followers: number
  }
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  timestamp: string
  engagement: {
    likes: number
    shares: number
    comments: number
  }
  sentiment: number
  credibilityScore: number
  geoTagged: boolean
  hazardRelated: boolean
  aiValidated: boolean
}

export interface GeoFence {
  id: string
  center: {
    latitude: number
    longitude: number
  }
  radius: number
  type: "coastal" | "ocean" | "port" | "city"
  networkNodes: string[]
  validationRules: {
    minCredibility: number
    maxFakeNewsRisk: number
    requiredSources: number
  }
  active: boolean
}

export interface CrowdSourceData {
  id: string
  reportId: string
  userId: string
  contribution: "verification" | "additional_info" | "media" | "correction"
  content: string
  credibilityScore: number
  timestamp: string
  location?: {
    latitude: number
    longitude: number
  }
  validated: boolean
}

export interface NeuralNetworkValidation {
  id: string
  reportId: string
  algorithm: "fake_news_detection" | "sentiment_analysis" | "credibility_scoring" | "geo_validation"
  confidence: number
  result: {
    isValid: boolean
    riskLevel: "low" | "medium" | "high"
    factors: string[]
  }
  timestamp: string
  modelVersion: string
}
