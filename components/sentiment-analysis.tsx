"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const sentimentData = [
  { name: "Positive", value: 234, color: "#10b981" },
  { name: "Neutral", value: 456, color: "#6b7280" },
  { name: "Negative", value: 189, color: "#ef4444" },
  { name: "Urgent", value: 67, color: "#f59e0b" },
]

const socialMediaData = [
  { platform: "Twitter", posts: 1247, sentiment: 2.3, engagement: 89 },
  { platform: "Facebook", posts: 892, sentiment: 1.8, engagement: 76 },
  { platform: "Instagram", posts: 634, sentiment: 3.1, engagement: 94 },
  { platform: "YouTube", posts: 234, sentiment: 2.7, engagement: 82 },
]

const keywordData = [
  { keyword: "tsunami", mentions: 456, trend: 23 },
  { keyword: "flooding", mentions: 389, trend: -12 },
  { keyword: "waves", mentions: 234, trend: 45 },
  { keyword: "evacuation", mentions: 189, trend: 67 },
  { keyword: "emergency", mentions: 156, trend: 34 },
]

export function SentimentAnalysis() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Sentiment</CardTitle>
            <CardDescription>Public sentiment analysis from social media posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Engagement</CardTitle>
            <CardDescription>Social media platform performance and reach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={socialMediaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="posts" fill="#3b82f6" name="Posts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Keywords</CardTitle>
          <CardDescription>Most mentioned hazard-related terms and their trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {keywordData.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">#{keyword.keyword}</Badge>
                  <span className="font-medium">{keyword.mentions} mentions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm font-medium ${
                      keyword.trend > 0 ? "text-green-600" : keyword.trend < 0 ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {keyword.trend > 0 ? "+" : ""}
                    {keyword.trend}%
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      keyword.trend > 0 ? "bg-green-500" : keyword.trend < 0 ? "bg-red-500" : "bg-gray-500"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Social Media Posts</CardTitle>
          <CardDescription>AI-analyzed posts with sentiment and relevance scoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                platform: "Twitter",
                user: "@coastalresident",
                content: "Huge waves at the beach today! Stay safe everyone 🌊",
                sentiment: "Neutral",
                relevance: 85,
                time: "2 hours ago",
              },
              {
                platform: "Facebook",
                user: "Marina Bay Community",
                content: "Water levels rising near the pier. Authorities have been notified.",
                sentiment: "Urgent",
                relevance: 95,
                time: "4 hours ago",
              },
              {
                platform: "Instagram",
                user: "@surfer_dude",
                content: "Perfect waves today! Thanks to OceanGuard for the safety updates 🏄‍♂️",
                sentiment: "Positive",
                relevance: 70,
                time: "6 hours ago",
              },
            ].map((post, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{post.platform}</Badge>
                    <span className="font-medium text-sm">{post.user}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
                <p className="text-sm mb-3">{post.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        post.sentiment === "Positive"
                          ? "default"
                          : post.sentiment === "Urgent"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {post.sentiment}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Relevance: {post.relevance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
