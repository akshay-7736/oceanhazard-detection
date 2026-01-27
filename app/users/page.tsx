import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus } from "lucide-react"

export default function UsersPage() {
  const users = [
    { id: 1, name: "Dr. Sarah Chen", role: "Emergency Coordinator", status: "Active", lastLogin: "2 hours ago" },
    { id: 2, name: "Mike Rodriguez", role: "Analyst", status: "Active", lastLogin: "1 day ago" },
    { id: 3, name: "Emma Thompson", role: "Citizen Reporter", status: "Active", lastLogin: "3 hours ago" },
    { id: 4, name: "James Wilson", role: "Official", status: "Inactive", lastLogin: "1 week ago" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <div className="grid gap-6">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <CardDescription>{user.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Last login: {user.lastLogin}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
