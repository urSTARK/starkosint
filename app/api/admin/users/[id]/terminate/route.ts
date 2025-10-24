import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const userId = new ObjectId(id)

    const result = await db.collection("users").findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          is_active: false,
          terminated_at: new Date(),
          terminated_by: "admin",
        },
      },
      { returnDocument: "after" },
    )

    if (!result.value) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: result.value._id.toString(),
      username: result.value.username,
      is_active: result.value.is_active,
      terminated_at: result.value.terminated_at,
    })
  } catch (error) {
    console.error("Terminate user error:", error)
    return NextResponse.json({ error: "Failed to terminate user" }, { status: 500 })
  }
}
