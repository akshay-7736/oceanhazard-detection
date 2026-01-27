"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCreator } from "@/components/alert-creator"
import { AlertTemplates } from "@/components/alert-templates"
import { AlertHistory } from "@/components/alert-history"
import { RecipientGroups } from "@/components/recipient-groups"
import { AlertTriangle, Send, Users, Plus, Bell } from "lucide-react"

export function AlertManagement() {
  const [showCreator, setShowCreator] = useState(false)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Alert Management System</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Create, manage, and track emergency alerts and notifications
          </p>
        </div>
        <Button onClick={() => setShowCreator(true)} className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Currently broadcasting</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
            <Send className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground">Across all groups</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Bell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Creator Modal */}
      {showCreator && <AlertCreator onClose={() => setShowCreator(false)} />}

      {/* Main Content Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                id: "ALT-001",
                title: "Tsunami Warning - Pacific Coast",
                severity: "Critical",
                status: "Broadcasting",
                recipients: 8247,
                delivered: 8102,
                failed: 12,
                pending: 133,
                created: "15 minutes ago",
                expires: "2 hours",
              },
              {
                id: "ALT-002",
                title: "High Wave Advisory - North Bay",
                severity: "High",
                status: "Broadcasting",
                recipients: 3421,
                delivered: 3398,
                failed: 5,
                pending: 18,
                created: "1 hour ago",
                expires: "4 hours",
              },
              {
                id: "ALT-003",
                title: "Coastal Flooding Watch",
                severity: "Medium",
                status: "Scheduled",
                recipients: 1847,
                delivered: 0,
                failed: 0,
                pending: 1847,
                created: "2 hours ago",
                expires: "6 hours",
              },
            ].map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{alert.title}</h3>
                        <Badge
                          variant={
                            alert.severity === "Critical"
                              ? "destructive"
                              : alert.severity === "High"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {alert.severity}
                        </Badge>
                        <Badge variant={alert.status === "Broadcasting" ? "default" : "outline"}>{alert.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Alert ID: {alert.id} • Created {alert.created} • Expires in {alert.expires}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Stop
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{alert.recipients}</p>
                      <p className="text-xs text-muted-foreground">Total Recipients</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{alert.delivered}</p>
                      <p className="text-xs text-muted-foreground">Delivered</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{alert.failed}</p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{alert.pending}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <AlertTemplates />
        </TabsContent>

        <TabsContent value="history">
          <AlertHistory />
        </TabsContent>

        <TabsContent value="recipients">
          <RecipientGroups />
        </TabsContent>
      </Tabs>
    </div>
  )
}
