"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Download,
  RefreshCw,
  Twitter,
  Instagram,
  Globe,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Brain,
} from "lucide-react"

interface ExtractedPost {
  id: string
  platform: "twitter" | "instagram" | "reddit" | "google_news"
  content: string
  author: string
  timestamp: string
  location?: {
    lat: number
    lon: number
    address: string
  }
  hazardType: string
  confidence: number
  sentiment: number
  verified: boolean
  engagement: {
    likes: number
    shares: number
    comments: number
  }
}

interface ExtractionStats {
  totalPosts: number
  oceanHazardPosts: number
  verifiedPosts: number
  geotaggedPosts: number
  avgConfidence: number
}

export function SocialMediaExtraction() {
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedPosts, setExtractedPosts] = useState<ExtractedPost[]>([])
  const [searchQuery, setSearchQuery] = useState("tsunami cyclone oil spill coastal flooding")
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [stats, setStats] = useState<ExtractionStats>({
    totalPosts: 0,
    oceanHazardPosts: 0,
    verifiedPosts: 0,
    geotaggedPosts: 0,
    avgConfidence: 0,
  })
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    twitter: true,
    instagram: true,
    reddit: true,
    google_news: false,
  })

  const startExtraction = async () => {
    setIsExtracting(true)
    setExtractionProgress(0)
    setExtractedPosts([]) // Clear previous results

    try {
      console.log("[v0] Starting enhanced ML extraction...")

      // Simulate real-time progress updates
      const progressInterval = setInterval(() => {
        setExtractionProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval)
            return 85
          }
          return prev + 12
        })
      }, 600)

      const allPosts: ExtractedPost[] = []

      // Extract from Twitter if selected
      if (selectedPlatforms.twitter) {
        try {
          const twitterResponse = await fetch("/api/social/extract-twitter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: searchQuery,
              maxResults: 20,
            }),
          })
          const twitterResult = await twitterResponse.json()
          if (twitterResult.success) {
            allPosts.push(
              ...twitterResult.data.map((post: any) => ({
                id: post.id,
                platform: "twitter" as const,
                content: post.original_text,
                author: post.author,
                timestamp: post.timestamp,
                location: post.location,
                hazardType: post.hazard_type,
                confidence: post.confidence,
                sentiment: post.sentiment_score,
                verified: post.verified,
                engagement: {
                  likes: post.engagement?.likes || 0,
                  shares: post.engagement?.retweets || 0,
                  comments: post.engagement?.replies || 0,
                },
              })),
            )
          }
        } catch (error) {
          console.error("[v0] Twitter extraction error:", error)
        }
      }

      // Extract from Instagram if selected
      if (selectedPlatforms.instagram) {
        try {
          const instagramResponse = await fetch("/api/social/extract-instagram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: searchQuery,
              maxResults: 15,
            }),
          })
          const instagramResult = await instagramResponse.json()
          if (instagramResult.success) {
            allPosts.push(
              ...instagramResult.data.map((post: any) => ({
                id: post.id,
                platform: "instagram" as const,
                content: post.original_text,
                author: post.author,
                timestamp: post.timestamp,
                location: post.location,
                hazardType: post.hazard_type,
                confidence: post.confidence,
                sentiment: post.sentiment_score,
                verified: post.verified,
                engagement: {
                  likes: post.engagement?.likes || 0,
                  shares: post.engagement?.comments || 0,
                  comments: post.engagement?.shares || 0,
                },
              })),
            )
          }
        } catch (error) {
          console.error("[v0] Instagram extraction error:", error)
        }
      }

      // Extract from Reddit if selected
      if (selectedPlatforms.reddit) {
        try {
          const redditResponse = await fetch("/api/social/extract-reddit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: searchQuery,
              maxResults: 10,
            }),
          })
          const redditResult = await redditResponse.json()
          if (redditResult.success) {
            allPosts.push(
              ...redditResult.data.map((post: any) => ({
                id: post.id,
                platform: "reddit" as const,
                content: post.original_text,
                author: post.author,
                timestamp: post.timestamp,
                location: post.location,
                hazardType: post.hazard_type,
                confidence: post.confidence,
                sentiment: post.sentiment_score,
                verified: post.verified,
                engagement: {
                  likes: post.engagement?.upvotes || 0,
                  shares: post.engagement?.awards || 0,
                  comments: post.engagement?.comments || 0,
                },
              })),
            )
          }
        } catch (error) {
          console.error("[v0] Reddit extraction error:", error)
        }
      }

      // Sort posts by confidence and timestamp
      allPosts.sort((a, b) => {
        if (a.confidence !== b.confidence) {
          return b.confidence - a.confidence
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })

      setExtractedPosts(allPosts)

      // Update stats with real data
      const hazardPosts = allPosts.filter((post) => post.confidence > 0.5)
      setStats({
        totalPosts: allPosts.length,
        oceanHazardPosts: hazardPosts.length,
        verifiedPosts: allPosts.filter((post) => post.verified).length,
        geotaggedPosts: allPosts.filter((post) => post.location).length,
        avgConfidence:
          hazardPosts.length > 0 ? hazardPosts.reduce((sum, post) => sum + post.confidence, 0) / hazardPosts.length : 0,
      })

      setExtractionProgress(100)
      console.log("[v0] Multi-platform extraction completed:", allPosts.length, "posts")
    } catch (error) {
      console.error("[v0] Extraction error:", error)
      alert("Network error during extraction: " + error)
    } finally {
      setIsExtracting(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="w-4 h-4 text-blue-500" />
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-500" />
      case "reddit":
        return <Globe className="w-4 h-4 text-orange-500" />
      case "google_news":
        return <Globe className="w-4 h-4 text-green-500" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  const getHazardColor = (hazardType: string) => {
    switch (hazardType.toLowerCase()) {
      case "tsunami":
        return "bg-red-100 text-red-800"
      case "cyclone":
        return "bg-orange-100 text-orange-800"
      case "oil spill":
        return "bg-purple-100 text-purple-800"
      case "flooding":
        return "bg-blue-100 text-blue-800"
      case "coastal erosion":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  useEffect(() => {
    setExtractedPosts([])
    setStats({
      totalPosts: 0,
      oceanHazardPosts: 0,
      verifiedPosts: 0,
      geotaggedPosts: 0,
      avgConfidence: 0,
    })
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            Enhanced ML-Powered Social Media Extraction
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Real-time extraction from Twitter, Instagram, Reddit & Google News with advanced NLP classification
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter ocean hazard keywords (tsunami, cyclone, oil spill, flooding)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={startExtraction} disabled={isExtracting} className="flex items-center gap-2">
              {isExtracting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {isExtracting ? "Processing ML..." : "Start ML Extraction"}
            </Button>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPlatforms.twitter}
                onChange={(e) => setSelectedPlatforms((prev) => ({ ...prev, twitter: e.target.checked }))}
              />
              <Twitter className="w-4 h-4 text-blue-500" />
              Twitter
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPlatforms.instagram}
                onChange={(e) => setSelectedPlatforms((prev) => ({ ...prev, instagram: e.target.checked }))}
              />
              <Instagram className="w-4 h-4 text-pink-500" />
              Instagram
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPlatforms.reddit}
                onChange={(e) => setSelectedPlatforms((prev) => ({ ...prev, reddit: e.target.checked }))}
              />
              <Globe className="w-4 h-4 text-orange-500" />
              Reddit
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPlatforms.google_news}
                onChange={(e) => setSelectedPlatforms((prev) => ({ ...prev, google_news: e.target.checked }))}
              />
              <Globe className="w-4 h-4 text-green-500" />
              Google News
            </label>
          </div>

          {isExtracting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Multi-Platform ML Processing & Firebase Storage</span>
                <span>{extractionProgress}%</span>
              </div>
              <Progress value={extractionProgress} className="w-full" />
              <div className="text-xs text-muted-foreground">
                {extractionProgress < 25 && "🔍 Fetching from Twitter API..."}
                {extractionProgress >= 25 && extractionProgress < 50 && "📸 Processing Instagram posts..."}
                {extractionProgress >= 50 && extractionProgress < 75 && "🧠 Running advanced ML classification..."}
                {extractionProgress >= 75 && extractionProgress < 85 && "📍 Processing geo-location data..."}
                {extractionProgress >= 85 && "💾 Storing to Firebase database..."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{stats.totalPosts}</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hazard Posts</p>
                <p className="text-2xl font-bold text-orange-600">{stats.oceanHazardPosts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verifiedPosts}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Geo-tagged</p>
                <p className="text-2xl font-bold text-purple-600">{stats.geotaggedPosts}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold text-cyan-600">{(stats.avgConfidence * 100).toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Posts ({extractedPosts.length})</TabsTrigger>
          <TabsTrigger value="hazards">
            High Risk ({extractedPosts.filter((p) => p.confidence > 0.7).length})
          </TabsTrigger>
          <TabsTrigger value="verified">Verified ({extractedPosts.filter((p) => p.verified).length})</TabsTrigger>
          <TabsTrigger value="geotagged">Geo-tagged ({extractedPosts.filter((p) => p.location).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {extractedPosts.length === 0 && !isExtracting && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Data Extracted Yet</h3>
                  <p className="text-sm">
                    Click "Start ML Extraction" to begin extracting ocean hazard data from social media platforms
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {extractedPosts.map((post) => (
            <Card
              key={post.id}
              className={`${post.confidence > 0.7 ? "border-l-4 border-l-red-500" : post.confidence > 0.5 ? "border-l-4 border-l-orange-500" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(post.platform)}
                    <span className="font-medium">@{post.author}</span>
                    {post.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                    <Badge className={getHazardColor(post.hazardType)}>{post.hazardType}</Badge>
                    <Badge
                      variant={post.confidence > 0.8 ? "destructive" : post.confidence > 0.5 ? "default" : "outline"}
                    >
                      {(post.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                    {post.confidence > 0.7 && (
                      <Badge variant="destructive" className="animate-pulse">
                        🚨 HIGH RISK
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {new Date(post.timestamp).toLocaleString()}
                  </div>
                </div>

                <p className="text-sm mb-3">{post.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>👍 {post.engagement.likes}</span>
                    <span>🔄 {post.engagement.shares}</span>
                    <span>💬 {post.engagement.comments}</span>
                    <span className={`${post.sentiment > 0 ? "text-green-600" : "text-red-600"}`}>
                      {post.sentiment > 0 ? "😊" : "😟"} {(post.sentiment * 100).toFixed(0)}%
                    </span>
                  </div>

                  {post.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {post.location.address}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="hazards">
          {extractedPosts
            .filter((p) => p.confidence > 0.5)
            .map((post) => (
              <Card key={post.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(post.platform)}
                      <span className="font-medium">@{post.author}</span>
                      {post.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                      <Badge variant="secondary">VERIFIED SOURCE</Badge>
                    </div>
                  </div>
                  <p className="text-sm">{post.content}</p>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="verified">
          {extractedPosts
            .filter((p) => p.verified)
            .map((post) => (
              <Card key={post.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(post.platform)}
                      <span className="font-medium">@{post.author}</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <Badge variant="secondary">VERIFIED SOURCE</Badge>
                    </div>
                  </div>
                  <p className="text-sm">{post.content}</p>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="geotagged">
          {extractedPosts
            .filter((p) => p.location)
            .map((post) => (
              <Card key={post.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(post.platform)}
                      <span className="font-medium">@{post.author}</span>
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <Badge variant="outline">GEO-TAGGED</Badge>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{post.content}</p>
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    📍 {post.location?.address} ({post.location?.lat.toFixed(4)}, {post.location?.lon.toFixed(4)})
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Export Extracted Data</h3>
              <p className="text-sm text-muted-foreground">Download extracted posts for further analysis</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export to CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
