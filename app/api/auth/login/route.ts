import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    // Mock authentication logic - replace with Firebase Auth
    const mockUsers = {
      "citizen@example.com": { id: "1", role: "citizen", name: "John Citizen" },
      "official@example.com": { id: "2", role: "official", name: "Jane Official" },
      "analyst@example.com": { id: "3", role: "analyst", name: "Bob Analyst" },
    }

    const user = mockUsers[email as keyof typeof mockUsers]

    if (user && password === "password123") {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email,
          name: user.name,
          role: user.role,
        },
        token: `mock-jwt-token-${user.id}`,
      })
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
