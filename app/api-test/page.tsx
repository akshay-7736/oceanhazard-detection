"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const testEndpoints = [
    {
      name: "Generate Alert",
      method: "POST",
      url: "/api/alerts/generate",
      data: {
        hazardData: {
          type: "tsunami",
          location: { address: "Coastal Zone A", lat: 40.7128, lng: -74.006 },
        },
        severity: "high",
        channels: ["sms", "email", "push"],
        recipients: ["all-citizens"],
      },
    },
    {
      name: "Submit Report",
      method: "POST",
      url: "/api/reports/submit",
      data: new FormData(),
    },
    {
      name: "Get Analytics",
      method: "GET",
      url: "/api/analytics/reports?eventType=tsunami&location=coastal-zone-a",
    },
    {
      name: "Social Monitor",
      method: "GET",
      url: "/api/social/monitor?platform=twitter&keywords=tsunami,flood",
    },
  ]

  const testApi = async (endpoint: any) => {
    setLoading(true)
    try {
      let response

      if (endpoint.method === "GET") {
        response = await fetch(endpoint.url)
      } else {
        const options: RequestInit = {
          method: endpoint.method,
          headers: endpoint.url.includes("reports/submit")
            ? {}
            : {
                "Content-Type": "application/json",
              },
        }

        if (endpoint.data) {
          if (endpoint.data instanceof FormData) {
            // For form data endpoints
            const formData = new FormData()
            formData.append("userId", "test-user")
            formData.append("type", "tsunami")
            formData.append("description", "Test hazard report")
            formData.append("severity", "high")
            formData.append("lat", "40.7128")
            formData.append("lng", "-74.006")
            formData.append("address", "Test Location")
            options.body = formData
          } else {
            options.body = JSON.stringify(endpoint.data)
          }
        }

        response = await fetch(endpoint.url, options)
      }

      const result = await response.json()

      setTestResults((prev) => [
        ...prev,
        {
          endpoint: endpoint.name,
          status: response.status,
          success: response.ok,
          data: result,
          timestamp: new Date().toISOString(),
        },
      ])
    } catch (error) {
      setTestResults((prev) => [
        ...prev,
        {
          endpoint: endpoint.name,
          status: "Error",
          success: false,
          data: { error: error.message },
          timestamp: new Date().toISOString(),
        },
      ])
    }
    setLoading(false)
  }

  const clearResults = () => setTestResults([])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Test Dashboard</h1>
          <p className="text-muted-foreground">Test the Ocean Hazard Management System APIs</p>
        </div>
        <Button onClick={clearResults} variant="outline">
          Clear Results
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {testEndpoints.map((endpoint, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{endpoint.name}</CardTitle>
              <CardDescription className="text-xs">
                <Badge variant="outline" className="text-xs">
                  {endpoint.method}
                </Badge>
                <span className="ml-2 font-mono text-xs">{endpoint.url}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => testApi(endpoint)} disabled={loading} className="w-full" size="sm">
                {loading ? "Testing..." : "Test API"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{result.endpoint}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={result.success ? "default" : "destructive"}>{result.status}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
