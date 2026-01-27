"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, RotateCcw } from "lucide-react"

export function AlertHistory() {
  const alerts = [
    {
      id: "ALT-089",
      title: "Tsunami Warning - Pacific Coast",
      severity: "Critical",
      status: "Completed",
      sent: "2024-01-15 14:30",
      recipients: 8247,
      delivered: 8102,
      failed: 12,
      deliveryRate: "98.2%",
      duration: "2 hours",
    },
    {
      id: "ALT-088",
      title: "High Wave Advisory - North Bay",
      severity: "High",
      status: "Completed",
      sent: "2024-01-15 09:15",
      recipients: 3421,
      delivered: 3398,
      failed: 5,
      deliveryRate: "99.3%",
      duration: "4 hours",
    },
    {
      id: "ALT-087",
      title: "Coastal Flooding Watch",
      severity: "Medium",
      status: "Expired",
      sent: "2024-01-14 16:45",
      recipients: 1847,
      delivered: 1832,
      failed: 8,
      deliveryRate: "99.2%",
      duration: "6 hours",
    },
    {
      id: "ALT-086",
      title: "System Maintenance Notice",
      severity: "Low",
      status: "Completed",
      sent: "2024-01-14 02:00",
      recipients: 156,
      delivered: 156,
      failed: 0,
      deliveryRate: "100%",
      duration: "1 hour",
    },
    {
      id: "ALT-085",
      title: "Storm Surge Warning",
      severity: "High",
      status: "Cancelled",
      sent: "2024-01-13 11:20",
      recipients: 5632,
      delivered: 2341,
      failed: 3,
      deliveryRate: "41.6%",
      duration: "Cancelled after 30 min",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alert History</h2>
          <p className="text-muted-foreground">View and analyze past alert campaigns</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search alerts..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert History Table */}
      <div className="space-y-4">
        {alerts.map((alert) => (
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
                            : alert.severity === "Medium"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {alert.severity}
                    </Badge>
                    <Badge
                      variant={
                        alert.status === "Completed"
                          ? "default"
                          : alert.status === "Cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {alert.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Alert ID: {alert.id} • Sent: {alert.sent} • Duration: {alert.duration}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Resend
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{alert.recipients}</p>
                  <p className="text-xs text-muted-foreground">Recipients</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-lg font-bold text-green-600">{alert.delivered}</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-lg font-bold text-red-600">{alert.failed}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{alert.deliveryRate}</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">{alert.status}</p>
                  <p className="text-xs text-muted-foreground">Final Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
