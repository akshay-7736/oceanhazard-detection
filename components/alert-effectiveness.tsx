"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const deliveryData = [
  { channel: "SMS", sent: 8247, delivered: 8102, failed: 12, pending: 133, rate: 98.2 },
  { channel: "Email", sent: 6543, delivered: 6234, failed: 45, pending: 264, rate: 95.3 },
  { channel: "Push", sent: 5432, delivered: 5123, failed: 23, pending: 286, rate: 94.3 },
  { channel: "Sirens", sent: 234, delivered: 234, failed: 0, pending: 0, rate: 100 },
  { channel: "Radio", sent: 156, delivered: 152, failed: 2, pending: 2, rate: 97.4 },
]

const responseTimeData = [
  { time: "0-1 min", alerts: 45, percentage: 23 },
  { time: "1-3 min", alerts: 89, percentage: 45 },
  { time: "3-5 min", alerts: 34, percentage: 17 },
  { time: "5-10 min", alerts: 23, percentage: 12 },
  { time: "10+ min", alerts: 6, percentage: 3 },
]

const effectivenessData = [
  { month: "Jan", delivered: 92, acknowledged: 78, acted: 65 },
  { month: "Feb", delivered: 89, acknowledged: 75, acted: 62 },
  { month: "Mar", delivered: 94, acknowledged: 82, acted: 71 },
  { month: "Apr", delivered: 91, acknowledged: 79, acted: 68 },
  { month: "May", delivered: 93, acknowledged: 84, acted: 73 },
  { month: "Jun", delivered: 95, acknowledged: 87, acted: 76 },
]

export function AlertEffectiveness() {
  return (
    <div className="space-y-6">
      {/* Delivery Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Delivery Performance</CardTitle>
          <CardDescription>Success rates across different notification channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveryData.map((channel) => (
              <div key={channel.channel} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{channel.channel}</span>
                  <span className="text-sm text-muted-foreground">{channel.rate}%</span>
                </div>
                <Progress value={channel.rate} className="h-2" />
                <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                  <div>Sent: {channel.sent}</div>
                  <div className="text-green-600">Delivered: {channel.delivered}</div>
                  <div className="text-red-600">Failed: {channel.failed}</div>
                  <div className="text-orange-600">Pending: {channel.pending}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Analysis</CardTitle>
            <CardDescription>Alert delivery speed distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="alerts" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Effectiveness Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Effectiveness Trends</CardTitle>
            <CardDescription>Delivery, acknowledgment, and action rates over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={effectivenessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="delivered" stroke="#3b82f6" name="Delivered" strokeWidth={2} />
                  <Line type="monotone" dataKey="acknowledged" stroke="#10b981" name="Acknowledged" strokeWidth={2} />
                  <Line type="monotone" dataKey="acted" stroke="#f59e0b" name="Acted Upon" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alert Impact</CardTitle>
            <CardDescription>Measured outcomes from alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-2xl font-bold text-green-600">847</p>
                <p className="text-sm text-muted-foreground">Lives Protected</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">$2.3M</p>
                <p className="text-sm text-muted-foreground">Property Saved</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">156</p>
                <p className="text-sm text-muted-foreground">Evacuations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Feedback</CardTitle>
            <CardDescription>Alert quality ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { rating: "Excellent", count: 234, percentage: 45 },
                { rating: "Good", count: 189, percentage: 36 },
                { rating: "Fair", count: 67, percentage: 13 },
                { rating: "Poor", count: 32, percentage: 6 },
              ].map((feedback) => (
                <div key={feedback.rating} className="flex items-center justify-between">
                  <span className="text-sm">{feedback.rating}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${feedback.percentage}%` }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{feedback.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>False Alert Rate</CardTitle>
            <CardDescription>Alert accuracy metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-green-600">2.3%</div>
              <p className="text-sm text-muted-foreground">False positive rate</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>True Alerts</span>
                  <span className="text-green-600">97.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>False Alerts</span>
                  <span className="text-red-600">2.3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
