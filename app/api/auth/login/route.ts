import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    const db = await getDatabase()
    const passwordHash = hashPassword(password)

    const adminExists = await db.collection("users").findOne({ username: "admin" })
    if (!adminExists && username === "admin" && password === "admin123") {
      await db.collection("users").insertOne({
        username: "admin",
        password_hash: hashPassword("admin123"),
        is_active: true,
        created_at: new Date(),
        terminated_at: null,
      })
      console.log("[v0] Admin user created automatically")
    }

    // Find user in MongoDB
    const user = await db.collection("users").findOne({ username })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if account is terminated
    if (user.terminated_at) {
      return NextResponse.json({ error: "Account terminated" }, { status: 403 })
    }

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json({ error: "Account inactive" }, { status: 403 })
    }

    // Verify password
    if (user.password_hash !== passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      username: user.username,
      isAdmin: user.username === "admin",
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
