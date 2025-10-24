import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] GET /api/init-db called")
    const db = await getDatabase()
    console.log("[v0] Database connection successful")

    // Check if admin user already exists
    const existingAdmin = await db.collection("users").findOne({ username: "admin" })
    console.log("[v0] Existing admin check:", existingAdmin ? "Found" : "Not found")

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin user already exists",
        user: existingAdmin,
      })
    }

    // Create admin user with correct password hash
    const adminPasswordHash = hashPassword("admin123")
    console.log("[v0] Password hash generated:", adminPasswordHash)

    const result = await db.collection("users").insertOne({
      username: "admin",
      password_hash: adminPasswordHash,
      is_active: true,
      terminated_at: null,
      created_at: new Date(),
      created_by: "system",
    })

    console.log("[v0] Admin user created with ID:", result.insertedId)

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      userId: result.insertedId,
      credentials: {
        username: "admin",
        password: "admin123",
      },
    })
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: String(error),
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
