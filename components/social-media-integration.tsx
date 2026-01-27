"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, MapPin, Heart, Share, MessageCircle, Shield, AlertTriangle } from "lucide-react"
import { mockSocialMediaPosts } from "../data/mockData"
import type { SocialMediaPost } from "../types"

interface SocialMediaIntegrationProps {
  onPostSelect?: (post: SocialMediaPost) => void
  selectedLocation?: { lat: number; lng: number; radius: number }
}

export const SocialMediaIntegration: React.FC<SocialMediaIntegrationProps> = ({ onPostSelect, selectedLocation }) => {
  const [posts, setPosts] = useState<SocialMediaPost[]>(mockSocialMediaPosts)
  const [filter, setFilter] = useState<"all" | "verified" | "hazard" | "geotagged">("all")
  const [sortBy, setSortBy] = useState<"timestamp" | "credibility" | "engagement">("timestamp")

  const filteredPosts = posts
    .filter((post) => {
      switch (filter) {
        case "verified":
          return post.author.verified
        case "hazard":
          return post.hazardRelated
        case "geotagged":
          return post.geoTagged
        default:
          return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "credibility":
          return b.credibilityScore - a.credibilityScore
        case "engagement":
          return b.engagement.likes + b.engagement.shares - (a.engagement.likes + a.engagement.shares)
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
    })

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "🐦"
      case "facebook":
        return "📘"
      case "instagram":
        return "📷"
      case "tiktok":
        return "🎵"
      default:
        return "📱"
    }
  }

  const getCredibilityColor = (score: number) => {
    if (score >= 0.8) return "bg-green-100 text-green-800"
    if (score >= 0.6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MessageSquare className="w-5 h-5 mr-2" />
            Social Media Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All Posts
            </Button>
            <Button
              variant={filter === "verified" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("verified")}
            >
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Button>
            <Button variant={filter === "hazard" ? "default" : "outline"} size="sm" onClick={() => setFilter("hazard")}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              Hazard Related
            </Button>
            <Button
              variant={filter === "geotagged" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("geotagged")}
            >
              <MapPin className="w-3 h-3 mr-1" />
              Geo-tagged
            </Button>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="timestamp">Latest First</option>
              <option value="credibility">Highest Credibility</option>
              <option value="engagement">Most Engagement</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              post.hazardRelated ? "border-l-4 border-l-orange-500" : ""
            }`}
            onClick={() => onPostSelect?.(post)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getPlatformIcon(post.platform)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-sm">@{post.author.username}</span>
                    {post.author.verified && <Shield className="w-4 h-4 text-blue-500" />}
                    <Badge variant="secondary" className={getCredibilityColor(post.credibilityScore)}>
                      {Math.round(post.credibilityScore * 100)}% credible
                    </Badge>
                    {post.geoTagged && <MapPin className="w-4 h-4 text-green-500" />}
                  </div>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">{post.content}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {post.engagement.likes}
                      </span>
                      <span className="flex items-center">
                        <Share className="w-3 h-3 mr-1" />
                        {post.engagement.shares}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {post.engagement.comments}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          post.sentiment > 0
                            ? "bg-green-100 text-green-800"
                            : post.sentiment < -0.5
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.sentiment > 0 ? "😊 Positive" : post.sentiment < -0.5 ? "😟 Negative" : "😐 Neutral"}
                      </span>

                      {post.aiValidated && (
                        <Badge variant="outline" className="text-xs">
                          AI Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {post.location && (
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {post.location.address}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No social media posts found matching the current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
