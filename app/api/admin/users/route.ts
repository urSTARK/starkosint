import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    const users = await db
      .collection("users")
      .find({})
      .project({ id: "$_id", username: 1, is_active: 1, created_at: 1, terminated_at: 1 })
      .sort({ created_at: -1 })
      .toArray()

    const formattedUsers = users.map((user) => ({
      id: user.id.toString(),
      username: user.username,
      is_active: user.is_active,
      created_at: user.created_at,
      terminated_at: user.terminated_at,
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error("Fetch users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const passwordHash = hashPassword(password)

    // Check if username already exists
    const existingUser = await db.collection("users").findOne({ username })
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Create new user
    const result = await db.collection("users").insertOne({
      username,
      password_hash: passwordHash,
      is_active: true,
      created_at: new Date(),
      created_by: "admin",
      terminated_at: null,
      terminated_by: null,
    })

    return NextResponse.json({
      id: result.insertedId.toString(),
      username,
      is_active: true,
      created_at: new Date(),
    })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const db = await getDatabase()
    const { ObjectId } = await import("mongodb")

    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(userId),
      is_active: false,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found or is still active" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
